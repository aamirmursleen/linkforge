import { Metadata } from 'next';

// Site-wide SEO configuration
export const siteConfig = {
  name: 'LinkForge',
  description: 'The modern link management platform. Create short links, QR codes, bio pages, and track analytics. Lifetime deal available!',
  url: 'https://linkforge.io',
  ogImage: '/og-image.png',
  twitterHandle: '@linkforge',
  keywords: [
    'link shortener',
    'URL shortener',
    'QR code generator',
    'link management',
    'bio pages',
    'link in bio',
    'analytics',
    'short links',
    'custom domains',
    'branded links',
  ],
};

// Helper to generate metadata for pages
export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  noIndex = false,
  pathname = '',
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  pathname?: string;
}): Metadata {
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${pathname}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

// Pre-defined metadata for common pages
export const pageMetadata = {
  home: generateMetadata({
    title: 'LinkForge - Modern Link Management Platform',
    description: 'Create short links, QR codes, and bio pages. Track clicks with powerful analytics. Get lifetime access for just $27!',
    keywords: ['link shortener free', 'best URL shortener', 'QR code maker'],
    pathname: '/',
  }),

  pricing: generateMetadata({
    title: 'Pricing - Lifetime Deal 90% OFF',
    description: 'Get lifetime access to LinkForge for just $27. One-time payment, no monthly fees. Unlimited links, QR codes, and all premium features included.',
    keywords: ['lifetime deal', 'one time payment', 'link shortener pricing'],
    pathname: '/pricing',
  }),

  features: generateMetadata({
    title: 'Features - Everything You Need',
    description: 'Discover all LinkForge features: short links, QR codes, bio pages, analytics, custom domains, team collaboration, and API access.',
    keywords: ['link shortener features', 'QR code features', 'analytics features'],
    pathname: '/features',
  }),

  analytics: generateMetadata({
    title: 'Analytics - Track Every Click',
    description: 'Powerful link analytics with real-time tracking. See clicks, geographic data, devices, browsers, and referrers. Export to CSV.',
    keywords: ['link analytics', 'click tracking', 'URL analytics'],
    pathname: '/products/analytics',
  }),

  qrCodes: generateMetadata({
    title: 'QR Code Generator - Create Custom QR Codes',
    description: 'Generate beautiful QR codes for URLs, WiFi, contacts, and more. Customize colors, add logos, and track scans.',
    keywords: ['QR code generator', 'custom QR codes', 'QR code maker free'],
    pathname: '/products/qr-codes',
  }),

  linkManagement: generateMetadata({
    title: 'Link Management - Shorten & Manage URLs',
    description: 'Shorten URLs with custom aliases, password protection, and expiry dates. Organize with folders and tags.',
    keywords: ['URL shortener', 'link management', 'custom short links'],
    pathname: '/products/link-management',
  }),

  bioPages: generateMetadata({
    title: 'Bio Pages - Link in Bio Tool',
    description: 'Create beautiful bio pages for Instagram, TikTok, and more. Add links, social icons, images, and customize themes.',
    keywords: ['link in bio', 'bio page creator', 'Instagram bio link'],
    pathname: '/products/pages',
  }),

  about: generateMetadata({
    title: 'About Us - Our Story',
    description: 'Learn about LinkForge, our mission to simplify link management, and the team behind the platform.',
    keywords: ['about linkforge', 'link shortener company'],
    pathname: '/company/about',
  }),

  contact: generateMetadata({
    title: 'Contact Us - Get in Touch',
    description: 'Have questions? Contact the LinkForge team. We\'re here to help with any inquiries about our link management platform.',
    keywords: ['contact linkforge', 'support'],
    pathname: '/company/contact',
  }),

  developers: generateMetadata({
    title: 'Developers - API Documentation',
    description: 'Integrate LinkForge into your apps with our powerful API. Create links, generate QR codes, and access analytics programmatically.',
    keywords: ['link shortener API', 'URL shortener API', 'developer API'],
    pathname: '/developers',
  }),

  solutions: generateMetadata({
    title: 'Solutions - For Every Business',
    description: 'LinkForge solutions for marketers, creators, businesses, and enterprises. See how our platform can help you grow.',
    keywords: ['link management solutions', 'business URL shortener'],
    pathname: '/solutions',
  }),

  resources: generateMetadata({
    title: 'Resources - Guides & Tutorials',
    description: 'Learn how to get the most out of LinkForge with our guides, tutorials, and best practices for link management.',
    keywords: ['link shortener guide', 'URL shortener tutorial'],
    pathname: '/resources',
  }),

  trust: generateMetadata({
    title: 'Trust & Security',
    description: 'LinkForge is built with security first. Learn about our security practices, data protection, and compliance.',
    keywords: ['link shortener security', 'secure URL shortener'],
    pathname: '/trust',
  }),

  integrations: generateMetadata({
    title: 'Integrations - Connect Your Tools',
    description: 'Connect LinkForge with your favorite tools. Integrations with Zapier, Slack, and more coming soon.',
    keywords: ['link shortener integrations', 'zapier integration'],
    pathname: '/products/integrations',
  }),
};
