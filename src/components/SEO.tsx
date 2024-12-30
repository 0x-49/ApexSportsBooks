import React, { useEffect } from 'react';
import { MetaData } from '../utils/seo';

interface SEOProps {
  metadata: MetaData;
  structuredData?: any;
}

const SEO: React.FC<SEOProps> = ({ metadata, structuredData }) => {
  const { title, description, keywords, canonicalUrl } = metadata;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    // Update or create canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `https://apexsportsbooks.com${canonicalUrl}`);

    // Update Open Graph tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'og:url': `https://apexsportsbooks.com${canonicalUrl}`,
      'og:site_name': 'ApexSportsbooks'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Update Twitter tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Add structured data
    if (structuredData) {
      let scriptTag = document.querySelector('#structured-data');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('id', 'structured-data');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Optional: Remove structured data when component unmounts
      const scriptTag = document.querySelector('#structured-data');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;
