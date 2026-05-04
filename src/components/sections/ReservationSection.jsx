import CTAButton from '../common/CTAButton.jsx';
import { reservationHighlights } from '../../data/siteContent.js';

export default function ReservationSection() {
  return (
    <section className="section-block section-block--light">
      <div className="section-container">
        <div className="reservation-card">
          <div className="reservation-card__media" data-lift>
            <img
              alt="Himalayan dawn over a mountain pass"
              data-parallax
              loading="lazy"
              src="/uploads/site/moment_dawn_v2_1777546931930.png"
            />
          </div>

          <div className="reservation-card__body" data-reveal>
            <p className="eyebrow">Start with the trip brief</p>
            <h2 className="section-title">
              Tell us the destination, budget, pace, and support level you need
            </h2>
            <p className="reservation-card__copy">
              Once the brief is clear, we can recommend the right destination, itinerary format, and supplier mix.
            </p>

            <div className="reservation-highlights">
              {reservationHighlights.map((item) => (
                <div className="reservation-pill" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="button-row">
              <CTAButton to="/booking" variant="primary">
                Send inquiry
              </CTAButton>
              <CTAButton to="/contact" variant="secondary">
                Talk to the team
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
