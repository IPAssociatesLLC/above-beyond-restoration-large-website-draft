'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/admin/clients': 'Client Management',
  '/admin/jobs': 'Jobs & Projects',
  '/admin/estimates': 'Estimates & Invoices',
  '/admin/estimates/new': 'New Estimate',
  '/admin/photo-estimator': 'AI Photo Estimator',
  '/admin/financials': 'Financials',
  '/admin/leads': 'Lead Management',
  '/admin/reports': 'Reports & Analytics',
  '/admin/social': 'Social Media Manager',
  '/admin/notifications': 'Notifications',
  '/admin/settings': 'Settings & Integrations',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const title = pageTitles[pathname] ?? 'Admin Dashboard'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onMobileMenuOpen={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
