const attempts = new Map();

/**
 * Basic in-memory rate limiter for development and single-instance production.
 * @param {string} ip The IP address to check
 * @param {Object} options Configuration options
 * @returns {Object} result { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(ip, { maxAttempts = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, resetAt: now + windowMs };

  // If the window has expired, reset the counter
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }

  const allowed = entry.count < maxAttempts;
  const remaining = Math.max(0, maxAttempts - entry.count);

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
    count: entry.count
  };
}

/**
 * Record a failed attempt
 * @param {string} ip The IP address to record
 */
export function recordAttempt(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const entry = attempts.get(ip) || { count: 0, resetAt: now + windowMs };

  entry.count += 1;
  attempts.set(ip, entry);
}

/**
 * Clear attempts for an IP (e.g., on successful login)
 * @param {string} ip The IP address to clear
 */
export function clearAttempts(ip) {
  attempts.delete(ip);
}
