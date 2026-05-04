import Seo from '../components/common/Seo.jsx';
import CTAButton from '../components/common/CTAButton.jsx';

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <Seo description="The page you requested could not be found." path="/404" robots="noindex,nofollow" title="Page not found" />
      <section className="section-block section-block--light">
        <div className="section-container not-found">
          <p className="eyebrow">404</p>
          <h1 className="section-title">This page is off route</h1>
          <p>
            The link may be outdated or the page may have moved. You can return home, browse destinations, or start a new inquiry.
          </p>
          <div className="button-row">
            <CTAButton to="/" variant="primary">
              Return home
            </CTAButton>
            <CTAButton to="/booking" variant="secondary">
              Plan a trip
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
