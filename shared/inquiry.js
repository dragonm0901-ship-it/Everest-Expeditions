export const budgetOptions = [
  'Under USD 3,000 per traveler',
  'USD 3,000 to 6,000 per traveler',
  'USD 6,000 to 10,000 per traveler',
  'USD 10,000+ per traveler'
];

export const tripTypeOptions = ['Private escape', 'Group retreat', 'Celebration travel', 'Corporate travel'];

export const destinationInterestOptions = ['Swiss Alps', 'Bali Valley', 'Sahara Desert', 'Not sure yet'];

export function normalizeInquiryPayload(payload = {}) {
  return {
    fullName: String(payload.fullName ?? '').trim(),
    email: String(payload.email ?? '').trim().toLowerCase(),
    phone: String(payload.phone ?? '').trim(),
    partySize: String(payload.partySize ?? '').trim(),
    tripType: String(payload.tripType ?? '').trim(),
    budgetBand: String(payload.budgetBand ?? '').trim(),
    destinationInterests: Array.isArray(payload.destinationInterests)
      ? payload.destinationInterests.map((item) => String(item).trim()).filter(Boolean)
      : [],
    startDate: String(payload.startDate ?? '').trim(),
    endDate: String(payload.endDate ?? '').trim(),
    flexibleDates: Boolean(payload.flexibleDates),
    accommodations: String(payload.accommodations ?? '').trim(),
    specialOccasion: String(payload.specialOccasion ?? '').trim(),
    specialRequests: String(payload.specialRequests ?? '').trim(),
    consent: Boolean(payload.consent),
    website: String(payload.website ?? '').trim(),
    submittedAt: String(payload.submittedAt ?? '').trim()
  };
}

export function validateInquiryPayload(payload) {
  const normalized = normalizeInquiryPayload(payload);
  const errors = {};

  if (!normalized.fullName || normalized.fullName.length < 2) {
    errors.fullName = 'Enter the traveler name or lead contact name.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!normalized.partySize || Number.isNaN(Number(normalized.partySize)) || Number(normalized.partySize) < 1) {
    errors.partySize = 'Enter the number of travelers.';
  }

  if (!normalized.tripType) {
    errors.tripType = 'Select the type of trip you want to plan.';
  }

  if (!normalized.budgetBand) {
    errors.budgetBand = 'Select a budget range.';
  }

  if (!normalized.destinationInterests.length) {
    errors.destinationInterests = 'Choose at least one destination interest.';
  }

  if (!normalized.startDate) {
    errors.startDate = 'Select a preferred start date.';
  }

  if (!normalized.endDate) {
    errors.endDate = 'Select a preferred end date.';
  }

  if (normalized.startDate && normalized.endDate && normalized.endDate < normalized.startDate) {
    errors.endDate = 'End date must be after the start date.';
  }

  if (!normalized.specialRequests || normalized.specialRequests.length < 20) {
    errors.specialRequests = 'Share a few details about the trip so we can plan accurately.';
  }

  if (!normalized.consent) {
    errors.consent = 'You must allow us to respond to your inquiry.';
  }

  if (normalized.website) {
    errors.website = 'Spam detected.';
  }

  return {
    normalized,
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
