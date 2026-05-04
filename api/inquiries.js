import { insertInquiryRecord, updateInquiryRecord } from './_lib/database.js';
import { setJsonHeaders } from './_lib/adminAuth.js';
import { validateInquiryPayload } from '../shared/inquiry.js';
import { applyCors, handleCorsPreflight } from './_lib/cors.js';

const requestLog = globalThis.__everestInquiryRateLimit ?? new Map();
globalThis.__everestInquiryRateLimit = requestLog;

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? req.socket?.remoteAddress ?? 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const limit = 10;
  const requests = requestLog.get(ip) ?? [];
  const recent = requests.filter((timestamp) => now - timestamp < windowMs);

  recent.push(now);
  requestLog.set(ip, recent);

  return recent.length > limit;
}

async function forwardToWebhook(payload) {
  if (!process.env.INQUIRY_WEBHOOK_URL) {
    return { delivered: false, error: null };
  }

  const response = await fetch(process.env.INQUIRY_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return { delivered: false, error: 'Webhook delivery failed.' };
  }

  return { delivered: true, error: null };
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    return JSON.parse(body);
  }

  return body;
}

export default async function handler(req, res) {
  setJsonHeaders(res);

  if (!applyCors(req, res)) {
    res.status(403).end(JSON.stringify({ message: 'Origin not allowed.' }));
    return;
  }

  if (handleCorsPreflight(req, res, 'POST, OPTIONS')) {
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).end(JSON.stringify({ message: 'Method not allowed.' }));
    return;
  }

  const clientIp = getClientIp(req);

  if (isRateLimited(clientIp)) {
    res.status(429).end(JSON.stringify({ message: 'Too many requests. Please try again shortly.' }));
    return;
  }

  let body;

  try {
    body = parseBody(req.body);
  } catch {
    res.status(400).end(JSON.stringify({ message: 'Malformed JSON payload.' }));
    return;
  }

  const validation = validateInquiryPayload(body);

  if (!validation.isValid) {
    res.status(400).end(
      JSON.stringify({
        message: 'Invalid inquiry payload.',
        errors: validation.errors
      })
    );
    return;
  }

  const receivedAt = new Date().toISOString();
  const inquiryRecord = {
    id: `inq_${Date.now()}`,
    full_name: validation.normalized.fullName,
    email: validation.normalized.email,
    phone: validation.normalized.phone,
    party_size: Number(validation.normalized.partySize),
    trip_type: validation.normalized.tripType,
    budget_band: validation.normalized.budgetBand,
    destination_interests: JSON.stringify(validation.normalized.destinationInterests),
    start_date: validation.normalized.startDate,
    end_date: validation.normalized.endDate,
    flexible_dates: validation.normalized.flexibleDates ? 1 : 0,
    accommodations: validation.normalized.accommodations,
    special_occasion: validation.normalized.specialOccasion,
    special_requests: validation.normalized.specialRequests,
    consent: validation.normalized.consent ? 1 : 0,
    source: 'website',
    client_ip: clientIp,
    received_at: receivedAt,
    status: 'new',
    crm_status: 'pending',
    assigned_to: null,
    admin_notes: null,
    webhook_delivered: 0,
    webhook_error: null,
    updated_at: receivedAt
  };

  try {
    insertInquiryRecord(inquiryRecord);

    const webhookResult = await forwardToWebhook({
      ...validation.normalized,
      id: inquiryRecord.id,
      receivedAt
    });

    if (webhookResult.delivered || webhookResult.error) {
      updateInquiryRecord(inquiryRecord.id, {
        crmStatus: webhookResult.delivered ? 'synced' : 'error',
        webhookDelivered: webhookResult.delivered,
        webhookError: webhookResult.error
      });
    }

    res.status(200).end(
      JSON.stringify({
        message: 'Inquiry received.',
        inquiryId: inquiryRecord.id
      })
    );
  } catch {
    res.status(500).end(
      JSON.stringify({
        message: 'Unable to deliver inquiry at this time.'
      })
    );
  }
}
