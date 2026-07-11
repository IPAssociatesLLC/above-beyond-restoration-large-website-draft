import Link from 'next/link'
import { Phone, AlertTriangle } from 'lucide-react'

export function EmergencyBanner() {
  return (
    <section className="bg-brand-orange py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                Property Damage Doesn&apos;t Wait
              </h2>
              <p className="text-white/90 mt-1 text-lg">
                The first 24-48 hours are critical. Every hour without action increases damage and costs.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="tel:5036082930"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-orange rounded-xl font-black text-lg hover:bg-orange-50 transition-colors shadow-xl"
            >
              <Phone className="w-5 h-5" />
              503-608-2930
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-navy text-white rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors"
            >
              Get Help Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
