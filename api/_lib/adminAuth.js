import { readAdminSession } from './adminSession.js';

export function requireAdmin(req, res) {
  const session = readAdminSession(req);

  if (!session) {
    res.status(401).end(JSON.stringify({ message: 'Unauthorized.' }));
    return false;
  }

  req.adminUser = session;
  return true;
}

export function setJsonHeaders(res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
}
