import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Above & Beyond Restoration LLC',
  description:
    'Learn how Above & Beyond Restoration collects, protects, and handles your personal information when requesting restoration estimates and emergency services.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Above & Beyond Restoration LLC',
    description: 'Privacy policy and data protection disclosures for Above & Beyond Restoration.',
    type: 'website',
    url: 'https://www.abovebeyondrestorationllc.com/privacy',
  },
}

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.abovebeyondrestorationllc.com/privacy#webpage',
  url: 'https://www.abovebeyondrestorationllc.com/privacy',
  name: 'Privacy Policy',
  description: 'Privacy policy for Above & Beyond Restoration LLC.',
  publisher: {
    '@type': 'EmergencyService',
    name: 'Above & Beyond Restoration',
    url: 'https://www.abovebeyondrestorationllc.com',
  },
}

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      {/* Header */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto px-4">
          <h1
            className="text-4xl font-black text-white mb-3"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            Privacy Policy
          </h1>
          <p className="text-white/70">Last updated: 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-gray max-w-none space-y-8">
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">
                Above & Beyond Restoration (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects information you voluntarily provide when you contact us, request an estimate, or use our website. This may include your name, phone number, email address, property address, and details about your restoration needs.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We use the information you provide to respond to your inquiries, schedule services, provide estimates, process payments, and communicate with your insurance company as directed by you. We do not sell, trade, or rent your personal information to third parties.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">3. Cookies and Website Analytics</h2>
              <p className="text-gray-600 leading-relaxed">
                Our website may use cookies and similar tracking technologies to improve your browsing experience and analyze site traffic. You may disable cookies in your browser settings, though some site features may be affected.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information. However, no transmission over the internet is 100% secure and we cannot guarantee absolute security.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">5. Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed">
                We may use third-party service providers for payment processing, scheduling, and communication. These providers have their own privacy policies and we encourage you to review them.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">6. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                You may request access to, correction of, or deletion of the personal information we hold about you by contacting us at the information below.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-3">7. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                For privacy-related questions or requests, contact Above & Beyond Restoration at:<br />
                P.O. Box 542, Sherwood, OR 97140<br />
                Phone: 503-608-2930<br />
                Oregon CCB #262371
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
