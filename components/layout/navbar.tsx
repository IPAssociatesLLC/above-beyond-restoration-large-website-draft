'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const services = [
  { name: 'Water Damage', href: '/services/water-damage' },
  { name: 'Fire Damage', href: '/services/fire-damage' },
  { name: 'Mold Remediation', href: '/services/mold-remediation' },
  { name: 'Smoke Damage', href: '/services/smoke-damage' },
  { name: 'Demolition Services', href: '/services/demolition' },
  { name: 'Residential Restoration', href: '/services/residential' },
  { name: 'Commercial Restoration', href: '/services/commercial' },
  { name: 'Clean Out & Junk Removal', href: '/services/cleanout' },
]

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services', children: services },
  { name: 'About', href: '/about' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-brand-navy text-white text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="text-brand-orange font-bold">24/7</span> Emergency Service Available
            </span>
            <span className="text-white/60">|</span>
            <span>IICRC Certified Technicians</span>
            <span className="text-white/60">|</span>
            <span>CCB #262371</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Licensed, Bonded & Insured</span>
            <span className="text-white/60">|</span>
            <a href="tel:5036082930" className="flex items-center gap-1.5 text-brand-orange font-semibold hover:text-orange-300 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              503-608-2930
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white shadow-md'
        )}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Above & Beyond Restoration"
                width={220}
                height={60}
                className="h-12 md:h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors rounded-md">
                      {link.name}
                      <ChevronDown className={cn('w-4 h-4 transition-transform', isServicesOpen && 'rotate-180')} />
                    </button>
                    {isServicesOpen && (
                      <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-3 flex-shrink-0" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors rounded-md"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:5036082930"
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors"
              >
                <Phone className="w-4 h-4" />
                503-608-2930
              </a>
              <Link
                href="/contact"
                className="px-4 py-2.5 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                Free Estimate
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {/* Mobile emergency bar */}
              <div className="flex items-center justify-between py-3 px-4 bg-brand-navy rounded-lg mb-3">
                <span className="text-white text-sm font-medium">24/7 Emergency Service</span>
                <a href="tel:5036082930" className="flex items-center gap-1.5 text-brand-orange font-bold text-sm">
                  <Phone className="w-4 h-4" />
                  503-608-2930
                </a>
              </div>

              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.name}>
                    <button
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    >
                      {link.name}
                      <ChevronDown className={cn('w-4 h-4 transition-transform', mobileServicesOpen && 'rotate-180')} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="pl-4 space-y-1 mt-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-brand-orange rounded-lg"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-3" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              )}

              <div className="pt-3">
                <Link
                  href="/contact"
                  className="block w-full py-3 bg-brand-orange text-white text-center rounded-lg font-semibold"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Get a Free Estimate
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
