import { Navigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { useContent } from '../context/ContentContext.jsx';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function ExperienceDetailPage() {
  const rootRef = useRef(null);
  const { slug } = useParams();
  const { experiences, destinations, isLoading } = useContent();
  const experience = experiences.find(e => e.slug === slug);

  usePageAnimations(rootRef);

  if (isLoading) {
    return <div className="page-shell"><div className="flex items-center justify-center p-20">Loading and syncing format...</div></div>;
  }

  if (!experience) {
    return <Navigate replace to="/404" />;
  }

  const relatedDestinations = (experience.destinationSlugs || [])
    .map((item) => destinations.find(d => d.slug === item))
    .filter(Boolean);

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description={experience.seoDescription}
        image={experience.heroImage}
        path={`/experiences/${experience.slug}`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: experience.title,
          description: experience.summary
        }}
        title={experience.title}
      />

      <PageHero
        actions={[
          { label: 'Plan this format', to: '/booking', variant: 'primary-light' },
          { label: 'All experiences', to: '/experiences', variant: 'ghost-light' }
        ]}
        background={experience.heroImage}
        description={experience.description}
        eyebrow={experience.eyebrow}
        title={experience.title}
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="What is included"
            title="How this travel format is structured"
            description={experience.summary}
          />

          <div className="detail-grid detail-grid--pillars">
            {experience.inclusions.map((item) => (
              <article className="detail-card detail-card--pillar" data-lift key={item}>
                <h3>{item}</h3>
                <p>Built into the planner-led workflow for this journey style.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-block--muted">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Best fit"
            title={`Ideal for ${experience.bestFor.join(', ')}`}
            description={`This format can be paired with ${relatedDestinations.map((item) => item.shortTitle).join(' and ')}.`}
          />

          <div className="detail-grid detail-grid--pillars">
            {relatedDestinations.map((destination) => (
              <article className="detail-card detail-card--package" data-lift key={destination.slug}>
                <p className="eyebrow">{destination.country}</p>
                <h3>{destination.title}</h3>
                <p>{destination.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
