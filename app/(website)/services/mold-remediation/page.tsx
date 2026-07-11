import type { Metadata } from 'next'
import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata: Metadata = {
  title: 'Mold Remediation Portland OR | Above & Beyond Restoration',
  description: 'IICRC certified mold remediation in Portland OR. Professional mold testing, containment, removal and prevention. Safe, effective, guaranteed. Call 503-608-2930.',
}

export default function MoldRemediationPage() {
  return (
    <ServicePageTemplate
      title="Mold Remediation"
      subtitle="IICRC certified mold remediation using state-of-the-art containment and removal techniques. We eliminate toxic mold and protect your family's health."
      heroImage="/images/mold-remediation.png"
      description={[
        "Above & Beyond Restoration is a mold remediation contractor with fully trained technicians who are proficient with the latest equipment, materials and techniques for eliminating toxic mold.",
        "Mold can cause serious health problems and rapidly destroy structural components of your home. Our IICRC certified technicians use professional containment procedures, negative air pressure systems, and HEPA filtration to safely remove mold without cross-contamination.",
        "After remediation, we address the moisture source that caused the mold growth in the first place — without fixing this root cause, mold will return. We provide a complete solution that includes moisture control, affected material removal, antimicrobial treatment, and clearance testing."
      ]}
      benefits={[
        'Water Source Elimination',
        'Dehumidification',
        'Engineering Controls & Containment',
        'Removal of Non-Salvageable Content',
        'Decontamination with Antimicrobials',
        'Affected Area Deodorization',
        'HEPA Air Filtration',
        'Post-Remediation Testing',
        'Full Containment Barriers',
        'Safe Disposal of Mold Materials',
        'Mold Prevention Treatments',
        'Insurance Documentation',
      ]}
      process={[
        { title: 'Inspection & Testing', description: 'We conduct a thorough visual inspection and moisture assessment to identify all mold-affected areas and determine the extent of contamination.' },
        { title: 'Containment Setup', description: 'Physical containment barriers and negative air pressure are established to prevent mold spores from spreading to unaffected areas during remediation.' },
        { title: 'Air Filtration', description: 'HEPA air scrubbers are installed to capture airborne mold spores and maintain air quality throughout the remediation process.' },
        { title: 'Mold Removal', description: 'Non-salvageable materials are safely removed and disposed of. Salvageable materials are treated with EPA-approved antimicrobial agents.' },
        { title: 'Moisture Source Correction', description: 'We address the underlying moisture problem that caused the mold — whether a leak, condensation issue, or ventilation problem.' },
        { title: 'Post-Remediation Verification', description: 'A final inspection and clearance testing confirms the remediation was successful and the area is safe for occupancy.' },
      ]}
      faqs={[
        { q: 'Is mold dangerous to my health?', a: 'Yes, many mold species — particularly black mold (Stachybotrys) — produce mycotoxins that can cause serious respiratory issues, allergic reactions, and other health problems. Professional remediation is essential.' },
        { q: 'How can I tell if I have a mold problem?', a: 'Signs include visible mold growth, musty odors, recent water damage, and unexplained health symptoms. Even without visible mold, hidden growth behind walls or under flooring is common after water damage.' },
        { q: 'Can I clean mold myself?', a: 'DIY cleaning with bleach only addresses surface mold and can actually spread spores. Professional remediation is needed for anything more than 10 square feet or when structural materials are involved.' },
        { q: 'How long does mold remediation take?', a: 'Most residential projects take 1-5 days depending on extent. Larger commercial projects may take longer. We provide a clear timeline before starting work.' },
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
