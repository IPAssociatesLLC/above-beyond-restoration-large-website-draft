import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Jennifer M.',
    location: 'Portland, OR',
    rating: 5,
    text: 'Above & Beyond lived up to their name! Our basement flooded at 2am and they were on-site within an hour. Professional, thorough, and handled our insurance claim seamlessly. The team was exceptional.',
    service: 'Water Damage',
  },
  {
    name: 'Robert T.',
    location: 'Beaverton, OR',
    rating: 5,
    text: 'After a kitchen fire, we were devastated. Tommy and his crew made the restoration process as painless as possible. They documented everything for insurance, communicated every step, and restored our home beautifully.',
    service: 'Fire Damage',
  },
  {
    name: 'Sarah K.',
    location: 'Lake Oswego, OR',
    rating: 5,
    text: 'Discovered black mold in our crawl space. Above & Beyond came out immediately, explained everything clearly, and did an incredibly thorough job. Our air quality tests came back perfect. Highly recommend!',
    service: 'Mold Remediation',
  },
  {
    name: 'Michael D.',
    location: 'Gresham, OR',
    rating: 5,
    text: 'Used them for a major property cleanout. Huge job, multiple truckloads — they handled it efficiently and professionally. Fair pricing, great communication. Will definitely use them again.',
    service: 'Clean Out',
  },
  {
    name: 'Karen L.',
    location: 'Salem, OR',
    rating: 5,
    text: 'Our commercial building had significant water damage from a roof leak. Above & Beyond had their team on-site quickly and minimized our business downtime. Excellent work, excellent team.',
    service: 'Commercial Restoration',
  },
  {
    name: 'David W.',
    location: 'Tigard, OR',
    rating: 5,
    text: 'The 90-minute response time is real — they showed up fast when our pipes burst. The crew was knowledgeable, respectful of our home, and got everything dried out properly. No mold issues months later.',
    service: 'Water Damage',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-brand-navy">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2 mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-brand-orange fill-brand-orange" />
            ))}
          </div>
          <p className="text-white/70">5.0 Average Rating — Hundreds of Satisfied Portland-Area Customers</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((review, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <Quote className="w-8 h-8 text-brand-orange/60 mb-3" />
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-brand-orange fill-brand-orange" />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  <p className="text-white/50 text-xs">{review.location}</p>
                </div>
                <span className="text-xs font-semibold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                  {review.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
