import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata = {
  title: 'Commercial Property Restoration | Above & Beyond Restoration Portland, OR',
  description: 'Large-scale commercial property restoration in Portland, OR. Minimize downtime and protect your assets. Call 503-608-2930.',
}

export default function CommercialPage() {
  return (
    <ServicePageTemplate
      title="Commercial Property Restoration"
      subtitle="Rapid-response commercial restoration that minimizes business interruption. We work around your schedule to restore your facility and get you operational again."
      heroImage="/images/commercial.png"
      description={[
        'Commercial water, fire, and mold damage requires a different level of response than residential work. Business owners and property managers face the added pressure of employee safety, operational downtime, tenant relations, and commercial insurance requirements — all while dealing with an active disaster.',
        'Above & Beyond Restoration is equipped to handle large-scale commercial restoration projects throughout Portland Metro. Our crews are scaled to the project, with the equipment and personnel to work efficiently on office buildings, retail centers, restaurants, warehouses, multi-family properties, and more.',
        'We understand that every hour of downtime costs you money. Our commercial team works in phases when possible to keep portions of your facility operational, and we offer off-hours and weekend work to minimize disruption. We coordinate directly with your commercial insurance carrier and provide detailed scope documentation.',
      ]}
      benefits={[
        'Large-scale commercial capability',
        'Multi-crew projects scaled to need',
        'After-hours and weekend scheduling',
        'Commercial insurance direct billing',
        'Phased work to maintain operations',
        'Complete documentation and reporting',
        'OSHA-compliant job site practices',
        'Multi-family and tenant coordination',
      ]}
      process={[
        { title: 'Rapid Assessment', description: 'We respond immediately, assess the scope across your entire commercial property, and establish a mitigation plan.' },
        { title: 'Stakeholder Communication', description: 'We brief ownership, management, and your insurance carrier with a clear written scope of work and timeline.' },
        { title: 'Phased Mitigation', description: 'Where possible, we phase work to keep parts of the business operational while restoration proceeds.' },
        { title: 'Full Remediation', description: 'Water extraction, drying, mold remediation, smoke cleanup — all performed with commercial-grade equipment.' },
        { title: 'Structural Repairs', description: 'Our teams rebuild affected areas to commercial code, matching existing finishes and materials.' },
        { title: 'Clearance & Certificate', description: 'Final inspections, air quality certifications, and full documentation provided for your carrier.' },
      ]}
      faqs={[
        { q: 'Can you work nights and weekends to avoid business disruption?', a: 'Yes. We regularly schedule commercial work during off-hours to minimize disruption to your operations, tenants, and customers.' },
        { q: 'Do you have the capacity for large commercial projects?', a: 'We scale crews and equipment to the project. We have managed large-scale commercial losses across office buildings, warehouses, and multi-family properties throughout Portland Metro.' },
        { q: 'How do you handle tenant communication in multi-family properties?', a: 'We work with your property manager to communicate clearly with affected tenants, manage access coordination, and minimize inconvenience throughout the restoration process.' },
        { q: 'Do you provide compliance documentation for our records?', a: 'Yes. We provide complete IICRC-compliant project documentation including moisture logs, air quality reports, and photo records for your property files and insurance carrier.' },
      ]}
      relatedServices={[
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
        { name: 'Mold Remediation', href: '/services/mold-remediation' },
        { name: 'Demolition Services', href: '/services/demolition' },
      ]}
    />
  )
}
