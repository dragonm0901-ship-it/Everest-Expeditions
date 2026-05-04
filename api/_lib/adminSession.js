import crypto from 'node:crypto';
import { verifyStaffUserCredentials } from './database.js';
import { safeEqual } from './passwords.js';

const sessionCookieName = 'everest_admin_session';
const sessionDurationSeconds = 60 * 60 * 8;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_API_TOKEN || 'change-me';
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, pair) => {
    const [rawKey, ...rest] = pair.split('=');

    if (!rawKey) {
      return cookies;
    }

    cookies[rawKey.trim()] = decodeURIComponent(rest.join('=').trim());
    return cookies;
  }, {});
}

function base64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function signPayload(payload) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function verifyAdminCredentials(username, password) {
  return verifyStaffUserCredentials(username, password);
}

export function createAdminSession(user) {
  const payload = base64Url(
    JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      displayName: user.displayName,
      exp: Date.now() + sessionDurationSeconds * 1000
    })
  );
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function readAdminSession(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const authorization = req.headers.authorization || req.headers.Authorization || '';
  const bearerToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  const token = bearerToken || cookies[sessionCookieName];

  if (!token) {
    return null;
  }

  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));

    if (!decoded?.id || !decoded?.username || !decoded?.exp || decoded.exp < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(res, userOrUsername) {
  const token = typeof userOrUsername === 'string'
    ? createAdminSession({ id: userOrUsername, username: userOrUsername, role: 'admin', displayName: userOrUsername })
    : createAdminSession(userOrUsername);
  const isSecure = process.env.NODE_ENV === 'production';
  const cookie = [
    `${sessionCookieName}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${sessionDurationSeconds}`
  ];

  if (isSecure) {
    cookie.push('Secure');
  }

  res.setHeader('Set-Cookie', cookie.join('; '));
  return token;
}

export function clearAdminSessionCookie(res) {
  const isSecure = process.env.NODE_ENV === 'production';
  const cookie = [
    `${sessionCookieName}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0'
  ];

  if (isSecure) {
    cookie.push('Secure');
  }

  res.setHeader('Set-Cookie', cookie.join('; '));
}
