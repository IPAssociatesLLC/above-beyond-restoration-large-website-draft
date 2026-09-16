import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogPosts } from '@/app/actions/seo-content'
import { Clock, User, ArrowRight, BookOpen, Shield, Phone } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Property Restoration & Emergency Mitigation Blog | Portland OR',
  description:
    'Expert property restoration advice, disaster mitigation guides, and emergency tips for homeowners and businesses in Portland, OR. Call 503-608-2930.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Property Restoration & Emergency Mitigation Blog | Portland OR',
    description:
      'Expert advice, insurance claim guides, and disaster prevention tips from IICRC-certified restoration professionals in Portland, OR.',
    type: 'website',
    url: 'https://www.abovebeyondrestorationllc.com/blog',
  },
}

const blogIndexSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Blog',
      '@id': 'https://www.abovebeyondrestorationllc.com/blog#blog',
      url: 'https://www.abovebeyondrestorationllc.com/blog',
      name: 'Above & Beyond Restoration Blog',
      description: 'Educational articles and emergency response guides for property owners in Portland, Oregon.',
      publisher: {
        '@id': 'https://www.abovebeyondrestorationllc.com/#organization',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.abovebeyondrestorationllc.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://www.abovebeyondrestorationllc.com/blog',
        },
      ],
    },
  ],
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexSchema) }}
      />
      {/* Hero Header */}
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-brand-orange font-semibold">Blog & Guides</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Restoration Knowledge Hub
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Expert advice, emergency checklists, and insider guides from IICRC certified restoration professionals serving the greater Portland, Oregon metro area.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-2xl mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-2xl font-black text-brand-navy mb-2">New Articles Being Published Daily</h2>
            <p className="text-gray-600 mb-6">
              Our restoration experts are actively publishing localized disaster recovery guides and emergency tips. Check back daily or call us 24/7 if you need immediate assistance.
            </p>
            <a
              href="tel:5036082930"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Phone className="w-4 h-4" /> Call 24/7: 503-608-2930
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-48 w-full bg-brand-navy">
                  <Image
                    src={post.featuredImage || '/images/water-damage.png'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime || '5 min read'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {post.author || 'Above & Beyond Team'}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-brand-navy mb-3 line-clamp-2 hover:text-brand-orange transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">IICRC Certified Insights</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-brand-orange font-bold text-sm hover:gap-2 transition-all"
                    >
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Emergency Bottom Banner */}
      <section className="bg-brand-navy text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Need Immediate Emergency Service?</h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm mb-6">
            Our certified restoration crew is available 24/7/365 with a guaranteed 90-minute response time across Portland Metro.
          </p>
          <a
            href="tel:5036082930"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-colors"
          >
            <Phone className="w-5 h-5" /> Call 503-608-2930 (24/7 Dispatch)
          </a>
        </div>
      </section>
    </div>
  )
}
