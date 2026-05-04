import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTAButton from '../common/CTAButton.jsx';
import { companyProfile, footerNavGroups } from '../../data/siteContent.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-scenic">
        <img
          alt="Aerial view of the lush Terai plains in Nepal"
          data-parallax
          loading="lazy"
          src="/uploads/site/exp_terai_safari_v2_1777546780464.png"
        />
        <div className="footer-scenic__overlay" />
      </div>

      <div className="section-container footer-grid">
        <div className="footer-brand" data-reveal>
          <p className="eyebrow eyebrow--light">Plan with confidence</p>
          <h2 className="section-title section-title--light">
            Tailored journeys backed by real planners and real support.
          </h2>
          <p>{companyProfile.supportPromise}</p>
          <CTAButton to="/booking" variant="primary-light">
            Start planning
          </CTAButton>
        </div>

        <div className="footer-links" data-reveal>
          {footerNavGroups.map((group) => (
            <div className="footer-links__group" key={group.title}>
              <strong>{group.title}</strong>
              {group.items.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="footer-links__group">
            <strong>Contact</strong>
            <a href={`mailto:${companyProfile.email}`}>
              <Mail size={16} />
              {companyProfile.email}
            </a>
            <a href={`tel:${companyProfile.phone.replace(/\s+/g, '')}`}>
              <Phone size={16} />
              {companyProfile.phone}
            </a>
            <span>
              <MapPin size={16} />
              {companyProfile.address}
            </span>
          </div>
        </div>
      </div>

      <div className="section-container footer-bottom">
        <span>{`© 2026 ${companyProfile.name}. All rights reserved.`}</span>
        <span>{companyProfile.legalName}</span>
      </div>
    </footer>
  );
}
