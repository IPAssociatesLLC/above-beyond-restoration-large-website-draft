import type { Metadata } from 'next'
import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata: Metadata = {
  title: 'Water Damage Restoration Portland OR | Above & Beyond',
  description: 'Emergency water damage restoration in Portland OR. 90-minute response, IICRC certified, water extraction, structural drying, direct insurance billing. Call 503-608-2930.',
}

export default function WaterDamagePage() {
  return (
    <ServicePageTemplate
      title="Water Damage Restoration"
      subtitle="24/7 emergency water extraction and structural drying. We limit damage and costs with rapid, professional response across Portland, Salem, and surrounding areas."
      heroImage="/images/water-damage.png"
      description={[
        "Above and Beyond Restoration has the expertise to help people who are in need of emergency water extraction or water removal services due to a natural disaster, like flooding from heavy rains, or one of those everyday problems, like busted water pipes.",
        "Water damage can be deceptive — what seems like a minor leak can quickly lead to structural damage and toxic mold growth if not addressed properly and promptly. Our IICRC certified technicians use professional-grade moisture meters, thermal imaging, and industrial drying equipment to ensure complete restoration.",
        "We handle every aspect of the water damage restoration process, from emergency water extraction and content protection to complete structural drying and reconstruction. We work directly with your insurance company to document losses and maximize your claim reimbursement."
      ]}
      benefits={[
        '5-Day Dry Out Charge MAX for Clean Water',
        'Water Extraction & Pumping',
        'Document Drying & Reprocessing',
        'Desiccant Dehumidification',
        'Complete Structural Drying',
        'Flood Damage Remediation',
        'Thermal Imaging Moisture Detection',
        'Mold Prevention Treatment',
        'Content Pack-Out & Protection',
        'Direct Insurance Billing',
        'Free Estimates',
        '90-Minute Emergency Response',
      ]}
      process={[
        { title: 'Emergency Contact & Dispatch', description: 'Call 503-608-2930 and our team gathers key information before dispatching certified technicians to your property within 90 minutes.' },
        { title: 'Inspection & Damage Assessment', description: 'We perform a thorough inspection using moisture meters and thermal cameras to identify all affected areas, including hidden moisture behind walls and under flooring.' },
        { title: 'Water Removal / Extraction', description: 'Using high-powered extraction equipment, we remove standing water quickly to minimize structural damage and reduce drying time.' },
        { title: 'Drying & Dehumidification', description: 'We place industrial air movers and dehumidifiers in strategic positions to completely dry all affected structures. Our 5-day maximum dry-out policy limits charges on clean water jobs.' },
        { title: 'Cleaning & Sanitizing', description: 'All affected areas are cleaned, sanitized, and treated with antimicrobial agents to prevent mold growth and eliminate odors.' },
        { title: 'Restoration & Reconstruction', description: 'Final restoration of any damaged structures, drywall, flooring, and finishes to return your property to pre-loss condition.' },
      ]}
      faqs={[
        { q: 'How quickly should I call after water damage?', a: 'Immediately. Within the first 24-48 hours, water causes the most damage. Mold can begin growing within 24-48 hours. Calling immediately reduces damage severity and restoration costs.' },
        { q: 'Do you work with my insurance company?', a: 'Yes. We bill insurance companies directly, help document all losses with detailed Xactimate estimates, and work to ensure you receive maximum reimbursement. We have excellent relationships with all major carriers.' },
        { q: 'How long does water damage restoration take?', a: 'For clean water damage, our maximum dry-out charge is 5 days. Total restoration time depends on severity, but most residential water damage jobs are completed within 3-7 days.' },
        { q: 'What equipment do you use for drying?', a: 'We use industrial-grade air movers, desiccant dehumidifiers, and thermal imaging cameras. Our equipment is substantially more powerful than consumer-grade products, significantly reducing drying time.' },
      ]}
      relatedServices={[
        { name: 'Mold Remediation', href: '/services/mold-remediation' },
        { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
        { name: 'Demolition Services', href: '/services/demolition' },
        { name: 'Residential Restoration', href: '/services/residential' },
      ]}
    />
  )
}
