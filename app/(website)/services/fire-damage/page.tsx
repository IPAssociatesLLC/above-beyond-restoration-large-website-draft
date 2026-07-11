import type { Metadata } from 'next'
import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata: Metadata = {
  title: 'Fire Damage Restoration Portland OR | Above & Beyond',
  description: 'Professional fire damage restoration in Portland OR. Emergency stabilization, soot removal, smoke odor elimination, and reconstruction. IICRC certified. Call 503-608-2930.',
}

export default function FireDamagePage() {
  return (
    <ServicePageTemplate
      title="Fire Damage Restoration"
      subtitle="From emergency stabilization to complete reconstruction — our IICRC certified team handles every phase of fire damage recovery for residential and commercial properties."
      heroImage="/images/fire-damage.png"
      description={[
        "Experiencing a fire in your home or business is one of the most traumatic events imaginable. Above & Beyond Restoration is here to take the burden off your shoulders and guide you through every step of the recovery process.",
        "We have the experience, manpower, and equipment necessary to perform emergency services quickly and effectively, reducing the damage to the contents and structure of your property. Residue soot and smoke removal is considered part of emergency services because soot is extremely acidic and more difficult to remove the longer it remains in your property.",
        "Our team works directly with your insurance company to document all losses, create detailed Xactimate estimates, and ensure you receive the maximum reimbursement for your fire damage claim."
      ]}
      benefits={[
        'Minimize Existing Damage',
        'Stabilize & Secure the Structure',
        'Emergency Water Damage Mitigation',
        'Remove Soot & Contain Odor',
        'Pack Out Salvageable Contents',
        'Clean, Deodorize & Restore Structure',
        'Structural Repairs & Reconstruction',
        'Insurance Documentation & Billing',
        'Board-Up & Tarping Services',
        'Content Cleaning & Restoration',
        'Smoke & Odor Elimination',
        '90-Minute Emergency Response',
      ]}
      process={[
        { title: 'Emergency Response & Securing', description: 'We immediately stabilize and secure the structure, board up openings, and prevent further damage from weather or unauthorized access.' },
        { title: 'Damage Assessment', description: 'Our technicians thoroughly document all fire, smoke, and water damage with photos and detailed reports for your insurance claim.' },
        { title: 'Water Mitigation', description: 'Firefighting efforts often leave significant water damage. We address water damage simultaneously to prevent additional mold issues.' },
        { title: 'Soot & Smoke Removal', description: 'Using professional equipment and cleaning agents, we remove all soot residue from surfaces. Early removal is critical as soot is highly acidic.' },
        { title: 'Odor Elimination', description: 'We use advanced deodorization techniques including thermal fogging and ozone treatment to completely eliminate smoke odor.' },
        { title: 'Reconstruction', description: 'We restore your property to pre-loss condition with structural repairs, drywall replacement, painting, flooring, and finish work.' },
      ]}
      faqs={[
        { q: 'Should I try to clean fire damage myself?', a: 'No. Soot is extremely acidic and caustic. Improper handling can permanently damage surfaces and cause health hazards. Professional restoration is essential for safe, effective results.' },
        { q: 'How soon can we return to our home after a fire?', a: 'This depends on severity. Our team will advise you on when it is safe to re-enter. We work as quickly as possible to return your home to a safe, livable condition.' },
        { q: 'Do you handle insurance claims for fire damage?', a: 'Absolutely. We are Xactimate certified and work directly with all major insurance carriers. We document everything and fight to ensure you receive maximum reimbursement.' },
        { q: 'Can smoke-damaged items be saved?', a: 'Many items can be restored with professional cleaning. Our team carefully assesses all contents and salvages everything possible through specialized cleaning techniques.' },
      ]}
      relatedServices={[
        { name: 'Smoke Damage Cleanup', href: '/services/smoke-damage' },
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Demolition Services', href: '/services/demolition' },
        { name: 'Residential Restoration', href: '/services/residential' },
      ]}
    />
  )
}
