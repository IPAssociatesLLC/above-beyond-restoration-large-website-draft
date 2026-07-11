import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata = {
  title: 'Demolition Services | Above & Beyond Restoration Portland, OR',
  description: 'Professional selective demolition and structural tear-out services in Portland, OR. Licensed and insured. Call 503-608-2930.',
}

export default function DemolitionPage() {
  return (
    <ServicePageTemplate
      title="Demolition Services"
      subtitle="Controlled, professional demolition and debris removal for restoration projects. We safely remove damaged materials to prepare your property for rebuilding."
      heroImage="/images/demolition.png"
      description={[
        'Effective restoration requires thorough removal of damaged structural materials. Our demolition team performs precise, controlled selective demolition — targeting only what needs to go while preserving what can be saved. Whether it\'s water-soaked drywall, fire-damaged framing, or mold-compromised subfloor, we extract it safely and efficiently.',
        'Above & Beyond Restoration holds all required Oregon CCB licenses for demolition and structural work. Our crews are trained in safe material handling including lead paint and asbestos awareness, and we coordinate with licensed abatement professionals when hazardous materials are identified.',
        'All debris is responsibly hauled away and disposed of per local Portland Metro regulations. We document every phase with photos for your insurance carrier, ensuring the claim process reflects the full scope of the work performed.',
      ]}
      benefits={[
        'Selective interior demolition',
        'Fire and water damaged material removal',
        'Drywall, flooring, and ceiling tear-out',
        'Structural framing assessment',
        'Hazardous material awareness protocols',
        'Full debris hauling and disposal',
        'Photo documentation for insurance',
        'Coordination with rebuild contractors',
      ]}
      process={[
        { title: 'Scope Assessment', description: 'We identify all damaged materials requiring removal and establish clear boundaries for selective demolition.' },
        { title: 'Safety Setup', description: 'The work area is protected with containment barriers. Utilities are verified safe before work begins.' },
        { title: 'Selective Removal', description: 'Damaged drywall, flooring, insulation, and structural elements are carefully removed and bagged.' },
        { title: 'Debris Hauling', description: 'All debris is loaded into our trucks and hauled to licensed disposal facilities.' },
        { title: 'Area Prep', description: 'Exposed cavities are dried, cleaned, and prepared for rebuild or remediation crews.' },
        { title: 'Final Documentation', description: 'Complete photo documentation is provided for your insurance adjuster and rebuild contractor.' },
      ]}
      faqs={[
        { q: 'Do you handle asbestos or lead paint removal?', a: 'We screen for hazardous materials before starting demolition. If asbestos or lead paint is identified, we coordinate with licensed abatement contractors before proceeding.' },
        { q: 'Can you demolish just part of a room?', a: 'Yes. Our specialty is selective demolition — removing only the damaged sections to minimize rebuild costs and disruption.' },
        { q: 'Do I need a permit for interior demolition in Portland?', a: 'Most selective interior demolition for restoration purposes does not require a permit in Portland. We advise on a case-by-case basis and pull permits when required.' },
        { q: 'Can you coordinate with my insurance adjuster?', a: 'Absolutely. We provide full written scope of work, photo documentation, and can be present during adjuster walkthroughs.' },
      ]}
      relatedServices={[
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
        { name: 'Clean Out & Junk Removal', href: '/services/cleanout' },
        { name: 'Mold Remediation', href: '/services/mold-remediation' },
      ]}
    />
  )
}
