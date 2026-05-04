export function captureError(error, context = {}) {
  if (typeof console !== 'undefined') {
    console.error(error, context);
  }

  if (typeof window !== 'undefined' && typeof window.Sentry?.captureException === 'function') {
    window.Sentry.captureException(error, { extra: context });
  }
}
