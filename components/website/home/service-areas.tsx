import { MapPin } from 'lucide-react'

const areas = [
  'Portland', 'Beaverton', 'Hillsboro', 'Tigard', 'Lake Oswego',
  'Tualatin', 'Sherwood', 'Gresham', 'Troutdale', 'Salem',
  'Bend / Redmond', 'Oregon Coast', 'Newberg', 'Wilsonville', 'Canby',
]

export function ServiceAreasSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Where We Serve</span>
          <h2 className="text-3xl md:text-4xl font-black text-brand-navy mt-2 mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Serving the Greater Portland Area
          </h2>
          <p className="text-gray-600">
            Above & Beyond Restoration provides fast emergency response throughout the Portland metro area, Willamette Valley, Central Oregon, and Oregon Coast.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {areas.map((area) => (
            <div key={area} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-full text-sm font-medium text-gray-700 hover:bg-orange-50 hover:border-brand-orange hover:text-brand-orange transition-colors">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              {area}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don&apos;t see your city? <a href="tel:5036082930" className="text-brand-orange font-semibold hover:underline">Call us at 503-608-2930</a> — we likely serve your area.
        </p>
      </div>
    </section>
  )
}
