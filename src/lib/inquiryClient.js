import { validateInquiryPayload } from '../../shared/inquiry.js';
import { apiUrl } from './apiBase.js';

const ENDPOINT = import.meta.env.VITE_INQUIRY_ENDPOINT
  ? apiUrl(import.meta.env.VITE_INQUIRY_ENDPOINT)
  : apiUrl('/api/inquiries');

export async function submitInquiry(payload) {
  const validation = validateInquiryPayload(payload);

  if (!validation.isValid) {
    const error = new Error('Validation failed');
    error.fieldErrors = validation.errors;
    throw error;
  }

  let response;

  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validation.normalized)
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Inquiry service is unavailable. Verify that the local or deployed API is running.');
    }

    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message ?? 'Unable to submit inquiry.');
    error.fieldErrors = data.errors ?? {};
    throw error;
  }

  return data;
}
