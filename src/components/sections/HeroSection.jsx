import { BadgeCheck, Star, Users } from 'lucide-react';
import CTAButton from '../common/CTAButton.jsx';
import { companyProfile, heroAvatars } from '../../data/siteContent.js';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-section__media">
        <img
          alt="Mount Everest peaks at sunset"
          className="hero-section__image"
          data-parallax
          fetchPriority="high"
          src="/uploads/site/hero_everest_main_1777546681299.png"
        />
        <div className="hero-section__overlay" />
      </div>

      <div className="section-container hero-section__content">
        <div className="hero-copy" data-hero-copy>
          <p className="eyebrow eyebrow--light">Planner-led travel</p>
          <h1 className="display-title" data-split>
            EVEREST
          </h1>
          <h2 className="hero-copy__headline">Custom journeys with the logistics already under control.</h2>
          <p className="hero-copy__text">{companyProfile.shortDescription}</p>

          <div className="hero-actions">
            <CTAButton to="/destinations" variant="primary-light">
              Explore destinations
            </CTAButton>
            <CTAButton to="/booking" variant="ghost-light">
              Start an inquiry
            </CTAButton>
          </div>
        </div>

        <div className="hero-sidecard" data-lift>
          <div className="avatar-row" aria-hidden="true">
            {heroAvatars.map((avatar) => (
              <span key={avatar} style={{ backgroundImage: `url(${avatar})` }} />
            ))}
          </div>

          <div className="hero-sidecard__rating">
            <Star fill="currentColor" size={14} />
            <span>{companyProfile.supportPromise}</span>
          </div>

          <p>
            Work with one lead planner, a vetted supplier network, and an itinerary shaped around what the trip actually needs to accomplish.
          </p>

          <div className="hero-sidecard__meta">
            <span>
              <Users size={15} />
              Human planning
            </span>
            <span>
              <BadgeCheck size={15} />
              Supplier-vetted
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
