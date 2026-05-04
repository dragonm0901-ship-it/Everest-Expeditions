import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import CTAButton from '../common/CTAButton.jsx';
import { navItems } from '../../data/siteContent.js';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
    };

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    mediaQuery.addEventListener('change', updateViewport);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mediaQuery.removeEventListener('change', updateViewport);
    };
  }, [location.pathname]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const headerClass = isHome && !scrolled ? 'site-header--overlay' : 'site-header--solid';

  return (
    <header className={`site-header ${headerClass}`}>
      <div className="section-container site-header__inner">
        <div 
          className="brand" 
          onClick={() => {
            closeMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ cursor: 'pointer' }}
        >
          <span aria-hidden="true" className="brand__mark" />
          <span className="brand__copy">
            <strong>everest</strong>
            <span>expeditions</span>
          </span>
        </div>

        <nav
          aria-label="Primary"
          className={`site-nav ${menuOpen ? 'is-open' : ''}`}
          hidden={isMobile && !menuOpen}
          id="primary-navigation"
        >
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => `site-nav__link ${isActive ? 'is-active' : ''}`}
              key={item.to}
              onClick={closeMenu}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <CTAButton to="/booking" variant={isHome ? 'primary-light' : 'primary'}>
            Plan a journey
          </CTAButton>
          <button
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="icon-square nav-toggle"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
