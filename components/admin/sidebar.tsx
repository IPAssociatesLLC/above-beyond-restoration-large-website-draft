'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Camera,
  BarChart3,
  Settings,
  MessageSquare,
  Globe,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Wrench,
  DollarSign,
  Bell,
  Share2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Clients',
    href: '/admin/clients',
    icon: Users,
  },
  {
    label: 'Jobs',
    href: '/admin/jobs',
    icon: Wrench,
  },
  {
    label: 'Estimates & Invoices',
    href: '/admin/estimates',
    icon: FileText,
  },
  {
    label: 'Photo Estimator',
    href: '/admin/photo-estimator',
    icon: Camera,
  },
  {
    label: 'Financials',
    href: '/admin/financials',
    icon: DollarSign,
  },
  {
    label: 'Leads',
    href: '/admin/leads',
    icon: MessageSquare,
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    label: 'Social Media',
    href: '/admin/social',
    icon: Share2,
  },
  {
    label: 'Website',
    href: '/',
    icon: Globe,
    external: true,
  },
  {
    label: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function AdminSidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 flex flex-col bg-brand-navy transition-all duration-300 dashboard-scroll overflow-y-auto',
          'lg:relative lg:translate-x-0',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Area */}
        <div className={cn('flex items-center h-16 border-b border-white/10 px-4 flex-shrink-0', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Above & Beyond Restoration" width={140} height={40} className="h-9 w-auto brightness-0 invert" />
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center font-black text-white text-sm">A</div>
          )}
          {/* Mobile close */}
          <button onClick={onMobileClose} className="lg:hidden text-white/60 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn('hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors', collapsed && 'mx-auto')}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Admin Badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">Admin</p>
                <p className="text-white/50 text-xs truncate">Above & Beyond</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-brand-orange text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.external && (
                  <span className="ml-auto text-white/30 text-xs">↗</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/10">
          <button
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all w-full',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
