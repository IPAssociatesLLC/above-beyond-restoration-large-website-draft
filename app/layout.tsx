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
  title: 'Above & Beyond Restoration | Portland OR & Vancouver WA - Water, Fire & Mold Damage Experts',
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
  taxID: 'Oregon CCB #262371 / Washington L&I ABOVEBR742N8',
  sameAs: [
    'https://www.ccb.state.or.us/search/business_details.aspx',
    'https://secure.lni.wa.gov/verify/Detail.aspx?UBI=606263212&LIC=ABOVEBR742N8&SAW='.
    'https://maps.app.goo.gl/wBgBecdzN1aGRFB28',
    'https://www.mapquest.com/us/oregon/above-beyond-restoration-379451800',
    'https://www.facebook.com/aboveandbeyondrestoration',
    'https://www.yelp.com/biz/above-and-beyond-restoration-wilsonville',
    'https://pnwsmallbusiness.com/b/above-beyond-restoration-llc',
    'https://local.yahoo.com/info-210820649-above-beyond-restoration-wilsonville/?guccounter=1&guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&guce_referrer_sig=AQAAAHLlqjPTizbx8j3BkaTd1TugYGFJpRONXsrLAJ_QOwxQYmni7ARFLAOnIukxGIo6IM5Kzw6auqQ_6LqfMf2JGYjzlhJxzvuVkGPChxHoVdVCadavGNR8FrcZBRsAN1X-2CTkRKyy2L0T-6xC-JOBc9eQ1JZFBkApLpb_MdgHhAwB',
  ],  
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
    latitude: 45.3090,
    longitude: -122.7715,
  },
  areaServed: [
    { '@type': 'City', name: 'Portland' },
    { '@type': 'City', name: 'Beaverton' },
    { '@type': 'City', name: 'Tigard' },
    { '@type': 'City', name: 'Wilsonville' },
    { '@type': 'City', name: 'Tualatin' },
    { '@type': 'City', name: 'Clackamas' },
    { '@type': 'City', name: 'Gladstone' }
    { '@type': 'City', name: 'Estacada' }
    { '@type': 'City', name: 'Newburg' }
    { '@type': 'City', name: 'McMinnville' }
    { '@type': 'City', name: 'Hillsboro' },
    { '@type': 'City', name: 'Tanasborne' }
    { '@type': 'City', name: 'Lake Oswego' },
    { '@type': 'City', name: 'Sherwood' },
    { '@type': 'City', name: 'Gresham' },
    { '@type': 'City', name: 'Oregon City' },
    { '@type': 'City', name: 'West Linn' },
    { '@type': 'City', name: 'Salem' },
    { '@type': 'City', name: 'Keizer' }
    { '@type': 'City', name: 'Woodburn' }
    { '@type': 'City', name: 'Vancouver' }
    { '@type': 'City', name: 'Camas' }
    { '@type': 'City', name: 'Troutdale' }
    { '@type': 'City', name: 'Happy Valley' }
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
