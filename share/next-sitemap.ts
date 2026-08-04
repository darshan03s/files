import { APP_URL } from '@/metadata'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    }
  ]

  return [...staticPages]
}
