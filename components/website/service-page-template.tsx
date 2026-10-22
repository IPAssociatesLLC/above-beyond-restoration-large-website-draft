import Image from 'next/image'
import Link from 'next/link'
import { Phone, CheckCircle, ArrowRight, Clock } from 'lucide-react'
import { FaqAccordion } from '@/components/website/faq-accordion'

interface ServicePageProps {
  title: string
  subtitle: string
  heroImage: string
  description: string[]
  benefits: string[]
  process: { title: string; description: string }[]
  faqs: { q: string; a: string }[]
  relatedServices?: { name: string; href: string }[]
  slug?: string
  enableJsonLd?: boolean
}

function renderMarkdownText(text: string): React.ReactNode {
  const linkRegex = /\[(.*?)\]\((.*?)\)/g
  const parts: (string | React.ReactNode)[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    const linkText = match[1].replace(/\*\*/g, '')
    const href = match[2]
    parts.push(
      <Link
        key={`link-${match.index}`}
        href={href}
        className="text-brand-orange font-bold hover:underline"
      >
        {linkText}
      </Link>
    )
    lastIndex = linkRegex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  const result: React.ReactNode[] = []
  parts.forEach((part, pIdx) => {
    if (typeof part !== 'string') {
      result.push(part)
      return
    }
    const boldParts = part.split(/(\*\*.*?\*\*)/)
    boldParts.forEach((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        result.push(
          <strong key={`b-${pIdx}-${bIdx}`} className="font-bold text-brand-navy">
            {bPart.slice(2, -2)}
          </strong>
        )
      } else if (bPart) {
        result.push(bPart)
      }
    })
  })

  return result
}

