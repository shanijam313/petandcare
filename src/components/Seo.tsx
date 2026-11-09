import React from 'react';

type SeoProps = {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

const SITE_URL = 'https://modernpetcareandstylishfishpalace.shop';

function setOrUpdateTag(
  selector: string,
  attributes: Record<string, string>
) {
  const existing = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (existing) {
    Object.entries(attributes).forEach(([key, value]) => existing.setAttribute(key, value));
    return existing;
  }

  const tag = selector.startsWith('link') ? document.createElement('link') : document.createElement('meta');
  Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
  document.head.appendChild(tag);
  return tag;
}

export function Seo({ title, description, keywords, canonicalPath = '/', noindex = false, structuredData }: SeoProps) {
  React.useEffect(() => {
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    document.title = title;
    setOrUpdateTag('meta[name="description"]', { name: 'description', content: description });
    if (keywords && keywords.length > 0) {
      setOrUpdateTag('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });
    }
    setOrUpdateTag('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setOrUpdateTag('meta[property="og:title"]', { property: 'og:title', content: title });
    setOrUpdateTag('meta[property="og:description"]', { property: 'og:description', content: description });
    setOrUpdateTag('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setOrUpdateTag('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Modern Pet Care & Stylish Fish Palace' });
    setOrUpdateTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setOrUpdateTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    setOrUpdateTag('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    setOrUpdateTag('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
    setOrUpdateTag('meta[name="robots"]', { name: 'robots', content: robotsContent });

    const existingJsonLd = document.head.querySelectorAll('script[data-seo-jsonld="true"]');
    existingJsonLd.forEach((node) => node.remove());

    if (structuredData) {
      const items = Array.isArray(structuredData) ? structuredData : [structuredData];
      items.forEach((item) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.textContent = JSON.stringify(item);
        document.head.appendChild(script);
      });
    }
  }, [canonicalPath, description, keywords, noindex, structuredData, title]);

  return null;
}

export const seoSiteUrl = SITE_URL;
