import { apiUrl } from './apiBase.js';

const adminTokenKey = 'everest_admin_token';

function getStoredAdminToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.sessionStorage.getItem(adminTokenKey) || '';
}

function storeAdminToken(token) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.sessionStorage.setItem(adminTokenKey, token);
    return;
  }

  window.sessionStorage.removeItem(adminTokenKey);
}

async function requestJson(url, options) {
  try {
    const token = getStoredAdminToken();
    const headers = new Headers(options?.headers || {});

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers
    });
    const data = await parseResponse(response);

    if (data?.token) {
      storeAdminToken(data.token);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      const networkError = new Error('Admin service is unavailable. Start the local app server or verify the deployed API.');
      networkError.cause = error;
      throw networkError;
    }

    throw error;
  }
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      storeAdminToken('');
    }

    const error = new Error(data.message ?? 'Request failed.');
    error.status = response.status;
    error.fieldErrors = data.errors ?? {};
    throw error;
  }

  return data;
}

export async function loginAdmin({ username, password }) {
  return requestJson(apiUrl('/api/admin/session'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
}

export async function fetchAdminSession() {
  return requestJson(apiUrl('/api/admin/session'));
}

export async function logoutAdmin() {
  try {
    return await requestJson(apiUrl('/api/admin/session'), {
      method: 'DELETE'
    });
  } finally {
    storeAdminToken('');
  }
}

export function clearAdminSessionState() {
  storeAdminToken('');
}

export async function fetchAdminInquiries({ query = '', status = 'all' }) {
  const search = new URLSearchParams();

  if (query) {
    search.set('q', query);
  }

  if (status) {
    search.set('status', status);
  }

  return requestJson(apiUrl(`/api/admin/inquiries?${search.toString()}`));
}

export async function fetchAdminStats() {
  return requestJson(apiUrl('/api/admin/stats'));
}

export async function searchAdmin(query) {
  return requestJson(apiUrl(`/api/admin/search?q=${encodeURIComponent(query)}`));
}

export async function updateAdminInquiry({ inquiryId, payload }) {
  return requestJson(apiUrl(`/api/admin/inquiries/${inquiryId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export async function fetchAdminDestinations() {
  return requestJson(apiUrl('/api/admin/destinations'));
}

export async function saveAdminDestination(payload) {
  return requestJson(apiUrl('/api/admin/destinations'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export async function fetchAdminExperiences() {
  return requestJson(apiUrl('/api/admin/experiences'));
}

export async function saveAdminExperience(payload) {
  return requestJson(apiUrl('/api/admin/experiences'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export async function uploadAdminFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  return requestJson(apiUrl('/api/admin/upload'), {
    method: 'POST',
    body: formData
  });
}
