import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Droplets, Flame, Wind, Hammer, Trash2, Building, Home, Sprout } from 'lucide-react'

const services = [
  {
    icon: Droplets,
    title: 'Water Damage',
    description: 'Emergency water extraction, structural drying, and complete water damage restoration. We handle floods, burst pipes, and sewage backups.',
    href: '/services/water-damage',
    image: '/images/water-damage.png',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: Flame,
    title: 'Fire Damage',
    description: 'Complete fire damage restoration from emergency stabilization to full reconstruction. Soot removal, odor elimination, and structural repairs.',
    href: '/services/fire-damage',
    image: '/images/fire-damage.png',
    color: 'from-orange-600 to-red-700',
  },
  {
    icon: Sprout,
    title: 'Mold Remediation',
    description: 'IICRC certified mold testing, containment, and removal. We eliminate toxic mold using state-of-the-art equipment and proven techniques.',
    href: '/services/mold-remediation',
    image: '/images/mold-remediation.png',
    color: 'from-green-700 to-green-900',
  },
  {
    icon: Wind,
    title: 'Smoke Damage',
    description: 'Residue soot and smoke removal, deodorization, and content restoration after fire damage. Rapid response to prevent permanent damage.',
    href: '/services/smoke-damage',
    image: '/images/smoke-damage.png',
    color: 'from-gray-600 to-gray-900',
  },
  {
    icon: Hammer,
    title: 'Demolition Services',
    description: 'Controlled demolition of damaged structures, interior tear-outs, and selective demolition for reconstruction. Safe and efficient.',
    href: '/services/demolition',
    image: '/images/demolition.png',
    color: 'from-yellow-600 to-yellow-800',
  },
  {
    icon: Trash2,
    title: 'Clean Out & Junk Removal',
    description: 'Large-scale junk removal, property clean outs, and job site cleanup. Residential and commercial. Fast, efficient, and affordable.',
    href: '/services/cleanout',
    image: '/images/demolition.png',
    color: 'from-teal-600 to-teal-800',
  },
  {
    icon: Home,
    title: 'Residential Restoration',
    description: 'Complete residential property restoration for homes, condos, and rentals. From emergency mitigation to full reconstruction.',
    href: '/services/residential',
    image: '/images/hero-restoration.png',
    color: 'from-indigo-600 to-indigo-800',
  },
  {
    icon: Building,
    title: 'Commercial Restoration',
    description: 'Large-scale commercial property restoration with minimal business disruption. Offices, retail, industrial, and multi-unit properties.',
    href: '/services/commercial',
    image: '/images/commercial.png',
    color: 'from-blue-800 to-blue-950',
  },
]

export function ServicesOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">What We Do</span>
          <h2 className="text-3xl md:text-4xl font-black text-brand-navy mt-2 mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Complete Restoration Services
          </h2>
          <p className="text-gray-600 leading-relaxed">
            From emergency response to complete reconstruction, Above & Beyond Restoration handles every aspect of property damage recovery for residential and commercial clients.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${service.color} opacity-60`} />
                <div className="absolute inset-0 flex items-start p-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{service.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center text-brand-orange text-sm font-semibold group-hover:gap-2 transition-all gap-1">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-navy text-white rounded-xl font-bold hover:bg-blue-900 transition-colors"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
