import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Award, Clock, CheckCircle, Phone, DollarSign, Star } from 'lucide-react'
import { FaqAccordion } from '@/components/website/faq-accordion'

export const metadata: Metadata = {
  title: 'About Above & Beyond Restoration | IICRC Certified Portland OR',
  description:
    'Meet Portland\'s premier property restoration team. CCB #262371 licensed, bonded & insured with 24/7 emergency dispatch and certified mitigation specialists.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Above & Beyond Restoration | IICRC Certified Portland OR',
    description:
      'Learn about Above & Beyond Restoration — Portland\'s IICRC certified restoration experts. 24/7 emergency service, 90-minute response, licensed and insured.',
    type: 'website',
    url: 'https://www.abovebeyondrestorationllc.com/about',
  },
}

const certifications = [
  { label: 'IICRC Certified', sub: 'Institute of Inspection, Cleaning and Restoration' },
  { label: 'Xactimate Certified', sub: 'Industry-standard damage estimating software' },
  { label: 'CCB #262371', sub: 'Oregon Construction Contractors Board (Licensed, Bonded & Insured)' },
  { label: 'Licensed, Bonded & Insured', sub: 'Full $2M liability coverage for your peace of mind' },
  { label: '100% Satisfaction Guarantee', sub: 'We stand behind every job we do' },
  { label: '1 Year Full Warranty', sub: 'On all restoration and reconstruction work' },
]

const processSteps = [
  {
    step: '01',
    title: 'Emergency Contact',
    description: 'Call us 24/7 at 503-608-2930. Our dispatcher gathers key information to get the right team mobilized immediately.',
  },
  {
    step: '02',
    title: '90-Min Response',
    description: 'Our certified technicians arrive on-site within 90 minutes with all necessary equipment to begin emergency mitigation.',
  },
  {
    step: '03',
    title: 'Assessment & Plan',
    description: 'We thoroughly assess all damage, document everything with photos and moisture readings, and create a detailed restoration plan.',
  },
  {
    step: '04',
    title: 'Insurance Filing',
    description: 'We handle all insurance documentation and communication directly, ensuring you get the maximum claim reimbursement.',
  },
  {
    step: '05',
    title: 'Restoration Work',
    description: 'Our certified technicians perform all mitigation and restoration work to the highest industry standards.',
  },
  {
    step: '06',
    title: 'Final Inspection',
    description: 'We conduct a thorough final inspection and ensure you are completely satisfied before considering the job done.',
  },
]

const aboutFaqs = [
  {
    q: 'How does Above & Beyond advocate for me during an insurance claim?',
    a: 'We document all moisture readings with infrared thermal cameras, create an itemized scope using Xactimate (the exact estimating software insurance adjusters use), and communicate directly with your insurance company to make sure the claim is approved properly.',
  },
  {
    q: 'What is your Oregon contractor license number?',
    a: 'Above & Beyond Restoration is licensed with the Oregon Construction Contractors Board under CCB #262371, fully bonded and insured with $2,000,000 in comprehensive general liability coverage.',
  },
  {
    q: 'Do you offer a warranty on reconstruction and repairs?',
    a: 'Yes. We provide a 1-year full workmanship warranty on all structural repairs and reconstruction performed by our licensed crew.',
  },
]

