import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTAButton({
  children,
  className = '',
  href,
  icon: Icon = ArrowRight,
  to,
  variant = 'primary',
  ...props
}) {
  const classes = `button-pill button-pill--${variant} ${className}`.trim();
  const content = (
    <>
      <span className="button-pill__label">{children}</span>
      {Icon ? (
        <span className="button-pill__icon" aria-hidden="true">
          <Icon size={16} />
        </span>
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {content}
    </button>
  );
}
