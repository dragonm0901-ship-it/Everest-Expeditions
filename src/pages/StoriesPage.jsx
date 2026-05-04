import { Quote } from 'lucide-react';
import { useRef } from 'react';
import CTAButton from '../components/common/CTAButton.jsx';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import VueTestimonials from '../components/VueTestimonials.jsx';
import { storySnapshots } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function StoriesPage() {
  const rootRef = useRef(null);

  usePageAnimations(rootRef);

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description="Read traveler stories, operational case studies, and guest reflections from Everest Expeditions itineraries."
        path="/stories"
        title="Stories"
      />

      <PageHero
        actions={[
          { label: 'Start your own story', to: '/booking', variant: 'primary-light' },
          { label: 'Browse destinations', to: '/destinations', variant: 'ghost-light' }
        ]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description="A closer look at the journeys guests remember most, from alpine resets to milestone celebrations."
        eyebrow="Stories"
        title="Traveler stories with the operational details behind them"
      />

      <section className="section-block section-block--dark">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Guest perspectives"
            title="Traveler reflections from recent journeys"
            description="These stories explain why planning, pacing, and support matter as much as the destination itself."
          />
          <VueTestimonials />
        </div>
      </section>

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          <SectionHeader
            eyebrow="Travel notes"
            title="A few stories behind the stays"
            description="Open a story detail page to read the operational thinking, not just the highlight reel."
          />

          <div className="detail-grid detail-grid--stories">
            {storySnapshots.map((story) => (
              <article className="story-card" data-lift key={story.title}>
                <img alt={story.title} className="story-card__image" data-parallax loading="lazy" src={story.image} />
                <div className="story-card__body">
                  <span className="story-card__icon">
                    <Quote size={18} />
                  </span>
                  <h3>{story.title}</h3>
                  <p>{story.copy}</p>
                  <CTAButton to={`/stories/${story.slug}`} variant="ghost-light">
                    Read the story
                  </CTAButton>
                </div>
              </article>
            ))}
          </div>

          <div className="editorial-callout" data-reveal>
            <p>
              The strongest journeys feel deliberate without feeling rigid. That balance is where our planning work matters most.
            </p>
            <CTAButton to="/booking" variant="secondary">
              Create your itinerary
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
