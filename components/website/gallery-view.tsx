'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, ArrowRight, Shield } from 'lucide-react'

const galleryCategories = [
  'All Projects',
  'Water Damage',
  'Fire Damage',
  'Mold Remediation',
  'Smoke Damage',
  'Demolition',
]

const galleryItems = [
  {
    title: 'Emergency Basement Water Extraction',
    category: 'Water Damage',
    location: 'Portland, OR (Cedar Hills)',
    description: 'Rapid 90-minute dispatch for a ruptured water heater line with 3 inches of standing water across finished basement living areas.',
    image: '/images/water-damage.png',
    badge: 'Clean Water Category 1',
  },
  {
    title: 'IICRC S520 Crawlspace Mold Remediation',
    category: 'Mold Remediation',
    location: 'Beaverton, OR',
    description: 'Airtight plastic containment with HEPA air scrubbers, physical removal of saturated subfloor insulation, wire-brushing joists, and Kilz barrier sealing.',
    image: '/images/mold-remediation.png',
    badge: 'Certified Mold Clearance',
  },
  {
    title: 'Residential Fire & Soot Restoration',
    category: 'Fire Damage',
    location: 'Tigard, OR',
    description: 'Full kitchen fire recovery including chemical soot sponge cleaning, structural wood framing treatment, and complete drywall reconstruction.',
    image: '/images/fire-damage.png',
    badge: 'Dual Loss Fire & Water',
  },
  {
    title: 'Whole-Home Smoke Odor Elimination',
    category: 'Smoke Damage',
    location: 'Lake Oswego, OR',
    description: 'Thermal fogging and industrial hydroxyl generators deployed to neutralize deep smoke odors embedded in wall framing and HVAC systems.',
    image: '/images/smoke-damage.png',
    badge: 'Thermal Fogging Deodorization',
  },
  {
    title: 'Selective Structural Demolition & Strip-Out',
    category: 'Demolition',
    location: 'Oregon City, OR',
    description: 'Controlled selective interior tear-out of flood-damaged drywall and compromised hardwood flooring down to clean framing.',
    image: '/images/demolition.png',
    badge: 'Dust Containment Barrier',
  },
  {
    title: 'Commercial Multi-Family Water Loss',
    category: 'Water Damage',
    location: 'Hillsboro, OR',
    description: 'Large-loss commercial drying with industrial LGR dehumidifiers and high-velocity air movers capped under our 5-Day dryout guarantee.',
    image: '/images/commercial.png',
    badge: 'Commercial Large Loss',
  },
]

export function GalleryView() {
  const [activeCategory, setActiveCategory] = useState('All Projects')

  const filteredItems =
    activeCategory === 'All Projects'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-brand-navy py-16 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="text-brand-orange font-bold text-sm uppercase tracking-widest mb-2 inline-block">
            Project Gallery
          </span>
          <h1
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Restoration Project Gallery
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Explore photo documentation of emergency water mitigation, certified mold containment, fire cleanup, and structural rebuilds across the Portland metropolitan area.
          </p>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 justify-start sm:justify-center scrollbar-none">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-56 w-full bg-brand-navy">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {item.location}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-brand-orange text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-brand-navy mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">{item.category}</span>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 text-brand-orange text-xs font-bold hover:gap-2 transition-all"
                    >
                      Request Estimate <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Emergency Banner */}
      <section className="bg-brand-navy text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange text-brand-orange px-3 py-1 rounded-full text-xs font-bold mb-4">
            <Shield className="w-3.5 h-3.5" />
            Oregon CCB #262371 Licensed & Insured
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-3">Facing a Property Emergency?</h2>
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            Our certified crews arrive on-site within 90 minutes equipped for immediate water extraction, mold containment, or fire cleanup.
          </p>
          <a
            href="tel:5036082930"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-colors"
          >
            <Phone className="w-4 h-4" /> Call 503-608-2930 (24/7 Dispatch)
          </a>
        </div>
      </section>
    </div>
  )
}
