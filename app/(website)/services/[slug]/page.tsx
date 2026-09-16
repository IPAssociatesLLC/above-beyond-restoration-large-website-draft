import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSeoPageBySlug } from '@/app/actions/seo-content'
import { ServicePageTemplate } from '@/components/website/service-page-template'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getSeoPageBySlug(slug)

  if (!page) {
    return {
      title: 'Service Not Found | Above & Beyond Restoration',
    }
  }

  const title = page.metaTitle || `${page.title} | Above & Beyond Restoration`
  const description = page.metaDescription || page.subtitle

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.abovebeyondrestorationllc.com/services/${slug}`,
      locale: 'en_US',
    },
  }
}

export default async function DynamicServicePage({ params }: PageProps) {
  const { slug } = await params
  const page = await getSeoPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const description = (Array.isArray(page.description) ? page.description : []) as string[]
  const benefits = (Array.isArray(page.benefits) ? page.benefits : []) as string[]
  const process = (Array.isArray(page.process) ? page.process : []) as { title: string; description: string }[]
  const faqs = (Array.isArray(page.faqs) ? page.faqs : []) as { q: string; a: string }[]
  const relatedServices = (Array.isArray(page.relatedServices) ? page.relatedServices : []) as {
    name: string
    href: string
  }[]

  return (
    <ServicePageTemplate
      title={page.title}
      subtitle={page.subtitle}
      heroImage={page.heroImage || '/images/water-damage.png'}
      description={description}
      benefits={benefits}
      process={process}
      faqs={faqs}
      relatedServices={relatedServices}
      slug={page.slug}
      enableJsonLd={true}
    />
  )
}
