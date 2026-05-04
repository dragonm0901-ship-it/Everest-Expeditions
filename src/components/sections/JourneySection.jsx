import CTAButton from '../common/CTAButton.jsx';
import { Link } from 'react-router-dom';
import { journeySteps } from '../../data/siteContent.js';

export default function JourneySection() {
  const [leftOne, rightOne, leftTwo, rightTwo] = journeySteps;

  return (
    <section className="section-block section-block--light">
      <div className="section-container section-stack">
        <div className="split-headline" data-reveal>
          <div className="section-copy">
            <p className="eyebrow">A clearer path to departure</p>
            <h2 className="section-title">From first brief to in-trip support, the process stays visible</h2>
          </div>
          <div className="section-header__aside">
            <p>
              Premium travel should not require travelers to manage suppliers, timing, and contingency plans by themselves.
            </p>
            <CTAButton to="/booking" variant="secondary">
              Begin planning
            </CTAButton>
          </div>
        </div>

        <div className="journey-grid">
          <div className="journey-column">
            {[leftOne, leftTwo].map((step) => (
              <Link className="journey-step" data-lift key={step.number} to="/booking">
                <span className="journey-step__number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link className="journey-image" to="/help">
            <img
              alt="Majestic Mount Everest peaks at sunset"
              loading="lazy"
              src="/uploads/site/hero_everest_main_1777546681299.png"
            />
            <div className="journey-image__note">
              <span>Operational clarity</span>
              <strong>Planning that remains calm when details change</strong>
            </div>
          </Link>

          <div className="journey-column journey-column--right">
            {[rightOne, rightTwo].map((step) => (
              <Link className="journey-step journey-step--align-end" data-lift key={step.number} to="/booking">
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
                <span className="journey-step__number">{step.number}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
