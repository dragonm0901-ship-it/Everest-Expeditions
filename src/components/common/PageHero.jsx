import CTAButton from './CTAButton.jsx';

export default function PageHero({ actions = [], background, description, eyebrow, title }) {
  return (
    <section className="page-hero">
      <div className="page-hero__media">
        <img alt={title} className="page-hero__image" data-parallax fetchPriority="high" src={background} />
        <div className="page-hero__overlay" />
      </div>
      <div className="section-container page-hero__content">
        <div className="page-hero__copy" data-hero-copy>
          <p className="eyebrow eyebrow--light">{eyebrow}</p>
          <h1 className="display-title display-title--medium" data-split>
            {title}
          </h1>
          <p className="page-hero__description">{description}</p>
          <div className="hero-actions">
            {actions.map((action) => (
              <CTAButton key={`${action.label}-${action.to ?? action.href}`} {...action}>
                {action.label}
              </CTAButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
