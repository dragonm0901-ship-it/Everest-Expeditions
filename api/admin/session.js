import { clearAdminSessionCookie, setAdminSessionCookie, verifyAdminCredentials } from '../_lib/adminSession.js';
import { readAdminSession } from '../_lib/adminSession.js';
import { setJsonHeaders } from '../_lib/adminAuth.js';
import { applyCors, handleCorsPreflight } from '../_lib/cors.js';
import { checkRateLimit, clearAttempts, recordAttempt } from '../_lib/rateLimit.js';

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

  if (handleCorsPreflight(req, res, 'GET, POST, DELETE, OPTIONS', { allowCredentials: true })) {
    return;
  }

  if (req.method === 'GET') {
    const session = readAdminSession(req);

    if (!session) {
      res.status(401).end(JSON.stringify({ message: 'Unauthorized.' }));
      return;
    }

    res.status(200).end(
      JSON.stringify({
        authenticated: true,
        user: {
          id: session.id,
          username: session.username,
          displayName: session.displayName,
          role: session.role
        }
      })
    );
    return;
  }

  if (req.method === 'DELETE') {
    clearAdminSessionCookie(res);
    res.status(200).end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method !== 'POST') {
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

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const limit = checkRateLimit(clientIp);

  if (!limit.allowed) {
    const minutes = Math.ceil((limit.resetAt - Date.now()) / 60000);
    res.status(429).end(
      JSON.stringify({
        message: `Too many login attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
      })
    );
    return;
  }

  const username = String(body.username ?? '').trim();
  const password = String(body.password ?? '');

  const user = verifyAdminCredentials(username, password);

  if (!user) {
    recordAttempt(clientIp);
    res.status(401).end(JSON.stringify({ message: 'Invalid username or password.' }));
    return;
  }

  clearAttempts(clientIp);
  const token = setAdminSessionCookie(res, user);
  res.status(200).end(
    JSON.stringify({
      authenticated: true,
      token,
      user
    })
  );
}
