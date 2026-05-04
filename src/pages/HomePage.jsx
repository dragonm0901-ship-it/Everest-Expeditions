import { useRef } from 'react';
import DestinationsPreviewSection from '../components/sections/DestinationsPreviewSection.jsx';
import FAQPreviewSection from '../components/sections/FAQPreviewSection.jsx';
import FeatureBandSection from '../components/sections/FeatureBandSection.jsx';
import HeroSection from '../components/sections/HeroSection.jsx';
import IntroStatsSection from '../components/sections/IntroStatsSection.jsx';
import JourneySection from '../components/sections/JourneySection.jsx';
import MomentsSection from '../components/sections/MomentsSection.jsx';
import ReservationSection from '../components/sections/ReservationSection.jsx';
import StoriesSection from '../components/sections/StoriesSection.jsx';
import Seo from '../components/common/Seo.jsx';
import { companyProfile, siteMeta } from '../data/siteContent.js';
import usePageAnimations from '../hooks/usePageAnimations.js';

export default function HomePage() {
  const rootRef = useRef(null);

  usePageAnimations(rootRef);

  return (
    <div className="page-shell" ref={rootRef}>
      <Seo
        path="/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'TravelAgency',
          name: companyProfile.name,
          url: siteMeta.siteUrl,
          email: companyProfile.email,
          telephone: companyProfile.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: companyProfile.address,
            addressLocality: companyProfile.headquarters,
            addressCountry: 'NP'
          }
        }}
      />
      <HeroSection />
      <IntroStatsSection />
      <FeatureBandSection />
      <DestinationsPreviewSection />
      <MomentsSection />
      <JourneySection />
      <StoriesSection />
      <ReservationSection />
      <FAQPreviewSection />
    </div>
  );
}
