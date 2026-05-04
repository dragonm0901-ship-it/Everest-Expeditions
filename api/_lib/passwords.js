import crypto from 'node:crypto';

const keyLength = 64;

function toBuffer(value) {
  return Buffer.from(String(value ?? ''), 'utf8');
}

export function safeEqual(left, right) {
  const leftBuffer = toBuffer(left);
  const rightBuffer = toBuffer(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derivedKey = crypto.scryptSync(String(password ?? ''), salt, keyLength).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
    return false;
  }

  const [salt, expectedHash] = storedHash.split(':');
  const derivedHash = crypto.scryptSync(String(password ?? ''), salt, keyLength).toString('hex');
  return safeEqual(derivedHash, expectedHash);
}
