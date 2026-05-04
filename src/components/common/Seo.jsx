import { useEffect } from 'react';
import { siteMeta } from '../../data/siteContent.js';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description,
  path = '/',
  image = siteMeta.defaultImage,
  type = 'website',
  robots = 'index,follow',
  schema
}) {
  useEffect(() => {
    const canonical = new URL(path, siteMeta.siteUrl).toString();
    document.title = title ? `${title} | ${siteMeta.siteName}` : siteMeta.defaultTitle;

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description ?? siteMeta.defaultDescription
    });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: robots
    });
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title ?? siteMeta.defaultTitle
    });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description ?? siteMeta.defaultDescription
    });
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type
    });
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonical
    });
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: image
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image'
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title ?? siteMeta.defaultTitle
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description ?? siteMeta.defaultDescription
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: image
    });
    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonical
    });

    const existingScript = document.head.querySelector('script[data-seo-schema="true"]');

    if (schema) {
      let script = existingScript;

      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo-schema', 'true');
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(schema);
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [description, image, path, robots, schema, title, type]);

  return null;
}
