import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { rmSync } from 'node:fs';
import adminSessionHandler from '../api/admin/session.js';
import adminInquiriesHandler from '../api/admin/inquiries.js';
import {
  insertInquiryRecord,
  resetInquiryDatabase
} from '../api/_lib/database.js';

const cleanupPaths = new Set();

function createMockResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: '',
    headersSent: false,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.headersSent = true;
      this.body = JSON.stringify(payload);
      return this;
    },
    end(payload = '') {
      this.headersSent = true;
      this.body = payload;
      return this;
    }
  };
}

function createMockRequest(method = 'GET', body = null) {
  return {
    method,
    headers: {
      'host': 'localhost:8787'
    },
    socket: {
      remoteAddress: '127.0.0.1'
    },
    query: {},
    body: body || undefined
  };
}

function createDbPath() {
  return path.join(os.tmpdir(), `everest-test-${Date.now()}-${Math.random().toString(16).slice(2)}.sqlite`);
}

test.afterEach(() => {
  resetInquiryDatabase();

  cleanupPaths.forEach((filePath) => {
    rmSync(filePath, { force: true });
    cleanupPaths.delete(filePath);
  });
});

test('admin session handler signs in and restores the session', async () => {
  process.env.ADMIN_USERNAME = 'admin';
  process.env.ADMIN_PASSWORD = 'change-me';
  process.env.ADMIN_SESSION_SECRET = 'session-secret';

  const loginReq = createMockRequest('POST', {
    username: 'admin',
    password: 'change-me'
  });
  const loginRes = createMockResponse();

  await adminSessionHandler(loginReq, loginRes);

  assert.equal(loginRes.statusCode, 200);
  assert.match(loginRes.headers['Set-Cookie'], /everest_admin_session=/);

  const sessionReq = createMockRequest('GET');
  sessionReq.headers.cookie = loginRes.headers['Set-Cookie'];
  const sessionRes = createMockResponse();

  await adminSessionHandler(sessionReq, sessionRes);

  assert.equal(sessionRes.statusCode, 200);
  assert.equal(JSON.parse(sessionRes.body).authenticated, true);
  assert.equal(JSON.parse(sessionRes.body).user.username, 'admin');
  assert.ok(JSON.parse(loginRes.body).token);
});

test('admin inquiries handler rejects unauthenticated requests', async () => {
  const req = createMockRequest('GET');
  const res = createMockResponse();

  await adminInquiriesHandler(req, res);

  assert.equal(res.statusCode, 401);
  assert.match(res.body, /Unauthorized/);
});

test('admin inquiries handler returns inquiry data for authenticated staff', async () => {
  const dbPath = createDbPath();
  cleanupPaths.add(dbPath);
  process.env.INQUIRY_DB_FILE = dbPath;
  process.env.ADMIN_USERNAME = 'admin';
  process.env.ADMIN_PASSWORD = 'change-me';
  process.env.ADMIN_SESSION_SECRET = 'session-secret';

  insertInquiryRecord({
    id: 'inq_1',
    full_name: 'Taylor Brooks',
    email: 'taylor@example.com',
    phone: '+9779800000000',
    party_size: 2,
    trip_type: 'Private escape',
    budget_band: 'USD 3,000 to 6,000 per traveler',
    destination_interests: JSON.stringify(['Swiss Alps']),
    start_date: '2026-06-10',
    end_date: '2026-06-16',
    flexible_dates: 1,
    accommodations: 'Private suite',
    special_occasion: 'Anniversary',
    special_requests: 'Need private transfers and spa access.',
    consent: 1,
    source: 'website',
    client_ip: '127.0.0.1',
    received_at: '2026-04-10T10:00:00.000Z',
    status: 'new',
    crm_status: 'pending',
    assigned_to: null,
    admin_notes: null,
    webhook_delivered: 0,
    webhook_error: null,
    updated_at: '2026-04-10T10:00:00.000Z'
  });

  const loginReq = createMockRequest('POST', {
    username: 'admin',
    password: 'change-me'
  });
  const loginRes = createMockResponse();
  await adminSessionHandler(loginReq, loginRes);
  const loginPayload = JSON.parse(loginRes.body);

  const req = createMockRequest('GET');
  req.headers.authorization = `Bearer ${loginPayload.token}`;
  req.query = {
    q: 'Taylor',
    status: 'all'
  };
  const res = createMockResponse();

  await adminInquiriesHandler(req, res);

  assert.equal(res.statusCode, 200);

  const payload = JSON.parse(res.body);
  assert.equal(payload.inquiries.length, 1);
  assert.equal(payload.inquiries[0].fullName, 'Taylor Brooks');
  assert.equal(payload.stats.total, 1);
});
