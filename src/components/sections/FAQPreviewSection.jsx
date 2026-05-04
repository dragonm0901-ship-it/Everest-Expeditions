import CTAButton from '../common/CTAButton.jsx';
import FAQAccordion from '../common/FAQAccordion.jsx';
import { faqs } from '../../data/siteContent.js';

export default function FAQPreviewSection() {
  return (
    <section className="section-block section-block--light">
      <div className="section-container section-stack">
        <div className="split-headline" data-reveal>
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title">
              Practical planning questions travelers ask before they commit
            </h2>
          </div>
          <div className="section-header__aside">
            <CTAButton to="/help" variant="secondary">
              Open help center
            </CTAButton>
          </div>
        </div>

        <FAQAccordion items={faqs} />
      </div>
    </section>
  );
}
