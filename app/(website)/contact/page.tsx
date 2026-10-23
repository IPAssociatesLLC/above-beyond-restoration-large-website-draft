import type { Metadata } from 'next'
import { ContactFormView } from '@/components/website/contact-form-view'

export const metadata: Metadata = {
  title: 'Contact Above & Beyond Restoration | 24/7 Emergency Dispatch Portland OR',
  description:
    'Request immediate 24/7 emergency dispatch or schedule a free property restoration estimate in Portland, OR. 90-minute response time guaranteed. Call 503-608-2930.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Above & Beyond Restoration | 24/7 Emergency Dispatch Portland OR',
    description:
      'Available 24/7/365 for emergency water, mold, fire, and smoke restoration across Portland metro. Call 503-608-2930.',
    type: 'website',
    url: 'https://www.abovebeyondrestorationllc.com/contact',
  },
}

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://www.abovebeyondrestorationllc.com/contact#webpage',
      url: 'https://www.abovebeyondrestorationllc.com/contact',
      name: 'Contact Above & Beyond Restoration',
      description: 'Emergency restoration contact and free estimate request page for Portland, Oregon.',
    },
    {
      '@type': 'EmergencyService',
      '@id': 'https://www.abovebeyondrestorationllc.com/#organization',
      name: 'Above & Beyond Restoration',
      legalName: 'Above & Beyond Restoration LLC',
      telephone: '+1-503-608-2930',
      email: 'TommyBletcher@gmail.com',
      url: 'https://www.abovebeyondrestorationllc.com',
      priceRange: '$$',
      taxID: 'CCB #262371',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '8580 SW Wilson Lane',
        addressLocality: 'Wilsonville',
        addressRegion: 'OR',
        postalCode: '97070',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'City', name: 'Portland' },
        { '@type': 'City', name: 'Beaverton' },
        { '@type': 'City', name: 'Tigard' },
        { '@type': 'City', name: 'Wilsonville' },
        { '@type': 'City', name: 'Tualatin' },
        { '@type': 'City', name: 'Clackamas' },
        { '@type': 'City', name: 'Hillsboro' },
        { '@type': 'City', name: 'Lake Oswego' },
        { '@type': 'City', name: 'Sherwood' },
        { '@type': 'City', name: 'Gresham' },
        { '@type': 'City', name: 'Oregon City' },
        { '@type': 'City', name: 'West Linn' },
        { '@type': 'City', name: 'Salem' },
        { '@type': 'City', name: 'Vancouver' }
      ],
      regionsServed: [
        { '@type': 'State', name: 'Oregon' },
        { '@type': 'State', name: 'Washington' }
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      ],
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
          name: 'Contact Us',
          item: 'https://www.abovebeyondrestorationllc.com/contact',
        },
      ],
    },
  ],
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactFormView />
    </>
  )
}
