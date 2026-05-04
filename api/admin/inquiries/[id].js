import { getInquiryRecord, updateInquiryRecord } from '../../_lib/database.js';
import { requireAdmin, setJsonHeaders } from '../../_lib/adminAuth.js';
import { validateInquiryUpdate } from '../../../shared/admin.js';
import { applyCors, handleCorsPreflight } from '../../_lib/cors.js';

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    return JSON.parse(body);
  }

  return body;
}

export default function handler(req, res) {
  setJsonHeaders(res);

  if (!applyCors(req, res, { allowCredentials: true })) {
    res.status(403).end(JSON.stringify({ message: 'Origin not allowed.' }));
    return;
  }

  if (handleCorsPreflight(req, res, 'GET, PATCH, OPTIONS', { allowCredentials: true })) {
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  const inquiryId = String(req.query?.id ?? '').trim();

  if (!inquiryId) {
    res.status(400).end(JSON.stringify({ message: 'Missing inquiry id.' }));
    return;
  }

  if (req.method === 'GET') {
    const inquiry = getInquiryRecord(inquiryId);

    if (!inquiry) {
      res.status(404).end(JSON.stringify({ message: 'Inquiry not found.' }));
      return;
    }

    res.status(200).end(JSON.stringify({ inquiry }));
    return;
  }

  if (req.method !== 'PATCH') {
    res.status(405).end(JSON.stringify({ message: 'Method not allowed.' }));
    return;
  }

  let body;

  try {
    body = parseBody(req.body);
  } catch {
    res.status(400).end(JSON.stringify({ message: 'Malformed JSON payload.' }));
    return;
  }

  const validation = validateInquiryUpdate(body);

  if (!validation.isValid) {
    res.status(400).end(
      JSON.stringify({
        message: 'Invalid inquiry update.',
        errors: validation.errors
      })
    );
    return;
  }

  const existing = getInquiryRecord(inquiryId);

  if (!existing) {
    res.status(404).end(JSON.stringify({ message: 'Inquiry not found.' }));
    return;
  }

  const inquiry = updateInquiryRecord(inquiryId, {
    status: validation.normalized.status || existing.status,
    crmStatus: validation.normalized.crmStatus || existing.crmStatus,
    assignedTo: validation.normalized.assignedTo,
    adminNotes: validation.normalized.adminNotes
  });

  res.status(200).end(JSON.stringify({ inquiry }));
}
