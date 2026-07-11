import Link from 'next/link'
import Image from 'next/image'
import { Phone, ArrowRight, Clock } from 'lucide-react'

export const metadata = {
  title: 'Restoration Services | Above & Beyond Restoration Portland, OR',
  description: 'Water damage, fire damage, mold remediation, smoke damage, demolition, and more. IICRC certified restoration services in Portland, OR. Call 503-608-2930.',
}

const services = [
  {
    name: 'Water Damage Restoration',
    description: 'Burst pipes, flooding, sewage backup — we extract water and dry your property fast to prevent secondary damage and mold growth.',
    image: '/images/water-damage.png',
    href: '/services/water-damage',
    tag: '24/7 Emergency',
  },
  {
    name: 'Fire Damage Restoration',
    description: 'Structural fire damage assessment, soot removal, odor elimination, and complete rebuild coordination for homes and businesses.',
    image: '/images/fire-damage.png',
    href: '/services/fire-damage',
    tag: '24/7 Emergency',
  },
  {
    name: 'Mold Remediation',
    description: 'IICRC-certified mold removal and remediation using containment protocols, HEPA filtration, and antimicrobial treatment.',
    image: '/images/mold-remediation.png',
    href: '/services/mold-remediation',
    tag: 'Certified',
  },
  {
    name: 'Smoke Damage Restoration',
    description: 'Comprehensive smoke and soot cleanup with thermal fogging odor elimination. We restore what fire smoke left behind.',
    image: '/images/smoke-damage.png',
    href: '/services/smoke-damage',
    tag: '24/7 Emergency',
  },
  {
    name: 'Demolition Services',
    description: 'Controlled selective demolition of fire, water, and mold-damaged materials. Full debris hauling and disposal included.',
    image: '/images/demolition.png',
    href: '/services/demolition',
    tag: 'Licensed',
  },
  {
    name: 'Clean Out & Junk Removal',
    description: 'Large-scale residential and commercial cleanouts, estate clearing, and job site debris removal throughout Portland Metro.',
    image: '/images/demolition.png',
    href: '/services/cleanout',
    tag: 'Same Day',
  },
  {
    name: 'Residential Restoration',
    description: 'End-to-end home restoration from emergency mitigation through final repairs, with direct insurance billing and daily updates.',
    image: '/images/hero-restoration.png',
    href: '/services/residential',
    tag: 'Full Service',
  },
  {
    name: 'Commercial Restoration',
    description: 'Large-scale commercial property restoration with phased work scheduling to minimize business interruption.',
    image: '/images/commercial.png',
    href: '/services/commercial',
    tag: 'Commercial',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange text-brand-orange px-3 py-1.5 rounded-full text-xs font-bold mb-5">
            <Clock className="w-3 h-3" />
            24/7 Emergency Service Available
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-white mb-5 text-balance"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Our Restoration Services
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Above & Beyond Restoration provides comprehensive damage mitigation and property restoration for residential and commercial clients throughout Portland, OR and surrounding communities.
          </p>
          <a
            href="tel:5036082930"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-orange text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call 503-608-2930
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                  <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {service.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h2
                    className="text-xl font-black text-brand-navy mb-2"
                    style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
                  >
                    {service.name}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold group-hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Not Sure What Service You Need?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Call us and describe what happened. Our experts will assess your situation and recommend the right course of action — at no charge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:5036082930"
              className="flex items-center gap-2 px-7 py-3.5 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              503-608-2930
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-7 py-3.5 bg-white text-brand-navy rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Request Free Estimate
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
