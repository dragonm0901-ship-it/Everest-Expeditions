import { useRef } from 'react';
import FAQAccordion from '../components/common/FAQAccordion.jsx';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { faqs, helpTopics, preDepartureChecklist } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function HelpPage() {
  const rootRef = useRef(null);

  usePageAnimations(rootRef);

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description="Find booking, arrival, disruption, and pre-departure support information for Everest Expeditions travelers."
        path="/help"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        }}
        title="Help Center"
      />

      <PageHero
        actions={[
          { label: 'Plan a trip', to: '/booking', variant: 'primary-light' },
          { label: 'Contact support', to: '/contact', variant: 'ghost-light' }
        ]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description="Questions before you book or prepare for departure? This page covers the practical details guests ask most often."
        eyebrow="Help center"
        title="Support information before, during, and after booking"
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Support topics"
            title="Where travelers usually need clarity"
            description="These are the questions that most often affect timing, confidence, and the final shape of an itinerary."
          />

          <div className="detail-grid detail-grid--pillars">
            {helpTopics.map((topic) => (
              <article className="detail-card detail-card--pillar" data-lift key={topic.title}>
                <h3>{topic.title}</h3>
                <p>{topic.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-block--muted">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Pre-departure"
            title="What to check before you travel"
            description="Your final brief will always include trip-specific instructions, but these are the essentials we expect every traveler to review."
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

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="FAQ"
            title="Common planning and support questions"
            description="If your question is trip-specific, use the inquiry form or contact the planning desk directly."
          />
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </div>
  );
}
