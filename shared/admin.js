export const inquiryStatuses = [
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'proposal_sent', label: 'Proposal sent' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'archived', label: 'Archived' }
];

export const crmStatuses = [
  { value: 'pending', label: 'Pending sync' },
  { value: 'synced', label: 'Synced' },
  { value: 'manual_follow_up', label: 'Manual follow-up' },
  { value: 'error', label: 'Sync error' }
];

export const inquiryStatusValues = inquiryStatuses.map((item) => item.value);
export const crmStatusValues = crmStatuses.map((item) => item.value);

export function normalizeInquiryUpdate(payload = {}) {
  return {
    status: String(payload.status ?? '').trim(),
    crmStatus: String(payload.crmStatus ?? '').trim(),
    assignedTo: String(payload.assignedTo ?? '').trim(),
    adminNotes: String(payload.adminNotes ?? '').trim()
  };
}

export function validateInquiryUpdate(payload) {
  const normalized = normalizeInquiryUpdate(payload);
  const errors = {};

  if (normalized.status && !inquiryStatusValues.includes(normalized.status)) {
    errors.status = 'Invalid inquiry status.';
  }

  if (normalized.crmStatus && !crmStatusValues.includes(normalized.crmStatus)) {
    errors.crmStatus = 'Invalid CRM status.';
  }

  if (normalized.assignedTo.length > 120) {
    errors.assignedTo = 'Assigned-to field is too long.';
  }

  if (normalized.adminNotes.length > 4000) {
    errors.adminNotes = 'Admin notes are too long.';
  }

  return {
    normalized,
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
