function trimTrailingSlash(value = '') {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

const configuredBase = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || '');
const absoluteUrlPattern = /^https?:\/\//i;

export function apiUrl(path) {
  if (absoluteUrlPattern.test(path)) {
    return path;
  }

  if (!path.startsWith('/')) {
    throw new Error('API paths must start with "/"');
  }

  return configuredBase ? `${configuredBase}${path}` : path;
}