const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://www.abovebeyondrestorationllc.com/about#webpage',
      url: 'https://www.abovebeyondrestorationllc.com/about',
      name: 'About Above & Beyond Restoration',
      description: 'Portland IICRC certified restoration company history, team, and CCB #262371 credentials.',
    },
    {
      '@type': 'EmergencyService',
      '@id': 'https://www.abovebeyondrestorationllc.com/#organization',
      name: 'Above & Beyond Restoration',
      legalName: 'Above & Beyond Restoration LLC',
      telephone: '+1-503-608-2930',
      email: 'TommyBletcher@gmail.com',
      url: 'https://www.abovebeyondrestorationllc.com',
      taxID: 'CCB #262371',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        postOfficeBoxNumber: 'P.O. Box 542',
        addressLocality: 'Sherwood',
        addressRegion: 'OR',
        postalCode: '97140',
        addressCountry: 'US',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.abovebeyondrestorationllc.com/about#faq',
      mainEntity: aboutFaqs.map((faq) => ({
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
          name: 'About Us',
          item: 'https://www.abovebeyondrestorationllc.com/about',
        },
      ],
    },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {/* Hero */}
      <section className="relative bg-brand-navy py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #F97316 0, #F97316 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">About Us</span>
            <h1
              className="text-4xl md:text-5xl font-black text-white mt-2 mb-5"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
            >
              Portland&apos;s Property Restoration Experts
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Above & Beyond Restoration has been serving the Portland metropolitan area with professional, IICRC-certified restoration services. We specialize in the toughest water, mold, fire, and smoke damage jobs — utilizing state-of-the-art equipment and proven techniques.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Our Mission</span>
              <h2
                className="text-3xl font-black text-brand-navy mt-2 mb-5"
                style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
              >
                Taking Your Worries Away When Disaster Strikes
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Above and Beyond Restoration specializes in the toughest water and mold remediation jobs utilizing state of the art equipment. We serve the Portland, Salem, Bend/Redmond, and Oregon Coast areas.
                </p>
                <p>
                  Above & Beyond provides 24-hour emergency service for water, smoke, fire, mold and sewer damage, 7 days a week, 365 days a year. When disaster strikes, prompt and effective response can be critical in limiting the magnitude of the damage.
                </p>
                <p>
                  We also specialize in complete reconstruction for condos, rentals, and residential properties. We guarantee all work and provide a full 1 year warranty. We work with your insurance company to ensure you get the maximum reimbursement for your property losses.
                </p>
                <p>
                  Above & Beyond takes your worries away by helping you document your losses, billing your insurance company directly, and maintaining excellent relationships with many top companies in order to obtain efficient and fast processing.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="tel:5036082930"
                  className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call 503-608-2930
                </a>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-brand-navy text-white rounded-xl font-bold hover:bg-blue-900 transition-colors"
                >
                  Request an Estimate
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '24/7', label: 'Emergency Response' },
                { number: '90 Min', label: 'Guaranteed Arrival' },
                { number: '100%', label: 'Satisfaction Guarantee' },
                { number: '1 Year', label: 'Workmanship Warranty' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                  <p
                    className="text-3xl md:text-4xl font-black text-brand-orange mb-1"
                    style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                  >
                    {stat.number}
                  </p>
                  <p className="text-sm font-semibold text-brand-navy">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Badges */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Credentials</span>
            <h2
              className="text-3xl font-black text-brand-navy mt-2"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
            >
              Licensed, Certified & Trusted
            </h2>
            <p className="text-gray-600 mt-2">Every technician is fully trained, certified, and background-checked</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy">{cert.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cert.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6-Step Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">How We Work</span>
            <h2
              className="text-3xl md:text-4xl font-black text-brand-navy mt-2"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
            >
              Our 6-Step Restoration Process
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              From the initial phone call to the final sign-off, we ensure complete transparency and quality at every step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <div key={step.step} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
                <span
                  className="text-4xl font-black text-brand-orange/30 absolute top-4 right-4"
                  style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                >
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-brand-navy mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-black text-brand-navy"
              style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
            >
              Service Areas
            </h2>
            <p className="text-gray-600 mt-2">Proud to serve the greater Portland metropolitan area and beyond</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              'Portland',
              'Beaverton',
              'Hillsboro',
              'Tigard',
              'Lake Oswego',
              'Tualatin',
              'Sherwood',
              'Gresham',
              'Troutdale',
              'Salem',
              'Bend / Redmond',
              'Oregon Coast',
              'Newberg',
              'Wilsonville',
              'Canby',
              'Milwaukie',
              'West Linn',
              'Oregon City',
            ].map((area) => (
              <div key={area} className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About FAQs */}
      <FaqAccordion
        title="About Our Services & Credentials"
        subtitle="Learn more about our certifications, insurance processes, and warranty guarantees."
        faqs={aboutFaqs}
        enableJsonLd={false}
      />
    </>
  )
}
