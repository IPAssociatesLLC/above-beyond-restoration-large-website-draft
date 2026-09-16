'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  title?: string
  subtitle?: string
  faqs: FaqItem[]
  badge?: string
  enableJsonLd?: boolean
}

export function FaqAccordion({
  title = 'Frequently Asked Questions',
  subtitle = 'Get clear answers to common questions about emergency restoration, insurance billing, and response times in Portland, OR.',
  faqs,
  badge = 'Common Questions',
  enableJsonLd = true,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  // Schema.org FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      {enableJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-brand-orange mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              {badge}
            </span>
          )}
          <h2
            className="text-3xl md:text-4xl font-black text-brand-navy mb-3"
            style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}
          >
            {title}
          </h2>
          {subtitle && <p className="text-gray-600 text-base max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-colors bg-gray-50/50 hover:border-brand-orange/40"
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-base md:text-lg text-brand-navy focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-brand-orange shadow-sm transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-brand-orange text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-100">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
