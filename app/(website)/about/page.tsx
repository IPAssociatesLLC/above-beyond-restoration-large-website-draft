import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Award, Clock, CheckCircle, Phone, DollarSign, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Above & Beyond Restoration Portland OR',
  description: 'Learn about Above & Beyond Restoration — Portland\'s IICRC certified restoration experts. 24/7 emergency service, 90-minute response, licensed and insured. CCB #193269.',
}

const certifications = [
  { label: 'IICRC Certified', sub: 'Institute of Inspection, Cleaning and Restoration' },
  { label: 'Xactimate Certified', sub: 'Industry-standard damage estimating software' },
  { label: 'CCB #193269', sub: 'Oregon Construction Contractors Board' },
  { label: 'Licensed, Bonded & Insured', sub: 'Full coverage for your peace of mind' },
  { label: '100% Satisfaction Guarantee', sub: 'We stand behind every job we do' },
  { label: '1 Year Full Warranty', sub: 'On all restoration work performed' },
]

const processSteps = [
  {
    step: '01',
    title: 'Emergency Contact',
    description: 'Call us 24/7 at 503-608-2930. Our dispatcher gathers key information to get the right team mobilized immediately.',
  },
  {
    step: '02',
    title: '90-Min Response',
    description: 'Our certified technicians arrive on-site within 90 minutes with all necessary equipment to begin emergency mitigation.',
  },
  {
    step: '03',
    title: 'Assessment & Plan',
    description: 'We thoroughly assess all damage, document everything with photos and moisture readings, and create a detailed restoration plan.',
  },
  {
    step: '04',
    title: 'Insurance Filing',
    description: 'We handle all insurance documentation and communication directly, ensuring you get the maximum claim reimbursement.',
  },
  {
    step: '05',
    title: 'Restoration Work',
    description: 'Our certified technicians perform all mitigation and restoration work to the highest industry standards.',
  },
  {
    step: '06',
    title: 'Final Inspection',
    description: 'We conduct a thorough final inspection and ensure you are completely satisfied before considering the job done.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-navy py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #F97316 0, #F97316 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }} />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">About Us</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-2 mb-5" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Portland&apos;s Property Restoration Experts
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Above & Beyond Restoration has been serving the Portland metropolitan area with professional, IICRC-certified restoration services. We specialize in the toughest water, mold, fire, and smoke damage jobs — utilizing state-of-the-art equipment and proven techniques.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Our Mission</span>
              <h2 className="text-3xl font-black text-brand-navy mt-2 mb-5" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                Taking Your Worries Away When Disaster Strikes
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Above and Beyond Restoration specializes in the toughest water and mold remediation jobs utilizing state of the art equipment. We serve the Portland, Salem, Bend/Redmond, and Oregon Coast areas.
                </p>
                <p>
                  Above & Beyond provides 24-hour emergency service for water, smoke, fire, mold and sewer damage, 7 days a week, 365 days a year. When disaster strikes, prompt and effective response can be critical in limiting the magnitude of the damage.
                </p>
                <p>
                  We also specialize in complete reconstruction for condos, rentals, and residential properties. We guarantee all work and provide a full 1 year warranty. We work with your insurance company to ensure you get the maximum reimbursement for your property losses.
                </p>
                <p>
                  Above & Beyond takes your worries away by helping you document your losses, billing your insurance company directly, and maintaining excellent relationships with many top companies in order to obtain efficient and fast processing.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="tel:5036082930" className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  Call 503-608-2930
                </a>
                <Link href="/contact" className="flex items-center gap-2 px-6 py-3 bg-brand-navy text-white rounded-xl font-bold hover:bg-blue-900 transition-colors">
                  Free Estimate
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/team.png"
                  alt="Above & Beyond Restoration team"
                  width={600}
                  height={450}
                  className="object-cover w-full h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Credentials</span>
            <h2 className="text-3xl font-black text-brand-navy mt-2" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Our Certifications & Guarantees
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy">{cert.label}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{cert.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Our Process</span>
            <h2 className="text-3xl font-black text-brand-navy mt-2 mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              How We Restore Your Property
            </h2>
            <p className="text-gray-600">A proven, systematic approach that limits damage, reduces costs, and restores your property to pre-loss condition.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <div key={step.step} className="relative">
                <div className="text-6xl font-black text-gray-100 leading-none mb-3">{step.step}</div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section id="insurance" className="py-16 bg-brand-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <DollarSign className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              We Handle Insurance So You Don&apos;t Have To
            </h2>
            <p className="text-white/80 leading-relaxed mb-8">
              Above & Beyond Restoration works directly with all major insurance companies. We document your losses, create detailed Xactimate estimates, bill your insurance company directly, and maintain excellent relationships with adjusters to ensure fast, efficient claim processing and maximum reimbursement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Shield, text: 'Direct Insurance Billing' },
                { icon: Star, text: 'Maximum Claim Reimbursement' },
                { icon: Award, text: 'Xactimate Certified Estimates' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2 bg-white/10 rounded-xl p-4">
                  <item.icon className="w-5 h-5 text-brand-orange" />
                  <span className="text-white font-semibold text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <a href="tel:5036082930" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">
              <Phone className="w-5 h-5" />
              Call 503-608-2930 for Help
            </a>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Service Areas
            </h2>
            <p className="text-gray-600 mt-2">Proud to serve the greater Portland metropolitan area and beyond</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Portland', 'Beaverton', 'Hillsboro', 'Tigard', 'Lake Oswego', 'Tualatin', 'Sherwood', 'Gresham', 'Troutdale', 'Salem', 'Bend / Redmond', 'Oregon Coast', 'Newberg', 'Wilsonville', 'Canby', 'Milwaukie', 'West Linn', 'Oregon City'].map((area) => (
              <div key={area} className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
