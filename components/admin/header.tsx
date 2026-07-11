'use client'

import { Menu, Bell, Search, Plus } from 'lucide-react'
import Link from 'next/link'

interface AdminHeaderProps {
  onMobileMenuOpen: () => void
  title: string
}

export function AdminHeader({ onMobileMenuOpen, title }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1
          className="text-lg font-black text-brand-navy hidden sm:block"
          style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
        >
          {title}
        </h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-64">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search clients, jobs..."
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none flex-1"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/estimates/new"
          className="hidden sm:flex items-center gap-2 px-3 py-2 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Estimate
        </Link>
        <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
        </button>
      </div>
    </header>
  )
}
