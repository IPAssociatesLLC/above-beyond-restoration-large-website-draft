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
  title: 'Above & Beyond Restoration | Portland, OR - Water, Fire & Mold Damage Experts',
  description:
    'Above & Beyond Restoration provides 24/7 emergency restoration services in Portland, OR. Specializing in water damage, fire damage, mold remediation, smoke damage, demolition, and more. IICRC certified. Call 503-608-2930.',
  keywords:
    'water damage restoration Portland OR, fire damage restoration, mold remediation, smoke damage, demolition, property restoration, emergency restoration services, IICRC certified',
  authors: [{ name: 'Above & Beyond Restoration' }],
  openGraph: {
    title: 'Above & Beyond Restoration | Portland, OR',
    description: '24/7 Emergency Restoration Services - Water, Fire, Mold & More',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1B2A4A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} bg-background`}>
      <body className="antialiased font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
