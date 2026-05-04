import CTAButton from './CTAButton.jsx';

export default function SectionHeader({ action, description, eyebrow, title }) {
  return (
    <div className="section-header" data-reveal>
      <div className="section-header__content">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="section-header__aside">
        {description ? <p>{description}</p> : null}
        {action ? (
          <CTAButton to={action.to} variant={action.variant ?? 'secondary'}>
            {action.label}
          </CTAButton>
        ) : null}
      </div>
    </div>
  );
}
