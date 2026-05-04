import { Mail, Phone } from 'lucide-react';
import { useRef } from 'react';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { companyProfile, contactChannels, officeLocations } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function ContactPage() {
  const rootRef = useRef(null);

  usePageAnimations(rootRef);

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description="Contact Everest Expeditions for custom travel planning, guest support, and pre-trip consultation."
        path="/contact"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Everest Expeditions',
          email: companyProfile.email,
          telephone: companyProfile.phone
        }}
        title="Contact Everest Expeditions"
      />

      <PageHero
        actions={[
          { label: 'Send inquiry', to: '/booking', variant: 'primary-light' },
          { label: 'Email concierge', href: `mailto:${companyProfile.email}`, variant: 'ghost-light', icon: Mail }
        ]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description="Reach our planning desk for new inquiries, in-trip support coordination, or operational questions before you confirm a journey."
        eyebrow="Contact"
        title="Talk to the planning and support team"
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Ways to reach us"
            title="Planning desk and support channels"
            description="For new travel requests, the inquiry form is the fastest way to give us the detail we need. For existing trips, use the support contact shared in your trip brief."
          />

          <div className="contact-strip contact-strip--triple">
            {contactChannels.map((item) => (
              <a className="contact-strip__item" href={item.href} key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-block--muted">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Office"
            title="Headquarters and operating hours"
            description={companyProfile.registrationNote}
          />

          <div className="detail-grid detail-grid--pillars">
            {officeLocations.map((office) => (
              <article className="detail-card detail-card--package" data-lift key={office.city}>
                <h3>{office.city}</h3>
                <p>{office.address}</p>
                <p>{office.hours}</p>
                <p>{office.note}</p>
              </article>
            ))}
          </div>

          <div className="editorial-callout" data-reveal>
            <p>
              New inquiry and need help deciding where to start? Send us the trip brief and we will route it to the right planner.
            </p>
            <a className="button-pill button-pill--secondary" href={`tel:${companyProfile.phone.replace(/\s+/g, '')}`}>
              <span className="button-pill__label">Call the office</span>
              <span className="button-pill__icon" aria-hidden="true">
                <Phone size={16} />
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
