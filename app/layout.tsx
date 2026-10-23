import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.abovebeyondrestorationllc.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  title: 'Above & Beyond Restoration | Portland, OR - Water, Fire & Mold Damage Experts',
  description:
    'Above & Beyond Restoration provides 24/7 emergency restoration services in Portland, OR. Specializing in water damage, fire damage, mold remediation, smoke damage, demolition, and more. IICRC certified. Call 503-608-2930.',
  keywords:
    'water damage restoration Portland OR, fire damage restoration, mold remediation, smoke damage, demolition, property restoration, emergency restoration services, IICRC certified, Oregon CCB 262371',
  authors: [{ name: 'Above & Beyond Restoration' }],
  openGraph: {
    title: 'Above & Beyond Restoration LLC | Portland, OR Water Damage & Mold Cleanup and Removal Services',
    description: '24/7 Emergency Restoration Services - Water Damage Dryout and Removal Services, Fire & Smoke Damage Cleanup, Mold Testing & Remediation & More',
    type: 'website',
    locale: 'en_US',
    url: 'https://www.abovebeyondrestorationllc.com',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1B2A4A',
  width: 'device-width',
  initialScale: 1,
}

const globalLocalBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'EmergencyService'],
  '@id': 'https://www.abovebeyondrestorationllc.com/#organization',
  name: 'Above & Beyond Restoration',
  legalName: 'Above & Beyond Restoration LLC',
  url: 'https://www.abovebeyondrestorationllc.com',
  telephone: '+1-503-608-2930',
  email: 'TommyBletcher@gmail.com',
  image: 'https://www.abovebeyondrestorationllc.com/logo.png',
  priceRange: '$$',
  taxID: 'CCB #262371',
  description:
    'Licensed, bonded, and IICRC-certified restoration contractor providing 24/7 emergency water extraction, fire cleanup, mold remediation, and demolition across the Portland metropolitan area.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '8580 SW Wilson Lane',
    addressLocality: 'Wilsonville',
    addressRegion: 'OR',
    postalCode: '97070',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.3562,
    longitude: -122.8426,
  },
  areaServed: [
    { '@type': 'City', name: 'Portland' },
    { '@type': 'City', name: 'Beaverton' },
    { '@type': 'City', name: 'Tigard' },
    { '@type': 'City', name: 'Wilsonville' },
    { '@type': 'City', name: 'Tualatin' },
    { '@type': 'City', name: 'Clackamas' },
    { '@type': 'City', name: 'Hillsboro' },
    { '@type': 'City', name: 'Lake Oswego' },
    { '@type': 'City', name: 'Sherwood' },
    { '@type': 'City', name: 'Gresham' },
    { '@type': 'City', name: 'Oregon City' },
    { '@type': 'City', name: 'West Linn' },
    { '@type': 'City', name: 'Salem' },
    { '@type': 'City', name: 'Vancouver' }
  ],
  regionsServed: [
    { '@type': 'State', name: 'Oregon' },
    { '@type': 'State', name: 'Washington' }
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-US" className={`${inter.variable} ${montserrat.variable} bg-background`}>
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalLocalBusinessSchema) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
