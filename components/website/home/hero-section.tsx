'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, CheckCircle, Clock, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-restoration.png"
          alt="Professional restoration work in progress"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Emergency Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange text-brand-orange px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            24/7 Emergency Service Available Now
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Portland&apos;s Most Trusted
            <span className="text-brand-orange block">Property Restoration</span>
            Experts
          </h1>

          <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-8 max-w-2xl">
            When disaster strikes your home or business, Above & Beyond Restoration responds in 90 minutes or less. IICRC certified technicians, insurance billing experts, and a 100% satisfaction guarantee.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="tel:5036082930"
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-orange text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all hover:scale-[1.02] shadow-xl shadow-orange-900/30"
            >
              <Phone className="w-5 h-5" />
              Call Now: 503-608-2930
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-brand-navy rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-xl"
            >
              Get a Free Estimate
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Clock, text: '90-Min Response Time' },
              { icon: Shield, text: 'Licensed, Bonded & Insured' },
              { icon: CheckCircle, text: 'IICRC Certified Techs' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg">
                <item.icon className="w-5 h-5 text-brand-orange flex-shrink-0" />
                <span className="text-white text-sm font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
