import { Compass, Leaf, Loader2, MapPin } from 'lucide-react';
import { useRef } from 'react';
import CTAButton from '../components/common/CTAButton.jsx';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { useContent } from '../context/ContentContext.jsx';
import usePageAnimations from '../hooks/usePageAnimations.js';

const detailPillars = [
  { title: 'Private routing', copy: 'Arrival and transfer planning with buffers designed around comfort.', icon: Compass },
  { title: 'Local texture', copy: 'Experiences that feel rooted in place rather than overly packaged.', icon: MapPin },
  { title: 'Restorative pacing', copy: 'Balanced schedules that protect quiet time and memorable windows alike.', icon: Leaf }
];

export default function DestinationsPage() {
  const rootRef = useRef(null);
  const { destinations, isLoading } = useContent();

  usePageAnimations(rootRef);

  // Derive dynamic details and featured lists
  const destinationDetails = destinations.map(d => ({
    title: d.title,
    copy: d.summary,
    image: (d.gallery || [])[0] || d.cardImage
  }));

  const featuredDestinations = destinations.map(d => ({
    slug: d.slug,
    title: `${d.shortTitle}, ${d.country}`,
    meta: d.meta,
    rating: d.rating,
    image: d.cardImage,
    description: d.summary
  }));

  if (isLoading) {
    return <div className="page-shell"><div className="flex items-center justify-center p-20"><Loader2 className="animate-spin text-brand" size={40} /></div></div>;
  }

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description="Browse Everest Expeditions destinations, from mountain lodges to private villas and celebration-ready desert itineraries."
        path="/destinations"
        title="Destinations"
      />

      <PageHero
        actions={[
          { label: 'Reserve a stay', to: '/booking', variant: 'primary-light' },
          { label: 'View experiences', to: '/experiences', variant: 'ghost-light' }
        ]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description="Explore destinations selected for scenery, service reliability, and the kind of itinerary logic that makes premium travel feel calm."
        eyebrow="Destinations"
        title="Travel destinations with real planning depth behind them"
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Destination collection"
            title="Three destination styles, each with its own rhythm"
            description="We select destinations for more than visuals. Supplier quality, access, supportability, and pacing all matter."
          />

          <div className="detail-grid detail-grid--destinations">
            {destinationDetails.slice(0, 4).map((item) => (
              <article className="detail-card detail-card--image" key={item.title}>
                <img alt={item.title} loading="lazy" src={item.image} />
                <div className="detail-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-block--muted">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="What we refine"
            title="Why these journeys feel different"
            description="Each itinerary is shaped around how the destination should actually be experienced, not simply how it photographs."
          />

          <div className="detail-grid detail-grid--pillars">
            {detailPillars.map((item) => {
              const Icon = item.icon;

              return (
                <article className="detail-card detail-card--pillar" data-lift key={item.title}>
                  <span className="detail-card__icon">
                    <Icon size={18} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            action={{ label: 'Start booking', to: '/booking' }}
            eyebrow="Destination detail"
            title="Choose a destination and review the planning logic"
            description="Each destination now has a dedicated page with summary details, itinerary structure, and destination fit."
          />

          <div className="destination-list">
            {featuredDestinations.map((item) => {
              const destination = destinations.find((entry) => entry.slug === item.slug);

              return (
                <article className="destination-row" key={item.slug}>
                  <img alt={item.title} className="destination-row__image" loading="lazy" src={item.image} />
                  <div className="destination-row__body">
                    <p className="eyebrow">{item.meta}</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <CTAButton to={`/destinations/${item.slug}`} variant="secondary">
                      View destination
                    </CTAButton>
                    {destination ? <p>{`Best season: ${destination.bestSeason}`}</p> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
