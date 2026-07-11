import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata = {
  title: 'Smoke Damage Restoration | Above & Beyond Restoration Portland, OR',
  description: 'Professional smoke and soot damage cleanup in Portland, OR. IICRC certified technicians. Call 503-608-2930 for 24/7 emergency service.',
}

export default function SmokeDamagePage() {
  return (
    <ServicePageTemplate
      title="Smoke Damage Restoration"
      subtitle="Thorough smoke and soot removal to restore your property to pre-loss condition. We eliminate odors at the source using advanced techniques."
      heroImage="/images/smoke-damage.png"
      description={[
        'Smoke and soot damage can be far more extensive than it first appears. Even in areas where fire did not directly burn, smoke residue travels through HVAC systems and settles into walls, ceilings, and personal belongings. If not addressed quickly, soot becomes increasingly difficult to remove and odors can permanently embed into porous materials.',
        'At Above & Beyond Restoration, our IICRC-certified smoke damage technicians respond rapidly to assess and document all damage for your insurance claim. We use industrial HEPA air scrubbers, specialized dry and wet cleaning sponges, and thermal fogging technology to neutralize odors and eliminate soot residue from every surface.',
        'We work directly with your insurance company and handle all documentation, ensuring a smooth claims process. Our goal is to restore your home or business completely — not just clean the surfaces you can see.',
      ]}
      benefits={[
        'Complete soot removal from all surfaces',
        'Odor elimination via thermal fogging',
        'HVAC duct cleaning and deodorization',
        'Content pack-out and restoration',
        'Insurance documentation and billing',
        'Structural assessment and drying',
        'Air quality testing post-restoration',
        'Carpet and upholstery cleaning',
      ]}
      process={[
        { title: 'Emergency Response', description: 'We arrive within 90 minutes of your call, 24/7, to prevent smoke damage from worsening.' },
        { title: 'Damage Assessment', description: 'Full inspection and photo documentation of all smoke and soot affected areas for insurance purposes.' },
        { title: 'Content Protection', description: 'Salvageable belongings are carefully packed out and transported to our cleaning facility.' },
        { title: 'Smoke Removal', description: 'All surfaces are treated with appropriate cleaning agents. HEPA air scrubbers run continuously.' },
        { title: 'Odor Elimination', description: 'Thermal fogging and hydroxyl generation neutralize odor molecules embedded in materials.' },
        { title: 'Final Inspection', description: 'Air quality testing confirms all smoke and odor has been removed before we clear the job.' },
      ]}
      faqs={[
        { q: 'How long does smoke damage restoration take?', a: 'Most residential smoke damage jobs are completed in 3–7 days depending on severity. Extensive smoke damage with content pack-out may take longer.' },
        { q: 'Will smoke odors come back after restoration?', a: 'When treated properly using thermal fogging and hydroxyl generators, odors are neutralized at the molecular level and will not return.' },
        { q: 'Does my insurance cover smoke damage from a neighboring property?', a: 'In most cases, yes. Smoke damage from an external fire source is typically covered under standard homeowners policies. We assist with all claims documentation.' },
        { q: 'Can you restore smoke-damaged furniture and belongings?', a: 'Yes. We offer full content pack-out and restoration services, cleaning and deodorizing furnishings, clothing, electronics, and more at our facility.' },
      ]}
      relatedServices={[
        { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Demolition Services', href: '/services/demolition' },
        { name: 'Mold Remediation', href: '/services/mold-remediation' },
      ]}
    />
  )
}
