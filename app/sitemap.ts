import { MetadataRoute } from 'next'
import { getAllSeoPages, getAllBlogPosts } from '@/app/actions/seo-content'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aboveandbeyondrestoration.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services/water-damage`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services/fire-damage`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services/mold-remediation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services/smoke-damage`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services/demolition`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services/residential`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services/commercial`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services/cleanout`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  let seoPagesEntries: MetadataRoute.Sitemap = []
  let blogEntries: MetadataRoute.Sitemap = []

  try {
    const seoPages = await getAllSeoPages()
    seoPagesEntries = seoPages.map((page) => ({
      url: `${BASE_URL}/services/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }))
  } catch (err) {
    console.error('Error fetching SEO pages for sitemap:', err)
  }

  try {
    const blogs = await getAllBlogPosts()
    blogEntries = blogs.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }))
  } catch (err) {
    console.error('Error fetching blogs for sitemap:', err)
  }

  return [...staticRoutes, ...seoPagesEntries, ...blogEntries]
}
