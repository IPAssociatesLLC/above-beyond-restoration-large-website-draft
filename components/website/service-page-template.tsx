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
  relatedServices: { name: string; href: string }[]
}

function renderMarkdownText(text: string) {
  const parts = []
  const regex = /\[(.*?)\]\((.*?)\)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    const label = match[1]
    const href = match[2]
    parts.push(
      <Link
        key={match.index}
        href={href}
        className="text-brand-orange font-semibold hover:underline"
      >
        {label}
      </Link>
    )
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  return parts.length > 0 ? parts : text
}

export function ServicePageTemplate({
  title,
  subtitle,
  heroImage,
  description,
  benefits,
  process,
  faqs,
  relatedServices,
}: ServicePageProps) {
  return (
    <>
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
              <Link href="/contact" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-brand-navy rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description with contextual internal links */}
              <div>
                <div className="space-y-4 text-gray-600 leading-relaxed text-base">
                  {description.map((para, i) => (
                    <p key={i}>{renderMarkdownText(para)}</p>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-black text-brand-navy mb-5" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                  What&apos;s Included
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                      <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div>
                <h2 className="text-2xl font-black text-brand-navy mb-5" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                  Our Process
                </h2>
                <div className="space-y-5">
                  {process.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-brand-orange text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-navy">{step.title}</h3>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Timeline Guide (Search-IQ Recommended) */}
              <div className="bg-gradient-to-br from-brand-navy to-slate-900 text-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Transparent Pricing & Turnaround Times</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                  Restoration Pricing & Timeline Guide
                </h2>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  We use industry-standard Xactimate 2025 pricing to ensure full transparency and direct alignment with your insurance adjuster.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-brand-orange text-xs font-bold uppercase">Dispatch Arrival</p>
                    <p className="text-xl font-black text-white mt-1">90 Minutes</p>
                    <p className="text-white/60 text-xs mt-1">24/7 on-site emergency response in Portland Metro</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-brand-orange text-xs font-bold uppercase">Drying Guarantee</p>
                    <p className="text-xl font-black text-white mt-1">3–5 Days</p>
                    <p className="text-white/60 text-xs mt-1">5-day maximum dryout fee guarantee on clean water</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-brand-orange text-xs font-bold uppercase">Insurance Billing</p>
                    <p className="text-xl font-black text-white mt-1">100% Direct</p>
                    <p className="text-white/60 text-xs mt-1">We bill your carrier directly with zero upfront fees</p>
                  </div>
                </div>
              </div>

              {/* FAQs with Interactive Accordion and FAQPage Schema */}
              <div>
                <FaqAccordion
                  title={`${title} FAQs`}
                  subtitle={`Common questions regarding ${title.toLowerCase()}, insurance claims, and emergency response in Portland, OR.`}
                  faqs={faqs}
                  badge="Service FAQs"
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

              {/* Contact Info with Verified CCB */}
              <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-2xl p-5 text-center">
                <p className="text-brand-navy font-bold text-sm mb-1">P.O. Box 542, Sherwood, OR 97140</p>
                <p className="text-gray-700 text-xs font-semibold">Oregon CCB #262371 | Licensed, Bonded, Insured</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
