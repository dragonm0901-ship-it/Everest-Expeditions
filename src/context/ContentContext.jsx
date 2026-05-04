import React, { createContext, useContext, useState, useEffect } from 'react';
import * as staticContent from '../data/siteContent.js';

const ContentContext = createContext({
  destinations: staticContent.destinations,
  experiences: staticContent.experiences,
  isLoading: true,
  error: null
});

export const useContent = () => useContext(ContentContext);

export function ContentProvider({ children }) {
  const [data, setData] = useState({
    destinations: staticContent.destinations,
    experiences: staticContent.experiences,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function syncContent() {
      try {
        const response = await fetch('/api/destinations');
        if (!response.ok) throw new Error('API Sync Failed');
        
        const dynamicContent = await response.json();
        
        setData({
          destinations: dynamicContent.destinations || staticContent.destinations,
          experiences: dynamicContent.experiences || staticContent.experiences,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.warn('[Sync] Falling back to static content:', err);
        setData(prev => ({ ...prev, isLoading: false, error: err.message }));
      }
    }

    syncContent();
  }, []);

  return (
    <ContentContext.Provider value={data}>
      {children}
    </ContentContext.Provider>
  );
}
