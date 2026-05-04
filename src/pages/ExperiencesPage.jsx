import { BadgeCheck, Compass, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import CTAButton from '../components/common/CTAButton.jsx';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { journeySteps } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

const packageIcons = [Sparkles, Compass, BadgeCheck];

export default function ExperiencesPage() {
  const rootRef = useRef(null);
  const { experiences, isLoading } = useContent();

  usePageAnimations(rootRef);

  if (isLoading) {
    return <div className="page-shell"><div className="flex items-center justify-center p-20">Loading and syncing travel formats...</div></div>;
  }

  // Derive dynamic details list
  const experiencePackages = experiences.map(e => ({
    title: e.title,
    copy: e.summary,
    bullets: e.bullets
  }));

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description="Choose from planner-led travel formats designed for slow luxury, celebration travel, and balanced exploration."
        path="/experiences"
        title="Experiences"
      />

      <PageHero
        actions={[
          { label: 'Build my itinerary', to: '/booking', variant: 'primary-light' },
          { label: 'See destinations', to: '/destinations', variant: 'ghost-light' }
        ]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description="Our experiences are structured travel formats with clear inclusions, planning logic, and destination fit."
        eyebrow="Experiences"
        title="Travel formats built for the way you actually want to move"
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Signature formats"
            title="Three ways we structure a premium journey"
            description="Choose a format, then open the detail page to see inclusions, fit, and related destinations."
          />

          <div className="detail-grid detail-grid--pillars">
            {experiencePackages.map((item, index) => {
              const Icon = packageIcons[index];
              const experience = experiences[index];

              return (
                <article className="detail-card detail-card--package" data-lift key={item.title}>
                  <span className="detail-card__icon">
                    <Icon size={18} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <ul className="feature-list">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <CTAButton to={`/experiences/${experience.slug}`} variant="secondary">
                    View format
                  </CTAButton>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-block section-block--muted">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Planning flow"
            title="How the experience comes together"
            description="We guide the process from inquiry through supplier confirmation and in-trip support."
          />

          <div className="timeline-grid">
            {journeySteps.map((step) => (
              <article className="timeline-card" data-lift key={step.number}>
                <span className="timeline-card__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
