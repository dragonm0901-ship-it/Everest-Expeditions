import { useRef } from 'react';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { companyProfile, teamMembers, trustBadges } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function AboutPage() {
  const rootRef = useRef(null);

  usePageAnimations(rootRef);

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description={companyProfile.longDescription}
        path="/about"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Everest Expeditions',
          description: companyProfile.longDescription
        }}
        title="About Everest Expeditions"
      />

      <PageHero
        actions={[
          { label: 'Plan your trip', to: '/booking', variant: 'primary-light' },
          { label: 'Contact the team', to: '/contact', variant: 'ghost-light' }
        ]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description={companyProfile.longDescription}
        eyebrow="About us"
        title="A planner-led travel company built for calm, well-run journeys"
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="How we work"
            title="Travel planning with one accountable team"
            description="We are not a generic booking directory. We design trips, coordinate suppliers, and stay available while the journey is active."
          />

          <div className="detail-grid detail-grid--pillars">
            {trustBadges.map((item) => (
              <article className="detail-card detail-card--pillar" data-lift key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-block--muted">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Core team"
            title="The people behind the itinerary"
            description={`${companyProfile.name} operates from ${companyProfile.headquarters} with planners, operations support, and supplier coordination under one brand.`}
          />

          <div className="detail-grid detail-grid--pillars">
            {teamMembers.map((member) => (
              <article className="detail-card detail-card--package" data-lift key={member.name}>
                <p className="eyebrow">{member.role}</p>
                <h3>{member.name}</h3>
                <p>{member.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
