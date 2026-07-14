import Image from 'next/image'
import { CheckCircle, Clock, Shield, Award, DollarSign, Users } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: '90-Minute Response',
    description: 'We guarantee a 90-minute response time across the Portland metro, Salem, and surrounding areas. When minutes matter, we are there.',
  },
  {
    icon: Shield,
    title: 'Insurance Billing Experts',
    description: 'We work directly with your insurance company, handle all documentation, and fight to maximize your claim reimbursement.',
  },
  {
    icon: Award,
    title: 'IICRC Certified Technicians',
    description: 'All of our technicians hold IICRC certifications — the gold standard in the restoration industry.',
  },
  {
    icon: CheckCircle,
    title: '100% Satisfaction Guarantee',
    description: 'Every job comes with a full 1-year warranty and our 100% satisfaction guarantee. We stand behind our work.',
  },
  {
    icon: DollarSign,
    title: 'Free Estimates',
    description: 'No obligation, no surprises. We provide detailed written estimates at no cost so you know exactly what to expect.',
  },
  {
    icon: Users,
    title: 'Experienced & Professional',
    description: 'Years of experience handling the toughest residential and commercial restoration jobs in the Pacific Northwest.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/why-choose-us-team.png"
                alt="Above & Beyond Restoration technicians cleaning up water damage inside a home"
                width={600}
                height={450}
                className="object-cover w-full h-80 md:h-[450px]"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-brand-orange text-white p-6 rounded-2xl shadow-xl text-center hidden md:block">
              <p className="text-4xl font-black">500+</p>
              <p className="text-sm font-semibold mt-1">Happy Customers</p>
            </div>
            {/* Cert Badge */}
            <div className="absolute -top-4 -left-4 bg-brand-navy text-white p-4 rounded-2xl shadow-xl text-center hidden md:block">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">IICRC</p>
              <p className="text-xs font-semibold mt-0.5">Certified</p>
            </div>
          </div>

          {/* Content Column */}
          <div>
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-navy mt-2 mb-5" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Above & Beyond Is More Than a Name — It&apos;s Our Standard
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              When disaster strikes your home or business, you need a restoration company that goes the extra mile. We have the experience, equipment, and dedication to restore your property to pre-loss condition — and your peace of mind along with it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feature.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy text-sm mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
