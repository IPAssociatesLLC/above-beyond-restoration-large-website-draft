import type { Metadata } from 'next'
import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata: Metadata = {
  title: 'Mold Remediation & Removal Portland OR | IICRC S520 Certified',
  description:
    'IICRC S520 certified mold remediation in Portland, OR. Negative air containment, porous material removal, HEPA filtration & Kilz barrier sealing. Call 503-608-2930.',
  alternates: {
    canonical: '/services/mold-remediation',
  },
  openGraph: {
    title: 'Mold Remediation & Removal Portland OR | IICRC S520 Certified',
    description:
      'Professional mold remediation, containment barriers, physical removal, and botanical antimicrobial treatment in Portland, OR. Call 503-608-2930.',
    type: 'website',
    url: 'https://www.abovebeyondrestorationllc.com/services/mold-remediation',
  },
}

export default function MoldRemediationPage() {
  return (
    <ServicePageTemplate
      title="Mold Remediation"
      subtitle="IICRC S520 certified mold remediation using state-of-the-art containment, physical porous material removal, and antimicrobial barrier sealing."
      heroImage="/images/mold-remediation.png"
      slug="mold-remediation"
      description={[
        "Above & Beyond Restoration is a specialized mold remediation contractor with fully trained technicians certified under IICRC S520 standards. We employ advanced containment barriers, negative air pressure machines, and EPA-registered botanical antimicrobials to permanently eliminate fungal colonies.",
        "Mold requires physical removal from contaminated porous building materials — simply spraying bleach or surface biocides leaves underlying root structures intact. Our technicians establish airtight plastic containment zones with HEPA air scrubbers, carefully cut out compromised drywall, insulation, and carpet, wire-brush wood framing, and apply antimicrobial encapsulant barrier coatings (such as Kilz) to seal surfaces against future spore colonization.",
        "After remediation, we locate and eliminate the underlying moisture intrusion source — whether a roof leak, plumbing failure, high crawlspace humidity, or basement seepage. We perform comprehensive post-remediation moisture and clearance verification to ensure your indoor air quality is 100% restored."
      ]}
      benefits={[
        'IICRC S520 Certified Containment Protocols',
        'Physical Removal of Contaminated Porous Materials',
        'HEPA Negative Air Scrubber Filtration',
        'Wood Framing Wire-Brushing & HEPA Vacuuming',
        'EPA-Registered Botanical Antimicrobial Treatment',
        'Kilz & Antimicrobial Barrier Coating Sealing',
        'Underlying Moisture Source Correction',
        'Thermal Moisture & Humidity Mapping',
        'Direct Insurance Billing via Xactimate',
        'Licensed, Bonded & Insured Oregon CCB #262371',
        '100% Satisfaction & Clearance Verification',
        '90-Minute Emergency Inspection Dispatch',
      ]}
      process={[
        { title: 'Inspection & Moisture Source Mapping', description: 'We conduct a thorough visual and thermal moisture assessment to map all hidden mold pockets behind drywall, under floors, and inside crawlspaces.' },
        { title: 'Airtight Containment & Negative Air Setup', description: 'Physical plastic zip-wall barriers and HEPA air filtration units are established under negative pressure to guarantee spores do not cross-contaminate clean living spaces.' },
        { title: 'Controlled Porous Material Removal', description: 'Unsalvageable mold-saturated drywall, insulation, and trim are bagged inside containment and safely removed from the property.' },
        { title: 'Framing Wire-Brushing & HEPA Vacuuming', description: 'Exposed structural framing studs and joists are wire-brushed and HEPA-vacuumed to strip embedded fungal hyphae from the wood grain.' },
        { title: 'Botanical Sanitization & Kilz Barrier Coating', description: 'Surfaces are treated with EPA-registered botanical antimicrobials and sealed with professional mold-resistant encapsulant barrier coatings (Kilz).' },
        { title: 'Clearance Testing & Reconstruction Handoff', description: 'Final moisture testing and visual clearance confirm safe occupancy before our reconstruction team restores drywall and finishes.' },
      ]}
      faqs={[
        { q: 'Why is physical removal necessary instead of just spraying mold with bleach?', a: 'Bleach only whitens surface mold and adds water, feeding deep hyphae roots inside porous materials like drywall. IICRC S520 standards require physical removal of contaminated porous materials and abrasive cleaning of structural wood framing.' },
        { q: 'How do you prevent mold spores from spreading through the house during remediation?', a: 'We build airtight plastic containment barriers and run industrial HEPA air scrubbers under negative pressure, venting air outside so microscopic spores cannot escape into unaffected rooms.' },
        { q: 'What is your procedure for framing that cannot be removed?', a: 'Load-bearing wood framing is HEPA vacuumed, wire-brushed or sanded to bare wood, treated with hospital-grade botanical antimicrobials, and sealed with an antimicrobial encapsulant coating (such as Kilz).' },
        { q: 'Will my homeowners insurance cover mold remediation in Oregon?', a: 'Most insurance policies cover mold remediation if it resulted from a covered sudden and accidental water peril (such as a burst pipe or water heater failure). We bill insurance carriers directly with itemized Xactimate documentation.' },
      ]}
      relatedServices={[
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Demolition Services', href: '/services/demolition' },
        { name: 'Residential Restoration', href: '/services/residential' },
        { name: 'Commercial Restoration', href: '/services/commercial' },
      ]}
    />
  )
}
