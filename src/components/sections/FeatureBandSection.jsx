import { ArrowUpRight, BedDouble, Compass, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Destination depth',
    description: 'Dedicated pages for each destination with seasonality, itinerary fit, and destination logic.',
    icon: BedDouble,
    image: '/uploads/site/feature_map_depth_1777547234267.png',
    to: '/destinations'
  },
  {
    title: 'Planner-built experiences',
    description: 'Travel formats that explain what is included, who they suit, and how they are delivered.',
    icon: Compass,
    image: '/uploads/site/exp_heritage_wellness_v2_1777546814314.png',
    to: '/experiences'
  },
  {
    title: 'Secure inquiry flow',
    description: 'A proper trip brief form with validation, operational handoff, and support-ready contact details.',
    icon: ShieldCheck,
    image: '/uploads/site/hero_everest_main_1777546681299.png',
    to: '/booking'
  }
];

export default function FeatureBandSection() {
  return (
    <section className="section-block section-block--dark">
      <div className="section-container feature-grid">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Link className="feature-card" data-lift key={feature.title} to={feature.to}>
              <div className="feature-card__media">
                <img alt={feature.title} loading="lazy" src={feature.image} />
                <div className="feature-card__overlay" />
              </div>
              <div className="feature-card__content">
                <span className="feature-card__icon">
                  <Icon size={18} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-card__footer">
                  <span>Explore</span>
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
