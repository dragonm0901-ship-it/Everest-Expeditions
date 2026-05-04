import { Mail, Phone } from 'lucide-react';
import { useRef } from 'react';
import InquiryForm from '../components/forms/InquiryForm.jsx';
import FAQAccordion from '../components/common/FAQAccordion.jsx';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import {
  bookingModes,
  companyProfile,
  contactChannels,
  faqs,
  journeySteps,
  reservationHighlights
} from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function BookingPage() {
  const rootRef = useRef(null);

  usePageAnimations(rootRef);

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description="Send a trip inquiry with dates, budget, destination interests, and traveler notes so Everest Expeditions can design the right itinerary."
        path="/booking"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Custom travel planning',
          provider: {
            '@type': 'TravelAgency',
            name: companyProfile.name
          }
        }}
        title="Plan Your Trip"
      />

      <PageHero
        actions={[
          { label: 'Email concierge', href: `mailto:${companyProfile.email}`, variant: 'primary-light', icon: Mail },
          { label: 'Call now', href: `tel:${companyProfile.phone.replace(/\s+/g, '')}`, variant: 'ghost-light', icon: Phone }
        ]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description="Share the trip brief and we will match you with the right destination direction, service level, and planning path."
        eyebrow="Plan your trip"
        title="A real inquiry flow for custom travel planning"
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Inquiry form"
            title="Tell us how you want the journey to feel"
            description="The more detail you share here, the more accurate our first planning response will be."
          />
          <InquiryForm />
        </div>
      </section>

      <section className="section-block section-block--muted">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="What happens next"
            title="How we move from inquiry to confirmed itinerary"
            description="This is the operational flow behind the planning experience, not just the marketing version."
          />

          <div className="reservation-highlights reservation-highlights--wide">
            {reservationHighlights.map((item) => (
              <div className="reservation-pill" data-lift key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="timeline-grid">
            {journeySteps.map((step) => (
              <article className="timeline-card" data-lift key={step.number}>
                <span className="timeline-card__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>

          <div className="detail-grid detail-grid--pillars">
            {bookingModes.map((item) => (
              <article className="detail-card detail-card--package" data-lift key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Questions"
            title="Planning and support questions travelers ask before they inquire"
            description="If the answer is trip-specific, tell us in the form and we will address it in the first response."
          />

          <FAQAccordion items={faqs} />

          <div className="contact-strip contact-strip--triple" data-reveal>
            {contactChannels.map((item) => (
              <a className="contact-strip__item" href={item.href} key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
