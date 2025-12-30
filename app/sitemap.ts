import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = source.getPages().map((page) => ({
    url: `https://macalu.so${page.url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://macalu.so',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...docs,
  ];
}
