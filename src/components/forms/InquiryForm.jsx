import { useEffect, useMemo, useState } from 'react';
import { budgetOptions, destinationInterestOptions, tripTypeOptions, validateInquiryPayload } from '../../../shared/inquiry.js';
import { submitInquiry } from '../../lib/inquiryClient.js';
import { trackEvent } from '../../lib/analytics.js';
import { captureError } from '../../lib/monitoring.js';

const draftKey = 'everest-expeditions-inquiry-draft';

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  partySize: '2',
  tripType: '',
  budgetBand: '',
  destinationInterests: [],
  startDate: '',
  endDate: '',
  flexibleDates: false,
  accommodations: '',
  specialOccasion: '',
  specialRequests: '',
  consent: false,
  website: ''
};

export default function InquiryForm() {
  const [formState, setFormState] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedDraft = window.localStorage.getItem(draftKey);

    if (!storedDraft) {
      return;
    }

    try {
      setFormState((current) => ({
        ...current,
        ...JSON.parse(storedDraft)
      }));
    } catch (error) {
      captureError(error, { source: 'inquiry_draft_parse' });
    }
  }, []);

  useEffect(() => {
    if (submitted) {
      window.localStorage.removeItem(draftKey);
      return;
    }

    window.localStorage.setItem(draftKey, JSON.stringify(formState));
  }, [formState, submitted]);

  const summary = useMemo(() => {
    if (!submitted) {
      return null;
    }

    return 'Your inquiry has been sent. A planner will review the details and reply with next steps.';
  }, [submitted]);

  const updateField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    setFormState((current) => ({
      ...current,
      [field]: value
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined
    }));
  };

  const toggleInterest = (interest) => {
    setFormState((current) => {
      const destinationInterests = current.destinationInterests.includes(interest)
        ? current.destinationInterests.filter((item) => item !== interest)
        : [...current.destinationInterests, interest];

      return {
        ...current,
        destinationInterests
      };
    });
    setFieldErrors((current) => ({
      ...current,
      destinationInterests: undefined
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const payload = {
      ...formState,
      submittedAt: new Date().toISOString()
    };
    const validation = validateInquiryPayload(payload);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setSubmitError('Please fix the highlighted fields before sending your inquiry.');
      trackEvent('inquiry_validation_failed', { fieldCount: Object.keys(validation.errors).length });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitInquiry(payload);
      setSubmitted(true);
      setFieldErrors({});
      setSubmitError('');
      trackEvent('inquiry_submitted', {
        tripType: payload.tripType,
        destinationCount: payload.destinationInterests.length
      });
      setFormState(initialState);
    } catch (error) {
      captureError(error, { source: 'inquiry_submit' });
      setFieldErrors(error.fieldErrors ?? {});
      setSubmitError(error.message);
      trackEvent('inquiry_submit_failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="inquiry-form" noValidate onSubmit={handleSubmit}>
      <div className="inquiry-grid">
        <label className="field">
          <span>Lead traveler</span>
          <input name="fullName" onChange={updateField('fullName')} type="text" value={formState.fullName} />
          {fieldErrors.fullName ? <small>{fieldErrors.fullName}</small> : null}
        </label>

        <label className="field">
          <span>Email address</span>
          <input name="email" onChange={updateField('email')} type="email" value={formState.email} />
          {fieldErrors.email ? <small>{fieldErrors.email}</small> : null}
        </label>

        <label className="field">
          <span>Phone or WhatsApp</span>
          <input name="phone" onChange={updateField('phone')} type="tel" value={formState.phone} />
        </label>

        <label className="field">
          <span>Party size</span>
          <input min="1" name="partySize" onChange={updateField('partySize')} type="number" value={formState.partySize} />
          {fieldErrors.partySize ? <small>{fieldErrors.partySize}</small> : null}
        </label>

        <label className="field">
          <span>Trip type</span>
          <select name="tripType" onChange={updateField('tripType')} value={formState.tripType}>
            <option value="">Select one</option>
            {tripTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.tripType ? <small>{fieldErrors.tripType}</small> : null}
        </label>

        <label className="field">
          <span>Budget band</span>
          <select name="budgetBand" onChange={updateField('budgetBand')} value={formState.budgetBand}>
            <option value="">Select one</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.budgetBand ? <small>{fieldErrors.budgetBand}</small> : null}
        </label>

        <label className="field">
          <span>Preferred start date</span>
          <input name="startDate" onChange={updateField('startDate')} type="date" value={formState.startDate} />
          {fieldErrors.startDate ? <small>{fieldErrors.startDate}</small> : null}
        </label>

        <label className="field">
          <span>Preferred end date</span>
          <input name="endDate" onChange={updateField('endDate')} type="date" value={formState.endDate} />
          {fieldErrors.endDate ? <small>{fieldErrors.endDate}</small> : null}
        </label>
      </div>

      <div className="field field--stacked">
        <span>Destination interests</span>
        <div className="choice-grid">
          {destinationInterestOptions.map((option) => (
            <label className="choice-pill" key={option}>
              <input
                checked={formState.destinationInterests.includes(option)}
                onChange={() => toggleInterest(option)}
                type="checkbox"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {fieldErrors.destinationInterests ? <small>{fieldErrors.destinationInterests}</small> : null}
      </div>

      <div className="field field--stacked">
        <span>Stay style or accommodation preferences</span>
        <input
          name="accommodations"
          onChange={updateField('accommodations')}
          placeholder="Villa, suite, connecting rooms, wellness property, etc."
          type="text"
          value={formState.accommodations}
        />
      </div>

      <div className="field field--stacked">
        <span>Special occasion</span>
        <input
          name="specialOccasion"
          onChange={updateField('specialOccasion')}
          placeholder="Anniversary, retreat, proposal, birthday, or leave blank"
          type="text"
          value={formState.specialOccasion}
        />
      </div>

      <label className="choice-inline">
        <input checked={formState.flexibleDates} onChange={updateField('flexibleDates')} type="checkbox" />
        <span>My dates are flexible if a better option is available.</span>
      </label>

      <label className="field field--stacked">
        <span>Tell us about the trip</span>
        <textarea
          name="specialRequests"
          onChange={updateField('specialRequests')}
          placeholder="Share the pace you want, who is traveling, must-have experiences, and anything we should design around."
          rows="6"
          value={formState.specialRequests}
        />
        {fieldErrors.specialRequests ? <small>{fieldErrors.specialRequests}</small> : null}
      </label>

      <label className="field field--hidden" hidden>
        <span>Website</span>
        <input autoComplete="off" name="website" onChange={updateField('website')} tabIndex="-1" type="text" value={formState.website} />
      </label>

      <label className="choice-inline">
        <input checked={formState.consent} onChange={updateField('consent')} type="checkbox" />
        <span>I agree to be contacted about this inquiry and understand supplier terms may apply once a trip is confirmed.</span>
      </label>
      {fieldErrors.consent ? <small className="field-error">{fieldErrors.consent}</small> : null}

      {submitError ? <p className="form-status form-status--error">{submitError}</p> : null}
      {summary ? <p className="form-status form-status--success">{summary}</p> : null}

      <div className="inquiry-form__actions">
        <button className="button-pill button-pill--primary" disabled={isSubmitting} type="submit">
          <span className="button-pill__label">{isSubmitting ? 'Sending inquiry...' : 'Send inquiry'}</span>
        </button>
        <p>Your draft is saved locally in this browser until the inquiry is sent.</p>
      </div>
    </form>
  );
}
