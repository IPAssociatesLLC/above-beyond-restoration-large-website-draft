import { Phone, Shield, Award, Clock, Star, CheckCircle } from 'lucide-react'

const stats = [
  { icon: Phone, value: '24/7', label: 'Emergency Response' },
  { icon: Clock, value: '90 Min', label: 'Response Time' },
  { icon: Shield, value: '100%', label: 'Satisfaction Guarantee' },
  { icon: Award, value: 'IICRC', label: 'Certified Technicians' },
  { icon: Star, value: '500+', label: 'Satisfied Customers' },
  { icon: CheckCircle, value: '1 Year', label: 'Full Warranty' },
]

export function TrustBar() {
  return (
    <section className="bg-brand-navy py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <stat.icon className="w-6 h-6 text-brand-orange mb-2" />
              <span className="text-white font-black text-xl md:text-2xl">{stat.value}</span>
              <span className="text-white/60 text-xs mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
