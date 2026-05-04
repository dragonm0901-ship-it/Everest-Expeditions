import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PageHero from '../components/common/PageHero.jsx';
import Seo from '../components/common/Seo.jsx';
import { policyPages } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function PolicyPage() {
  const rootRef = useRef(null);
  const location = useLocation();
  const slug = location.pathname.replace('/', '');
  const page = policyPages[slug];

  usePageAnimations(rootRef);

  if (!page) {
    return null;
  }

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo description={page.description} path={location.pathname} title={page.title} />

      <PageHero
        actions={[{ label: 'Contact the team', to: '/contact', variant: 'primary-light' }]}
        background="/uploads/site/hero_everest_main_1777546681299.png"
        description={page.description}
        eyebrow="Policy"
        title={page.title}
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          {page.sections.map((section) => (
            <article className="detail-card detail-card--package" data-reveal key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
