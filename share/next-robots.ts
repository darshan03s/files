import { APP_URL } from '@/metadata'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/_next/', '*.json']
      }
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL
  }
}
