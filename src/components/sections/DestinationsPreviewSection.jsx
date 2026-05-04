import { ArrowRight, Compass, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTAButton from '../common/CTAButton.jsx';
import SectionHeader from '../common/SectionHeader.jsx';
import { useContent } from '../../context/ContentContext.jsx';

export default function DestinationsPreviewSection() {
  const { destinations, isLoading } = useContent();

  if (isLoading || destinations.length === 0) {
    return <div className="p-20 text-center">Curating destination insights...</div>;
  }

  // Use exactly 5 destinations for the custom layout
  const items = destinations.slice(0, 5).map(d => ({
    slug: d.slug,
    title: d.title,
    shortTitle: d.shortTitle,
    country: d.country,
    region: d.region,
    meta: d.meta,
    rating: d.rating,
    image: d.cardImage, // Now fixed by hydration mapping
    gallery: d.gallery,
    description: d.summary,
    highlights: d.highlights || []
  }));

  const upperRow = items.slice(0, 2);
  const lowerRow = items.slice(2, 5);

  return (
    <section className="section-block section-block--light">
      <div className="section-container section-stack">
        <div className="split-headline" data-reveal>
          <SectionHeader
            eyebrow="Discover"
            title="Destination pages that go beyond a gallery"
            description="We move from inspiration to logistics, covering seasonality, itinerary fit, and on-ground coordination for every location."
          />
          <div className="section-header__aside">
            <CTAButton to="/destinations" variant="secondary">
              View all destinations
            </CTAButton>
          </div>
        </div>

        <div className="explorer-grid-custom">
          <div className="explorer-row explorer-row--upper">
            {upperRow.map((item, index) => (
              <Link
                className={`explorer-card ${index === 0 ? 'explorer-card--long' : 'explorer-card--compact'}`}
                data-lift
                key={item.slug}
                to={`/destinations/${item.slug}`}
              >
                <div className="explorer-card__media">
                  <img alt={item.title} data-parallax loading="lazy" src={item.image} />
                  <div className="explorer-card__overlay" />
                </div>

                <div className="explorer-card__badges">
                  <span className="badge badge--glass">
                    <Compass size={12} />
                    {item.region}
                  </span>
                  {item.gallery && item.gallery.length > 1 && (
                    <span className="badge badge--glass badge--hide-mobile">
                      {item.gallery.length} Images
                    </span>
                  )}
                  <span className="badge badge--accent">
                    <Star fill="currentColor" size={10} />
                    {item.rating}
                  </span>
                </div>

                <div className="explorer-card__content">
                  <p className="explorer-card__meta">{item.meta}</p>
                  <h3>{item.shortTitle}</h3>
                  <p className="explorer-card__description">{item.description}</p>
                  
                  {index === 0 && item.highlights && item.highlights.length > 0 && (
                    <ul className="explorer-card__highlights">
                      {item.highlights.slice(0, 2).map(h => (
                        <li key={h}>
                          <ShieldCheck size={12} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  <span className="explorer-card__action">
                    <span>Explore logistics</span>
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="explorer-row explorer-row--lower">
            {lowerRow.map((item) => (
              <Link
                className="explorer-card explorer-card--compact"
                data-lift
                key={item.slug}
                to={`/destinations/${item.slug}`}
              >
                <div className="explorer-card__media">
                  <img alt={item.title} data-parallax loading="lazy" src={item.image} />
                  <div className="explorer-card__overlay" />
                </div>

                <div className="explorer-card__badges">
                  <span className="badge badge--glass">
                    <Star fill="currentColor" size={10} />
                    {item.rating}
                  </span>
                </div>

                <div className="explorer-card__content">
                  <p className="explorer-card__meta">{item.region}</p>
                  <h3 className="h4">{item.shortTitle}</h3>
                  <span className="explorer-card__action">
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
