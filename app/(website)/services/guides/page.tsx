import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllSeoPages } from '@/app/actions/seo-content'
import { MapPin, ArrowRight, Phone, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Service Guides & Local Coverage | Above & Beyond Restoration',
  description: 'Explore all published emergency water, fire, and mold restoration service guides across the greater Portland, Oregon metro area.',
}

export default async function ServiceGuidesPage() {
  const pages = await getAllSeoPages()

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>/</span>
              <span className="text-brand-orange font-semibold">Service Guides</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Restoration Service Guides & Local Coverage
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Explore our localized emergency restoration guides, rapid response procedures, and service overviews across Portland, Beaverton, Tigard, Hillsboro, and surrounding communities.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {pages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-2xl mx-auto shadow-sm">
            <Sparkles className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-black text-brand-navy mb-2">Service Guides Being Published Daily</h2>
            <p className="text-gray-600 mb-6">
              Our restoration experts are actively publishing localized service guides and coverage pages for the Portland metro area. Explore our core services or call us 24/7 for immediate dispatch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/services"
                className="w-full sm:w-auto px-6 py-3 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy/90 transition-colors"
              >
                View Core Services
              </Link>
              <a
                href="tel:5036082930"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
              >
                <Phone className="w-4 h-4" /> Call 24/7: 503-608-2930
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-semibold text-gray-500">
                Showing <span className="text-brand-navy font-bold">{pages.length}</span> published localized service guides
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pages.map((page) => (
                <article
                  key={page.id || page.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-48 w-full bg-brand-navy">
                    <Image
                      src={page.heroImage || '/images/water-damage.png'}
                      alt={page.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-brand-orange" />
                      {page.city || 'Portland, OR'}
                    </span>
                    {page.serviceCategory && (
                      <span className="absolute bottom-3 left-3 bg-brand-orange text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {page.serviceCategory}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-black text-brand-navy mb-3 line-clamp-2 hover:text-brand-orange transition-colors">
                      <Link href={`/services/${page.slug}`}>
                        {page.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {page.subtitle || (Array.isArray(page.description) ? page.description[0] : page.description)}
                    </p>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>24/7 Fast Dispatch</span>
                      </div>
                      <Link
                        href={`/services/${page.slug}`}
                        className="inline-flex items-center gap-1 text-brand-orange font-bold text-sm hover:gap-2 transition-all"
                      >
                        View Guide <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Emergency Bottom Banner */}
      <section className="bg-brand-navy text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Need Immediate Emergency Service in Your Area?</h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm mb-6">
            We respond on-site in 90 minutes or less with full moisture extraction and direct insurance billing.
          </p>
          <a
            href="tel:5036082930"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-colors"
          >
            <Phone className="w-5 h-5" /> Call 503-608-2930 (24/7 Dispatch)
          </a>
        </div>
      </section>
    </div>
  )
}
