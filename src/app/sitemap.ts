import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://linkforge.io';

  const routes = [
    '',
    '/pricing',
    '/features',
    '/products/link-management',
    '/products/qr-codes',
    '/products/analytics',
    '/products/pages',
    '/products/integrations',
    '/solutions',
    '/developers',
    '/resources',
    '/company/about',
    '/company/contact',
    '/trust',
    '/sign-in',
    '/sign-up',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/pricing' ? 0.9 : 0.8,
  }));
}
