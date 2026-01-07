import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/api/', '/p/', '/r/'],
      },
    ],
    sitemap: 'https://linkforge.io/sitemap.xml',
  };
}
