import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service & Warranty Conditions | Above & Beyond Restoration',
  description:
    'Review terms of service, emergency dispatch policies, and 1-year workmanship warranty coverage for Above & Beyond Restoration (CCB #262371).',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service & Warranty Conditions | Above & Beyond Restoration',
    description: 'Contractor terms, warranty information, and service policies for Above & Beyond Restoration LLC.',
    type: 'website',
    url: 'https://www.abovebeyondrestorationllc.com/terms',
  },
}

const termsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.abovebeyondrestorationllc.com/terms#webpage',
  url: 'https://www.abovebeyondrestorationllc.com/terms',
  name: 'Terms of Service',
  description: 'Terms of service and warranty terms for Above & Beyond Restoration LLC.',
  publisher: {
    '@type': 'EmergencyService',
    name: 'Above & Beyond Restoration',
    url: 'https://www.abovebeyondrestorationllc.com',
  },
}

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />
      {/* Header */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto px-4">
          <h1
            className="text-4xl font-black text-white mb-3"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Terms of Service
          </h1>
          <p className="text-white/70">Last updated: 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using the Above & Beyond Restoration website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">2. Services</h2>
              <p className="text-gray-600 leading-relaxed">
                Above & Beyond Restoration provides property damage restoration services including water damage mitigation, fire damage restoration, mold remediation, smoke damage cleanup, demolition, and related services. All services are subject to a written work authorization agreement signed prior to work commencing.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">3. Estimates and Pricing</h2>
              <p className="text-gray-600 leading-relaxed">
                Written estimates are provided prior to commencement of work. Final costs may vary from estimates if unforeseen damage or conditions are discovered during the restoration process. Any changes to scope will be communicated and documented via written change order before additional work is performed.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">4. Insurance Claims</h2>
              <p className="text-gray-600 leading-relaxed">
                We assist clients with insurance documentation and may bill insurance carriers directly with client authorization. The client remains ultimately responsible for all charges if the insurance carrier denies a claim or disputes the scope.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">5. Warranty & Workmanship</h2>
              <p className="text-gray-600 leading-relaxed">
                Above & Beyond Restoration provides a 1-year full workmanship warranty on all structural repairs and reconstruction performed by our licensed crew. This warranty does not cover secondary damage caused by new independent loss events, failure of property owner to maintain plumbing/roofing systems, or pre-existing structural defects.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">6. Payment Processing & Direct Billing</h2>
              <p className="text-gray-600 leading-relaxed">
                We accept insurance direct payments, certified checks, ACH wire transfers, and major credit cards. In direct insurance billing arrangements, property owners authorize their insurance carrier to remit payment directly to Above & Beyond Restoration LLC for the approved scope of loss.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                Above & Beyond Restoration&apos;s liability is limited to the amount paid for the specific services in question. We are not liable for indirect, consequential, or incidental damages arising from pre-existing environmental hazards not identified prior to mitigation.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">8. Governing Law & Dispute Resolution</h2>
              <p className="text-gray-600 leading-relaxed">
                These terms and all contractor agreements are governed by and construed in accordance with the laws of the State of Oregon and the Oregon Construction Contractors Board (ORS Chapter 701). Any disputes arising under these terms shall be resolved in the state courts of Washington County or Multnomah County, Oregon.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">9. Company Information & Contractor License</h2>
              <p className="text-gray-600 leading-relaxed">
                Above & Beyond Restoration LLC<br />
                Mailing Address: P.O. Box 542, Sherwood, OR 97140<br />
                Phone: (503) 608-2930<br />
                Email: TommyBletcher@gmail.com<br />
                Oregon CCB License: #262371 (Licensed, Bonded, and Insured)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
