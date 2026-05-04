import CTAButton from '../common/CTAButton.jsx';
import VueTestimonials from '../VueTestimonials.jsx';

export default function StoriesSection() {
  return (
    <section className="section-block section-block--dark">
      <div className="section-container section-stack">
        <div className="split-headline split-headline--light" data-reveal>
          <div>
            <p className="eyebrow eyebrow--light">Traveler stories</p>
            <h2 className="section-title section-title--light">
              Read how itinerary decisions, support, and pacing shape the journey after booking.
            </h2>
          </div>
          <div className="section-header__aside">
            <CTAButton to="/stories" variant="ghost-light">
              Read guest stories
            </CTAButton>
          </div>
        </div>

        <VueTestimonials />
      </div>
    </section>
  );
}
