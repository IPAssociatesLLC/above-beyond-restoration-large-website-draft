import { HeroSection } from '@/components/website/home/hero-section'
import { TrustBar } from '@/components/website/home/trust-bar'
import { ServicesOverview } from '@/components/website/home/services-overview'
import { EmergencyBanner } from '@/components/website/home/emergency-banner'
import { WhyChooseUs } from '@/components/website/home/why-choose-us'
import { TestimonialsSection } from '@/components/website/home/testimonials'
import { ServiceAreasSection } from '@/components/website/home/service-areas'
import { CTASection } from '@/components/website/home/cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesOverview />
      <EmergencyBanner />
      <WhyChooseUs />
      <TestimonialsSection />
      <ServiceAreasSection />
      <CTASection />
    </>
  )
}
