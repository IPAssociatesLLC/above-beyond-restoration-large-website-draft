import type { Metadata } from 'next'
import { HeroSection } from '@/components/website/home/hero-section'
import { TrustBar } from '@/components/website/home/trust-bar'
import { ServicesOverview } from '@/components/website/home/services-overview'
import { EmergencyBanner } from '@/components/website/home/emergency-banner'
import { WhyChooseUs } from '@/components/website/home/why-choose-us'
import { TestimonialsSection } from '@/components/website/home/testimonials'
import { ServiceAreasSection } from '@/components/website/home/service-areas'
import { CTASection } from '@/components/website/home/cta-section'
import { FaqAccordion } from '@/components/website/faq-accordion'

export const metadata: Metadata = {
  title: 'Above & Beyond Restoration | 24/7 Water, Mold & Fire Restoration Portland OR',
  description:
    'Portland\'s trusted 24/7 emergency restoration contractor. 90-min arrival, IICRC-certified water extraction, mold remediation, fire cleanup & 5-day dryout fee guarantee. Call 503-608-2930.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Above & Beyond Restoration | 24/7 Emergency Restoration Portland OR',
    description:
      '24/7 emergency water extraction, mold remediation, and fire damage cleanup across the Portland metropolitan area. Oregon CCB #262371.',
    type: 'website',
    url: 'https://www.abovebeyondrestorationllc.com',
  },
}

const homeFaqs = [
  {
    q: 'How quickly can Above & Beyond respond to an emergency in Portland?',
    a: 'We provide guaranteed 24/7/365 emergency dispatch across the entire Portland metropolitan area, arriving on-site equipped for extraction and mitigation within 90 minutes or less.',
  },
  {
    q: 'Do you bill insurance companies directly for restoration work?',
    a: 'Yes. We work directly with all major homeowners and commercial property insurance carriers (State Farm, Allstate, Travelers, Farmers, Liberty Mutual, USAA, etc.). We scope and document all damage using standard Xactimate pricing and submit bills directly to your adjuster.',
  },
  {
    q: 'Are your technicians licensed and certified in Oregon?',
    a: 'Yes. Above & Beyond Restoration is fully licensed, bonded, and insured under Oregon CCB #262371. Our technicians hold active IICRC certifications in Water Damage Restoration (WRT), Applied Structural Drying (ASD), and Mold Remediation (AMRT).',
  },
  {
    q: 'What is your 5-Day Maximum Dry-Out Guarantee?',
    a: 'For Category 1 clean water losses, we guarantee that our drying equipment rental charges are capped at a maximum of 5 days. Our industrial LGR dehumidifiers and high-velocity air movers restore structural moisture to dry standards rapidly and efficiently.',
  },
  {
    q: 'What service areas do you cover in Oregon?',
    a: 'We cover all of Multnomah, Washington, Clackamas, and Marion counties, including Portland, Beaverton, Gresham, Hillsboro, Tigard, Lake Oswego, Sherwood, Tualatin, West Linn, Oregon City, and Salem.',
  },
]

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.abovebeyondrestorationllc.com/#website',
      url: 'https://www.abovebeyondrestorationllc.com',
      name: 'Above & Beyond Restoration',
      description: 'Portland 24/7 Emergency Water, Mold, and Fire Damage Restoration Services',
      publisher: {
        '@id': 'https://www.abovebeyondrestorationllc.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.abovebeyondrestorationllc.com/services/guides?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.abovebeyondrestorationllc.com/#faq',
      mainEntity: homeFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
}

// Above & Beyond Restoration — Homepage
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <HeroSection />
      <TrustBar />
      <ServicesOverview />
      <EmergencyBanner />
      <WhyChooseUs />
      <TestimonialsSection />
      <FaqAccordion
        title="Portland Restoration FAQs"
        subtitle="Frequently asked questions about emergency dispatch, insurance billing, and mitigation procedures in Portland, OR."
        faqs={homeFaqs}
        enableJsonLd={false}
      />
      <ServiceAreasSection />
      <CTASection />
    </>
  )
}
