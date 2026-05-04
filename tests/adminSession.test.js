import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { rmSync } from 'node:fs';
import {
  createAdminSession,
  readAdminSession,
  verifyAdminCredentials
} from '../api/_lib/adminSession.js';
import { resetInquiryDatabase } from '../api/_lib/database.js';

const cleanupPaths = new Set();

test.afterEach(() => {
  resetInquiryDatabase();

  cleanupPaths.forEach((filePath) => {
    rmSync(filePath, { force: true });
    cleanupPaths.delete(filePath);
  });
});

function createDbPath() {
  return path.join(os.tmpdir(), `everest-auth-${Date.now()}-${Math.random().toString(16).slice(2)}.sqlite`);
}

test('admin credentials validate against configured username and password', () => {
  const dbPath = createDbPath();
  cleanupPaths.add(dbPath);
  process.env.INQUIRY_DB_FILE = dbPath;
  process.env.ADMIN_USERNAME = 'admin';
  process.env.ADMIN_PASSWORD = 'admin123';
  process.env.ADMIN_SESSION_SECRET = 'session-secret';

  assert.equal(verifyAdminCredentials('admin', 'admin123')?.username, 'admin');
  assert.equal(verifyAdminCredentials('admin', 'wrong'), null);
  assert.equal(verifyAdminCredentials('wrong', 'admin123'), null);
});

test('admin session token can be created and read from cookies', () => {
  const token = createAdminSession({
    id: 'staff_1',
    username: 'admin',
    role: 'admin',
    displayName: 'Site Administrator'
  });
  const session = readAdminSession({
    headers: {
      cookie: `everest_admin_session=${token}`
    }
  });

  assert.equal(session.id, 'staff_1');
  assert.equal(session.username, 'admin');
  assert.equal(session.role, 'admin');
  assert.ok(session.exp > Date.now());
});
