import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata = {
  title: 'Residential Property Restoration | Above & Beyond Restoration Portland, OR',
  description: 'Full-service residential property restoration in Portland, OR. Water, fire, mold, and more. IICRC certified. Call 503-608-2930.',
}

export default function ResidentialPage() {
  return (
    <ServicePageTemplate
      title="Residential Property Restoration"
      subtitle="Complete home restoration services from emergency mitigation through final repair. We treat your home with the care it deserves — and get you back to normal fast."
      heroImage="/images/hero-restoration.png"
      description={[
        'Your home is your most important asset. When disaster strikes — whether it\'s a burst pipe, sewage backup, kitchen fire, or sudden mold discovery — you need a restoration company you can trust to respond quickly, communicate clearly, and deliver exceptional results.',
        'Above & Beyond Restoration serves homeowners throughout Portland and the surrounding communities. From the initial emergency call to the final walk-through, our IICRC-certified technicians handle every phase of residential restoration with professionalism and care.',
        'We handle all insurance paperwork directly with your carrier and offer direct billing, so you can focus on your family while we take care of the property. We provide written estimates, daily status updates, and a 1-year warranty on all our work.',
      ]}
      benefits={[
        'Full-service mitigation to restoration',
        'Direct insurance billing and claims support',
        'IICRC certified technicians',
        '90-minute emergency response time',
        '24/7 availability 365 days per year',
        'Licensed, bonded, and insured',
        '1-year warranty on all work',
        'Daily progress communication',
      ]}
      process={[
        { title: 'Emergency Call', description: 'Call us anytime — day or night. We pick up every call and dispatch a crew within 90 minutes.' },
        { title: 'On-Site Assessment', description: 'Our project manager walks the entire property, identifies all damage, and provides a full written estimate.' },
        { title: 'Insurance Coordination', description: 'We contact your adjuster directly, provide documentation, and work to maximize your claim.' },
        { title: 'Mitigation & Remediation', description: 'We stop the damage from spreading, extract water or smoke, and remediate mold or hazardous materials.' },
        { title: 'Demolition & Drying', description: 'Damaged materials are removed and structural drying is performed until moisture readings are within safe ranges.' },
        { title: 'Restoration & Repair', description: 'We rebuild what was damaged, matching finishes and materials as closely as possible to the original.' },
      ]}
      faqs={[
        { q: 'Should I call my insurance or you first?', a: 'Call us first. We can help you understand the damage scope before you file, and our documentation often results in a stronger insurance claim.' },
        { q: 'Do you handle the entire job or just the mitigation?', a: 'We handle the complete project from emergency response through final repairs — you don\'t need to hire a separate rebuild contractor for most jobs.' },
        { q: 'How long will my family need to stay elsewhere?', a: 'This depends on severity. Most mitigation work is done within 3–5 days. Full restoration including repairs can take 1–4 weeks. We will give you a realistic timeline upfront.' },
        { q: 'What areas of Portland do you serve?', a: 'We serve the entire Portland Metro including Beaverton, Hillsboro, Lake Oswego, Tigard, Tualatin, Sherwood, Wilsonville, West Linn, and surrounding communities.' },
      ]}
      relatedServices={[
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
        { name: 'Mold Remediation', href: '/services/mold-remediation' },
        { name: 'Commercial Restoration', href: '/services/commercial' },
      ]}
    />
  )
}
