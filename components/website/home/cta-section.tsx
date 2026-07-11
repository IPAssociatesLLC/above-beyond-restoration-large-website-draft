import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative py-20 bg-brand-navy overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #F97316 0, #F97316 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Ready to Get Started?</span>
        <h2 className="text-3xl md:text-5xl font-black text-white mt-3 mb-5" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
          Restoration Done Right,
          <span className="text-brand-orange"> Above & Beyond.</span>
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Don&apos;t let damage worsen. Our IICRC certified team is available 24/7 to respond to any emergency and get your property back to normal — fast.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:5036082930"
            className="flex items-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-xl shadow-orange-900/30"
          >
            <Phone className="w-5 h-5" />
            Call 503-608-2930 Now
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
          >
            Request Free Estimate
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <p className="text-white/40 text-sm mt-6">
          90-Minute Response Time • Free Estimates • Insurance Billing • Licensed, Bonded & Insured
        </p>
      </div>
    </section>
  )
}
