import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import useLenis from '../../hooks/useLenis.js';

export default function AppShell() {
  const location = useLocation();

  useLenis();

  useEffect(() => {
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main className="site-main" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
