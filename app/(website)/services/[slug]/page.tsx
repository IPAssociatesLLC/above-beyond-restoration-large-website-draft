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

  return {
    title: page.metaTitle || `${page.title} | Above & Beyond Restoration`,
    description: page.metaDescription || page.subtitle,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: 'website',
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
  const relatedServices = (Array.isArray(page.relatedServices) ? page.relatedServices : []) as { name: string; href: string }[]

  // Rich JSON-LD Schema for Local AI and Google Search Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RestorationService',
        '@id': `https://www.abovebeyondrestorationllc.com/services/${page.slug}#service`,
        name: page.title,
        description: page.subtitle,
        provider: {
          '@type': 'LocalBusiness',
          '@id': 'https://www.abovebeyondrestorationllc.com/#organization',
          name: 'Above & Beyond Restoration',
          telephone: '503-608-2930',
          email: 'TommyBletcher@gmail.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'P.O. Box 542',
            addressLocality: page.city || 'Sherwood',
            addressRegion: 'OR',
            postalCode: '97140',
            addressCountry: 'US',
          },
          priceRange: '$$',
          openingHours: 'Mo-Su 00:00-24:00',
        },
        areaServed: {
          '@type': 'City',
          name: page.city || 'Portland',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://www.abovebeyondrestorationllc.com/services/${page.slug}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.abovebeyondrestorationllc.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: 'https://www.abovebeyondrestorationllc.com/services',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.title,
            item: `https://www.abovebeyondrestorationllc.com/services/${page.slug}`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicePageTemplate
        title={page.title}
        subtitle={page.subtitle}
        heroImage={page.heroImage || '/images/water-damage.png'}
        description={description}
        benefits={benefits}
        process={process}
        faqs={faqs}
        relatedServices={relatedServices}
      />
    </>
  )
}
