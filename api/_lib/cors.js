function isLocalOrigin(origin = '') {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

export function isAllowedOrigin(origin, allowedOrigin = process.env.ALLOWED_ORIGIN) {
  if (!origin) {
    return true;
  }

  if (!allowedOrigin) {
    return true;
  }

  if (origin === allowedOrigin) {
    return true;
  }

  return isLocalOrigin(origin);
}

export function applyCors(req, res, { allowCredentials = false } = {}) {
  const origin = req.headers.origin;
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  if (!origin) {
    return true;
  }

  if (!isAllowedOrigin(origin, allowedOrigin)) {
    return false;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');

  if (allowCredentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  return true;
}

export function handleCorsPreflight(req, res, methods, { allowCredentials = false } = {}) {
  const corsAllowed = applyCors(req, res, { allowCredentials });

  if (!corsAllowed) {
    res.status(403).end(JSON.stringify({ message: 'Origin not allowed.' }));
    return true;
  }

  if (req.method !== 'OPTIONS') {
    return false;
  }

  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).end();
  return true;
}
