import CTAButton from '../common/CTAButton.jsx';
import { companyProfile, stats } from '../../data/siteContent.js';

export default function IntroStatsSection() {
  return (
    <section className="section-block section-block--light">
      <div className="section-container section-stack">
        <div className="intro-layout">
          <div className="intro-copy-group" data-reveal>
            <p className="eyebrow">Why Everest</p>
            <div className="intro-copy">
              We plan journeys with <span>real operational support</span>, not just inspiration boards. From destination strategy and supplier review to traveler briefings and in-trip changes, the work stays under one roof.
            </div>
          </div>

          <aside className="intro-note" data-lift>
            <p className="eyebrow">A concierge-first approach</p>
            <p>{companyProfile.longDescription}</p>
            <CTAButton to="/about" variant="secondary">
              Meet the team
            </CTAButton>
          </aside>
        </div>

        <div className="stats-grid">
          {stats.map((item) => (
            <article className="stat-card" data-lift key={item.label}>
              <span className="stat-card__value" data-count={item.value} data-suffix={item.suffix}>
                0{item.suffix}
              </span>
              <span className="stat-card__label">{item.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
