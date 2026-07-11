'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

const services = [
  'Water Damage', 'Fire Damage', 'Mold Remediation', 'Smoke Damage',
  'Demolition', 'Clean Out / Junk Removal', 'Residential Restoration', 'Commercial Restoration', 'Other',
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', service: '', urgency: 'non-emergency', message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Contact Us</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-2 mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Get a Free Estimate Today
            </h1>
            <p className="text-white/80 text-lg">
              Available 24/7 for emergency services. 90-minute response time across the Portland area.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Alert */}
      <div className="bg-brand-orange">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-white">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="font-semibold">Have an emergency? Don&apos;t wait — call us now for immediate response.</p>
          </div>
          <a
            href="tel:5036082930"
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-brand-orange rounded-lg font-black hover:bg-orange-50 transition-colors whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            503-608-2930
          </a>
        </div>
      </div>

      {/* Contact Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-brand-navy mb-6" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: Phone, label: 'Phone (24/7 Emergency)', value: '503-608-2930', href: 'tel:5036082930' },
                    { icon: Mail, label: 'Email', value: 'tommybletcher@yahoo.com', href: 'mailto:tommybletcher@yahoo.com' },
                    { icon: MapPin, label: 'Mailing Address', value: 'P.O. Box 542, Sherwood, OR 97140', href: null },
                    { icon: Clock, label: 'Hours', value: '24/7 Emergency Service — We Never Close', href: null },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="font-semibold text-brand-navy hover:text-brand-orange transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-semibold text-brand-navy">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-brand-navy rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Why Choose Above & Beyond</h3>
                <ul className="space-y-3">
                  {[
                    '90-Minute Emergency Response',
                    'IICRC Certified Technicians',
                    'Free Estimates',
                    'Direct Insurance Billing',
                    '100% Satisfaction Guarantee',
                    'Licensed, Bonded & Insured',
                    'CCB #193269',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service License */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-xs text-gray-500">Oregon CCB License</p>
                <p className="text-2xl font-black text-brand-navy">#193269</p>
                <p className="text-xs text-gray-500 mt-1">Licensed • Bonded • Insured</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-navy mb-2">Message Received!</h3>
                    <p className="text-gray-600 mb-6">
                      We&apos;ll contact you within 15 minutes during business hours. For emergencies, please call <a href="tel:5036082930" className="text-brand-orange font-bold">503-608-2930</a> now.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 bg-brand-navy text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-brand-navy mb-6" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                      Request a Free Estimate
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition"
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition"
                            placeholder="(503) 555-0100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Property Address *</label>
                        <input
                          type="text"
                          required
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition"
                          placeholder="123 Main St, Portland, OR 97201"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Needed *</label>
                          <select
                            required
                            value={form.service}
                            onChange={(e) => setForm({ ...form, service: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition bg-white"
                          >
                            <option value="">Select a service...</option>
                            {services.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Urgency Level</label>
                          <select
                            value={form.urgency}
                            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition bg-white"
                          >
                            <option value="emergency">Emergency (Immediate)</option>
                            <option value="urgent">Urgent (Today)</option>
                            <option value="non-emergency">Non-Emergency (Schedule)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Describe the Damage</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={4}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition resize-none"
                          placeholder="Please describe the damage, when it occurred, and any relevant details..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors"
                      >
                        Submit Free Estimate Request
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        For immediate emergencies call <a href="tel:5036082930" className="text-brand-orange font-semibold">503-608-2930</a>. We respond to form submissions within 15 minutes.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