export function ServicePageTemplate({
  title,
  subtitle,
  heroImage,
  description,
  benefits,
  process,
  faqs,
  relatedServices = [],
  slug,
  enableJsonLd = true,
}: ServicePageProps) {
  // Prevent duplicate 'Emergency Emergency...'
  const cleanTitle = title.replace(/^Emergency\s+/i, '').trim()
  const displayTitle = title.startsWith('Emergency') ? title : `Emergency ${title}`
  const isMold = title.toLowerCase().includes('mold')
  const isFire = title.toLowerCase().includes('fire') || title.toLowerCase().includes('smoke')
  const isDemo = title.toLowerCase().includes('demolition')

  const canonicalUrl = slug
    ? `https://www.abovebeyondrestorationllc.com/services/${slug}`
    : 'https://www.abovebeyondrestorationllc.com/services'

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        serviceType: cleanTitle,
        name: title,
        description: subtitle,
        provider: {
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
        areaServed: [
          { '@type': 'City', name: 'Portland' },
          { '@type': 'City', name: 'Beaverton' },
          { '@type': 'City', name: 'Tigard' },
          { '@type': 'City', name: 'Hillsboro' },
          { '@type': 'City', name: 'Lake Oswego' },
          { '@type': 'City', name: 'Sherwood' },
          { '@type': 'City', name: 'Gresham' },
          { '@type': 'City', name: 'Oregon City' },
          { '@type': 'City', name: 'West Linn' },
          { '@type': 'City', name: 'Salem' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
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
            name: title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  }

  return (
    <>
      {enableJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {/* Hero */}
      <section className="relative bg-brand-navy py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src={heroImage} alt={title} fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-brand-navy/70 z-0" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-white/60 text-sm hover:text-white">Home</Link>
              <span className="text-white/40">/</span>
              <Link href="/services" className="text-white/60 text-sm hover:text-white">Services</Link>
              <span className="text-white/40">/</span>
              <span className="text-brand-orange text-sm font-semibold">{title}</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange text-brand-orange px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Clock className="w-3 h-3" />
              24/7 Emergency Available
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              {title}
            </h1>
            <p className="text-white/80 text-xl mb-8 leading-relaxed">{subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:5036082930" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">
                <Phone className="w-4 h-4" /> Call 503-608-2930
              </a>
              <Link href="/contact" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20">
                Request Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left 2 Cols: Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About the Service */}
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-brand-navy mb-6" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                  Professional {displayTitle} in Portland, OR
                </h2>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  {description.map((p, i) => (
                    <p key={i}>{renderMarkdownText(p)}</p>
                  ))}
                </div>
              </div>

              {/* Benefits / What's Included */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-black text-brand-navy mb-6" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                  What&apos;s Included in Our {cleanTitle} Services
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((b) => (
                    <div key={b} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium text-sm">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Process */}
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-brand-navy mb-6" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                  Our Certified {cleanTitle} Protocol
                </h2>
                <div className="space-y-4">
                  {process.map((step, i) => (
                    <div key={step.title} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-9 h-9 rounded-xl bg-brand-orange text-white flex items-center justify-center font-black text-base flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-navy text-lg mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing / Guarantee Highlight */}
              <div className="bg-orange-50 border border-brand-orange/30 rounded-2xl p-6">
                <h3 className="text-lg font-black text-brand-navy mb-2">
                  {isMold
                    ? 'IICRC S520 Mold Remediation Standard'
                    : isFire
                    ? 'Complete Fire, Soot & Odor Restoration'
                    : isDemo
                    ? 'Safe, Clean & Controlled Demolition'
                    : 'Our 5-Day Maximum Dry-Out Charge Guarantee'}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {isMold
                    ? 'Our certified mold remediation protocols adhere strictly to IICRC S520 standards. We isolate contaminated areas with plastic containment barriers under negative air pressure, physically remove unsalvageable porous materials, and seal remaining structures with EPA-registered botanical antimicrobials and Kilz barrier coatings.'
                    : isFire
                    ? 'We eliminate soot and hazardous smoke particulates from HVAC systems, walls, and structural cavities using chemical soot sponges, thermal fogging, and HEPA carbon filtration. We restore salvageable items and rebuild non-salvageable structures.'
                    : isDemo
                    ? 'We perform precision selective demolition targeting only moisture-damaged or mold-compromised drywall, flooring, and insulation while protecting non-damaged framing and structures.'
                    : 'For Category 1 clean water losses, we guarantee our drying equipment rental charges are capped at a maximum of 5 days. We work fast, bill your insurance directly, and ensure your home or business is certified dry.'}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-brand-navy">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-brand-orange" />
                    {isMold ? '2–4 Day Containment & Clearance' : isFire ? 'Full Fire & Smoke Scope' : isDemo ? 'Clean Debris Disposal' : '5-Day Max Drying Charge'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-brand-orange" />
                    100% Direct Insurance Billing
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-brand-orange" />
                    Oregon CCB #262371 Licensed
                  </span>
                </div>
              </div>

              {/* FAQs with Keyword in Title */}
              <div className="pt-4">
                <FaqAccordion
                  title={`${cleanTitle} FAQs`}
                  subtitle={`Common questions regarding ${cleanTitle.toLowerCase()}, insurance claims, and emergency response across Portland Metro.`}
                  faqs={faqs}
                  badge="Service FAQs"
                  enableJsonLd={false}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="bg-brand-navy rounded-2xl p-6 text-white">
                <h3 className="text-xl font-black mb-2">Need Help Now?</h3>
                <p className="text-white/70 text-sm mb-5">We respond in 90 minutes. Available 24/7 for emergencies.</p>
                <a
                  href="tel:5036082930"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors mb-3"
                >
                  <Phone className="w-4 h-4" />
                  503-608-2930
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Request Estimate
                </Link>
              </div>

              {/* Why Us */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-black text-brand-navy mb-4">Why Above & Beyond</h3>
                <ul className="space-y-3">
                  {[
                    '90-Minute Response Time',
                    'IICRC Certified Technicians',
                    'Free Estimates & Thermal Moisture Scans',
                    'Direct Insurance Billing via Xactimate',
                    '100% Satisfaction Guarantee',
                    'Licensed, Bonded & Insured (CCB #262371)',
                    '1 Year Full Warranty on Reconstruction',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Services */}
              {relatedServices && relatedServices.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-black text-brand-navy mb-4">Related Services</h3>
                  <ul className="space-y-2">
                    {relatedServices.map((s) => (
                      <li key={s.name}>
                        <Link href={s.href} className="flex items-center gap-2 text-sm text-gray-700 hover:text-brand-orange transition-colors py-1">
                          <ArrowRight className="w-3 h-3 text-brand-orange" />
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Info with Verified CCB */}
              <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-2xl p-5 text-center">
                <p className="text-brand-navy font-bold text-sm mb-1">Serving Portland OR & Vanvoucer WA metro areas.</p>
                <p className="text-gray-700 text-xs font-semibold">Oregon CCB #262371 | Licensed, Bonded, Insured</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
