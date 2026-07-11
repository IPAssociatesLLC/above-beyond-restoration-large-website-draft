'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

const categories = ['All', 'Water Damage', 'Fire Damage', 'Mold Remediation', 'Smoke Damage', 'Demolition', 'Commercial']

const gallery = [
  { id: 1, src: '/images/gallery-1.png', alt: 'Water damage restoration — before and after', category: 'Water Damage', location: 'Portland, OR' },
  { id: 2, src: '/images/gallery-2.png', alt: 'Mold remediation in crawlspace', category: 'Mold Remediation', location: 'Beaverton, OR' },
  { id: 3, src: '/images/gallery-3.png', alt: 'Industrial drying equipment setup', category: 'Water Damage', location: 'Lake Oswego, OR' },
  { id: 4, src: '/images/gallery-4.png', alt: 'Fire damage assessment', category: 'Fire Damage', location: 'Tigard, OR' },
  { id: 5, src: '/images/water-damage.png', alt: 'Water extraction services', category: 'Water Damage', location: 'Gresham, OR' },
  { id: 6, src: '/images/mold-remediation.png', alt: 'Professional mold removal', category: 'Mold Remediation', location: 'Portland, OR' },
  { id: 7, src: '/images/smoke-damage.png', alt: 'Smoke damage cleanup', category: 'Smoke Damage', location: 'Hillsboro, OR' },
  { id: 8, src: '/images/fire-damage.png', alt: 'Fire restoration work', category: 'Fire Damage', location: 'Salem, OR' },
  { id: 9, src: '/images/demolition.png', alt: 'Controlled demolition services', category: 'Demolition', location: 'Portland, OR' },
  { id: 10, src: '/images/commercial.png', alt: 'Commercial restoration project', category: 'Commercial', location: 'Portland, OR' },
  { id: 11, src: '/images/hero-restoration.png', alt: 'Large scale restoration project', category: 'Water Damage', location: 'Portland, OR' },
  { id: 12, src: '/images/team.png', alt: 'Above & Beyond Restoration team', category: 'Commercial', location: 'Portland, OR' },
]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<typeof gallery[0] | null>(null)

  const filtered = activeCategory === 'All' ? gallery : gallery.filter((g) => g.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto px-4">
          <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Photo Gallery</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-2 mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Our Restoration Work
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            See our work firsthand. Our gallery showcases completed restoration projects across the Portland metro area — from emergency water damage to complete fire restoration.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-orange text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="relative group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/50 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-3">
                  <span className="text-xs font-semibold text-brand-orange">{item.category}</span>
                  <p className="text-sm text-gray-700 font-medium mt-0.5 truncate">{item.alt}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload CTA */}
          <div className="mt-12 bg-brand-navy rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black text-white mb-2">Have Damage to Document?</h3>
            <p className="text-white/70 mb-6">Take photos and contact us — we use your images to create accurate damage assessments and insurance estimates.</p>
            <a href="tel:5036082930" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">
              Call 503-608-2930
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 rounded-full"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[80vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[75vh]"
            />
            <div className="bg-brand-navy px-4 py-3">
              <span className="text-brand-orange text-xs font-semibold">{lightbox.category}</span>
              <p className="text-white font-semibold mt-0.5">{lightbox.alt}</p>
              <p className="text-white/60 text-xs">{lightbox.location}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
