export const metadata = {
  title: 'Terms of Service | Above & Beyond Restoration',
  description: 'Terms of service for Above & Beyond Restoration.',
}

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto px-4">
          <h1
            className="text-4xl font-black text-white mb-3"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Terms of Service
          </h1>
          <p className="text-white/70">Last updated: January 1, 2025</p>
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
              <h2 className="text-xl font-bold text-brand-navy mb-3">5. Warranty</h2>
              <p className="text-gray-600 leading-relaxed">
                Above & Beyond Restoration provides a 1-year warranty on workmanship performed by our crews. This warranty does not cover damage caused by new events, pre-existing conditions outside the scope of work, or client-caused damage.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">6. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                Above & Beyond Restoration&apos;s liability is limited to the amount paid for the specific services in question. We are not liable for indirect, consequential, or incidental damages arising from our services.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">7. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These terms are governed by the laws of the State of Oregon. Any disputes will be resolved in the courts of Washington County, Oregon.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">8. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Above & Beyond Restoration | P.O. Box 542, Sherwood, OR 97140 | 503-608-2930 | CCB #193269
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
