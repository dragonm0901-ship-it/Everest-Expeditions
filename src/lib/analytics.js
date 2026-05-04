export function trackEvent(name, properties = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('everest:track', {
      detail: { name, properties }
    })
  );

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, properties);
  }

  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: properties });
  }

  if (typeof window.umami?.track === 'function') {
    window.umami.track(name, properties);
  }
}
