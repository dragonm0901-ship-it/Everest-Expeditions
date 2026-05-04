import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInquiryUpdate } from '../shared/admin.js';
import {
  allStaticRoutes,
  destinations,
  experiences,
  getDestinationBySlug,
  getExperienceBySlug,
  getStoryBySlug,
  policyPages,
  stories
} from '../src/data/siteContent.js';
import { validateInquiryPayload } from '../shared/inquiry.js';

test('core content collections exist', () => {
  assert.ok(destinations.length >= 3);
  assert.ok(experiences.length >= 3);
  assert.ok(stories.length >= 3);
  assert.ok(allStaticRoutes.includes('/booking'));
});

test('detail lookup helpers resolve by slug', () => {
  assert.equal(getDestinationBySlug(destinations[0].slug)?.slug, destinations[0].slug);
  assert.equal(getExperienceBySlug(experiences[0].slug)?.slug, experiences[0].slug);
  assert.equal(getStoryBySlug(stories[0].slug)?.slug, stories[0].slug);
});

test('policy pages are present for all policy routes', () => {
  assert.ok(policyPages.privacy);
  assert.ok(policyPages.terms);
  assert.ok(policyPages.cancellation);
});

test('inquiry validation rejects incomplete submissions', () => {
  const result = validateInquiryPayload({
    fullName: '',
    email: 'invalid',
    partySize: '0',
    specialRequests: 'short'
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.email);
  assert.ok(result.errors.fullName);
});

test('inquiry validation accepts a full submission', () => {
  const result = validateInquiryPayload({
    fullName: 'Taylor Brooks',
    email: 'taylor@example.com',
    phone: '+977 9800000000',
    partySize: '2',
    tripType: 'Private escape',
    budgetBand: 'USD 3,000 to 6,000 per traveler',
    destinationInterests: ['Swiss Alps'],
    startDate: '2026-06-10',
    endDate: '2026-06-16',
    flexibleDates: true,
    accommodations: 'Private suite',
    specialOccasion: 'Anniversary',
    specialRequests: 'We want a calm itinerary with mountain views, spa access, and private transfers.',
    consent: true,
    website: ''
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('admin update validation rejects invalid workflow values', () => {
  const result = validateInquiryUpdate({
    status: 'not-real',
    crmStatus: 'wrong'
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.status);
  assert.ok(result.errors.crmStatus);
});
