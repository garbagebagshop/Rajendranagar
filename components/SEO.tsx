import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: object;
  type?: 'website' | 'article' | 'product';
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical, 
  schema, 
  type = 'website',
  image = 'https://rajendranagar.online/og-image.png' 
}) => {
  
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateOgMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Meta Description
    updateMeta('description', description);

    // Update Open Graph
    updateOgMeta('og:title', title);
    updateOgMeta('og:description', description);
    updateOgMeta('og:type', type);
    updateOgMeta('og:url', window.location.href);
    updateOgMeta('og:image', image);

    // Update Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical || window.location.href);

    // Inject JSON-LD Schema
    if (schema) {
      let script = document.querySelector('#schema-json-ld');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('id', 'schema-json-ld');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

  }, [title, description, canonical, schema, type, image]);

  return null;
};
