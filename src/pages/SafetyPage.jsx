import { useRef } from 'react';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { preDepartureChecklist, safetyStandards } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function SafetyPage() {
  const rootRef = useRef(null);

  usePageAnimations(rootRef);

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description="Review Everest Expeditions safety standards, supplier vetting, emergency escalation approach, and traveler readiness guidance."
        path="/safety"
        title="Safety and Support"
      />

      <PageHero
        actions={[
          { label: 'Talk to a planner', to: '/booking', variant: 'primary-light' },
          { label: 'Help center', to: '/help', variant: 'ghost-light' }
        ]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description="Good travel planning includes supplier review, timing controls, escalation paths, and clear traveler preparation. This is how we approach those responsibilities."
        eyebrow="Safety"
        title="Operational standards behind every itinerary"
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Standards"
            title="How we reduce avoidable friction and risk"
            description="No travel company can remove every disruption, but a strong planning system can reduce the number of surprises and improve response when something changes."
          />

          <div className="detail-grid detail-grid--pillars">
            {safetyStandards.map((item) => (
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
            eyebrow="Traveler readiness"
            title="Preparation still matters"
            description="Even with full planning support, travelers are responsible for reviewing trip details, documents, and insurance cover before departure."
          />

          <div className="detail-card detail-card--package" data-reveal>
            <ul className="feature-list">
              {preDepartureChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
