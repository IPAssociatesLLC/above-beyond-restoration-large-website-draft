import { HeroSection } from '@/components/website/home/hero-section'
import { TrustBar } from '@/components/website/home/trust-bar'
import { ServicesOverview } from '@/components/website/home/services-overview'
import { EmergencyBanner } from '@/components/website/home/emergency-banner'
import { WhyChooseUs } from '@/components/website/home/why-choose-us'
import { TestimonialsSection } from '@/components/website/home/testimonials'
import { ServiceAreasSection } from '@/components/website/home/service-areas'
import { CTASection } from '@/components/website/home/cta-section'
import { FaqAccordion } from '@/components/website/faq-accordion'

const homeFaqs = [
  {
    q: 'How quickly can Above & Beyond respond to an emergency in Portland?',
    a: 'We provide guaranteed 24/7/365 emergency dispatch across the entire Portland metropolitan area, arriving on-site equipped for extraction and mitigation within 90 minutes or less.',
  },
  {
    q: 'Do you bill insurance companies directly for restoration work?',
    a: 'Yes. We work directly with all major homeowners and commercial property insurance carriers (State Farm, Allstate, Travelers, Farmers, Liberty Mutual, USAA, etc.). We scope and document all damage using standard Xactimate pricing and submit bills directly to your adjuster.',
  },
  {
    q: 'Are your technicians licensed and certified in Oregon?',
    a: 'Yes. Above & Beyond Restoration is fully licensed, bonded, and insured under Oregon CCB #262371. Our technicians hold active IICRC certifications in Water Damage Restoration (WRT), Applied Structural Drying (ASD), and Mold Remediation (AMRT).',
  },
  {
    q: 'What is your 5-Day Maximum Dry-Out Guarantee?',
    a: 'For Category 1 clean water losses, we guarantee that our drying equipment rental charges are capped at a maximum of 5 days. Our industrial LGR dehumidifiers and high-velocity air movers restore structural moisture to dry standards rapidly and efficiently.',
  },
  {
    q: 'What service areas do you cover in Oregon?',
    a: 'We cover all of Multnomah, Washington, Clackamas, and Marion counties, including Portland, Beaverton, Gresham, Hillsboro, Tigard, Lake Oswego, Sherwood, Tualatin, West Linn, Oregon City, and Salem.',
  },
]

// Above & Beyond Restoration — Homepage
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesOverview />
      <EmergencyBanner />
      <WhyChooseUs />
      <TestimonialsSection />
      <FaqAccordion
        title="Portland Restoration FAQs"
        subtitle="Frequently asked questions about emergency dispatch, insurance billing, and mitigation procedures in Portland, OR."
        faqs={homeFaqs}
      />
      <ServiceAreasSection />
      <CTASection />
    </>
  )
}
