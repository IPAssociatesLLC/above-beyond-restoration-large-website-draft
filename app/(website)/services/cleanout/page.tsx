import { ServicePageTemplate } from '@/components/website/service-page-template'

export const metadata = {
  title: 'Clean Out & Junk Removal | Above & Beyond Restoration Portland, OR',
  description: 'Large-scale cleanout, junk removal, and job site cleanup in Portland, OR. Residential and commercial. Call 503-608-2930.',
}

export default function CleanoutPage() {
  return (
    <ServicePageTemplate
      title="Clean Out & Junk Removal"
      subtitle="Large-scale residential and commercial cleanout, estate clearing, and job site removal services throughout the Portland Metro area."
      heroImage="/images/demolition.png"
      description={[
        'From post-restoration job site cleanup to full estate cleanouts, Above & Beyond Restoration handles volume debris removal that other companies won\'t. Our large trucks and experienced crews can clear an entire property in a single day, saving you time and the hassle of coordinating multiple vendors.',
        'We serve homeowners, real estate agents, property managers, and contractors throughout the Portland Metro area. Whether you\'re clearing a hoarded home, emptying a rental after a difficult tenant, removing construction debris, or cleaning up after a disaster, we provide fast, thorough service.',
        'All items are sorted on-site. Recyclables go to recycling facilities, donations go to local charities, and trash is disposed of responsibly at licensed Oregon facilities. We provide written receipts of disposal for your records.',
      ]}
      benefits={[
        'Full property cleanouts',
        'Estate and hoarding cleanouts',
        'Construction debris removal',
        'Post-restoration job site cleanup',
        'Appliance and furniture removal',
        'Yard and garage cleanout',
        'Same-day and next-day service',
        'Recycling and donation sorting',
      ]}
      process={[
        { title: 'Free Walk-Through', description: 'We walk the property, assess the volume, and provide an upfront flat-rate quote with no hidden fees.' },
        { title: 'Schedule', description: 'We work around your schedule, including same-day and weekend appointments.' },
        { title: 'Sort & Haul', description: 'Our crew sorts recyclables, donation items, and trash before hauling everything away.' },
        { title: 'Final Sweep', description: 'We broom-sweep and leave the property clean, ready for its next use.' },
        { title: 'Disposal Receipts', description: 'You receive documentation of all materials hauled for your records.' },
      ]}
      faqs={[
        { q: 'How much does a full cleanout cost?', a: 'Pricing is based on volume and type of materials. We provide free on-site estimates. Most residential cleanouts range from $400–$1,500.' },
        { q: 'Can you remove hazardous materials?', a: 'We handle most common junk and debris. Hazardous materials such as chemicals, paint, and batteries require special handling — we coordinate with licensed disposal companies for these items.' },
        { q: 'Do you donate usable items?', a: 'Yes. We sort all items and take usable furniture, clothing, and household goods to local Portland area charities before disposing of trash.' },
        { q: 'How quickly can you start?', a: 'In most cases we can begin within 24–48 hours. We also offer same-day service for urgent situations.' },
      ]}
      relatedServices={[
        { name: 'Demolition Services', href: '/services/demolition' },
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Commercial Restoration', href: '/services/commercial' },
        { name: 'Residential Restoration', href: '/services/residential' },
      ]}
    />
  )
}
