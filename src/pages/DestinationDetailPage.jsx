import { Navigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import CTAButton from '../components/common/CTAButton.jsx';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { useContent } from '../context/ContentContext.jsx';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function DestinationDetailPage() {
  const rootRef = useRef(null);
  const { slug } = useParams();
  const { destinations, isLoading } = useContent();
  const destination = destinations.find(d => d.slug === slug);

  usePageAnimations(rootRef);

  if (isLoading) {
    return <div className="page-shell"><div className="flex items-center justify-center p-20">Loading destination...</div></div>;
  }

  if (!destination) {
    return <Navigate replace to="/404" />;
  }

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description={destination.seoDescription}
        image={destination.heroImage}
        path={`/destinations/${destination.slug}`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'TouristDestination',
          name: destination.title,
          description: destination.summary,
          touristType: destination.idealFor.join(', ')
        }}
        title={destination.title}
      />

      <PageHero
        actions={[
          { label: 'Plan this journey', to: '/booking', variant: 'primary-light' },
          { label: 'See experiences', to: '/experiences', variant: 'ghost-light' }
        ]}
        background={destination.heroImage}
        description={destination.description}
        eyebrow={destination.eyebrow}
        title={destination.title}
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow={`${destination.region}, ${destination.country}`}
            title="Why travelers choose this destination"
            description={destination.summary}
          />

          <div className="detail-grid detail-grid--pillars">
            {destination.highlights.map((item) => (
              <article className="detail-card detail-card--pillar" data-lift key={item}>
                <h3>{item}</h3>
                <p>{destination.meta}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-block--muted">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Sample itinerary logic"
            title="What we usually build into the journey"
            description={`Best season: ${destination.bestSeason}. Ideal for ${destination.idealFor.join(', ')}.`}
          />

          <div className="timeline-grid">
            {destination.itinerary.map((item, index) => (
              <article className="timeline-card" data-lift key={item}>
                <span className="timeline-card__number">{`0${index + 1}`}</span>
                <h3>{item}</h3>
                <p>{destination.description}</p>
              </article>
            ))}
          </div>

          <div className="button-row">
            <CTAButton to="/booking" variant="primary">
              Start an inquiry
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
