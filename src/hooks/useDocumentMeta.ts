import { useEffect } from 'react';

const SITE_NAME = 'Async Converters';
const BASE_URL = 'https://async-converters.com';

interface DocMetaOptions {
  title: string;
  description: string;
  path: string;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setOgMeta(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
}

/**
 * Sets document title, meta description, canonical URL, and OG tags
 * for the current converter page. Call from ConverterShell.
 */
export function useDocumentMeta({ title, description, path }: DocMetaOptions) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const canonicalUrl = `${BASE_URL}${path}`;

    document.title = fullTitle;
    setMeta('description', description);
    setCanonical(canonicalUrl);
    setOgMeta('og:title', fullTitle);
    setOgMeta('og:description', description);
    setOgMeta('og:url', canonicalUrl);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    // Restore to defaults when navigating away (e.g., to home)
    return () => {
      document.title = `${SITE_NAME} — Free Browser-Based Conversion Tools`;
    };
  }, [title, description, path]);
}
