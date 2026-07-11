import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Shield, Award, CheckCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      {/* CTA Banner */}
      <div className="bg-brand-orange">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Emergency? We Respond in 90 Minutes.</h3>
              <p className="text-white/90 text-sm mt-1">Available 24/7, 365 days a year for Portland metro area</p>
            </div>
            <a
              href="tel:5036082930"
              className="flex items-center gap-2 px-8 py-3 bg-white text-brand-orange rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              <Phone className="w-5 h-5" />
              Call 503-608-2930
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Above & Beyond Restoration"
              width={180}
              height={50}
              className="h-12 w-auto brightness-0 invert mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              Portland&apos;s trusted restoration experts. IICRC certified professionals delivering 24/7 emergency services for water, fire, mold, and smoke damage.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>P.O. Box 542, Sherwood, OR 97140</span>
              </div>
              <a href="tel:5036082930" className="flex items-center gap-2 text-white/80 hover:text-brand-orange transition-colors">
                <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                503-608-2930
              </a>
              <a href="mailto:info@aboveandbeyondrestoration.com" className="flex items-center gap-2 text-white/80 hover:text-brand-orange transition-colors">
                <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
                tommybletcher@yahoo.com
              </a>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-4 h-4 text-brand-orange flex-shrink-0" />
                24/7 Emergency Service
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-brand-orange pb-2">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Water Damage Restoration', href: '/services/water-damage' },
                { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
                { name: 'Mold Remediation', href: '/services/mold-remediation' },
                { name: 'Smoke Damage Cleanup', href: '/services/smoke-damage' },
                { name: 'Demolition Services', href: '/services/demolition' },
                { name: 'Residential Restoration', href: '/services/residential' },
                { name: 'Commercial Restoration', href: '/services/commercial' },
                { name: 'Clean Out & Junk Removal', href: '/services/cleanout' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/70 text-sm hover:text-brand-orange transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-orange" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-brand-orange pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Photo Gallery', href: '/gallery' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Free Estimate', href: '/contact' },
                { name: 'Insurance Claims Help', href: '/about#insurance' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/70 text-sm hover:text-brand-orange transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-orange" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Service Areas</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Portland • Salem • Bend/Redmond • Gresham • Oregon Coast & surrounding areas
              </p>
            </div>
          </div>

          {/* Credentials */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-brand-orange pb-2">
              Our Credentials
            </h4>
            <div className="space-y-3">
              {[
                { icon: Shield, text: 'Licensed, Bonded & Insured' },
                { icon: Award, text: 'IICRC Certified Technicians' },
                { icon: CheckCircle, text: 'Xactimate Certified' },
                { icon: CheckCircle, text: 'CCB #193269' },
                { icon: CheckCircle, text: '100% Satisfaction Guarantee' },
                { icon: CheckCircle, text: '1 Year Full Warranty on Work' },
                { icon: CheckCircle, text: 'Insurance Billing Experts' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <span className="text-white/80 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Above & Beyond Restoration. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-brand-orange transition-colors">Terms of Service</Link>
            <span>|</span>
            <span>Portland, OR</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
