import { Navigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import PageHero from '../components/common/PageHero.jsx';
import Seo from '../components/common/Seo.jsx';
import { getStoryBySlug } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function StoryDetailPage() {
  const rootRef = useRef(null);
  const { slug } = useParams();
  const story = getStoryBySlug(slug);

  usePageAnimations(rootRef);

  if (!story) {
    return <Navigate replace to="/404" />;
  }

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        description={story.excerpt}
        image={story.image}
        path={`/stories/${story.slug}`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: story.title,
          description: story.excerpt,
          datePublished: story.publishedAt,
          author: {
            '@type': 'Organization',
            name: story.author
          }
        }}
        title={story.title}
        type="article"
      />

      <PageHero
        actions={[
          { label: 'Read more stories', to: '/stories', variant: 'primary-light' },
          { label: 'Plan your own trip', to: '/booking', variant: 'ghost-light' }
        ]}
        background={story.image}
        description={`${story.author} · ${story.readTime} · ${story.publishedAt}`}
        eyebrow="Story"
        title={story.title}
      />

      <section className="section-block section-block--light">
        <div className="section-container section-stack">
          {story.body.map((paragraph) => (
            <article className="detail-card detail-card--package" data-reveal key={paragraph}>
              <p>{paragraph}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
