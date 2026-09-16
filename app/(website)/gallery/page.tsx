import type { Metadata } from 'next'
import { GalleryView } from '@/components/website/gallery-view'

export const metadata: Metadata = {
  title: 'Restoration Project Gallery & Photos | Above & Beyond Portland OR',
  description: 'View before-and-after photos of emergency water extraction, mold remediation, fire damage cleanup, and structural drying in Portland, OR. Call 503-608-2930.',
  openGraph: {
    title: 'Restoration Project Gallery | Above & Beyond Restoration',
    description: 'Documented project gallery showcasing emergency water, mold, and fire restoration in Portland, OR.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function GalleryPage() {
  return <GalleryView />
}

