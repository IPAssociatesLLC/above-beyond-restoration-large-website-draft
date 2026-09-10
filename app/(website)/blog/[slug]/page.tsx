import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPostBySlug, getAllBlogPosts } from '@/app/actions/seo-content'
import { Clock, User, Phone, CheckCircle, ArrowRight, Shield, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Article Not Found | Above & Beyond Restoration',
    }
  }

  return {
    title: post.metaTitle || `${post.title} | Above & Beyond Restoration`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      locale: 'en_US',
    },
  }
}

// Simple helper to render markdown lines cleanly
function formatMarkdownContent(content: string) {
  const lines = content.split('\n')
  return lines.map((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="text-3xl font-black text-brand-navy mt-8 mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
          {trimmed.replace('# ', '')}
        </h1>
      )
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-2xl font-black text-brand-navy mt-8 mb-4 border-b border-gray-100 pb-2" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
          {trimmed.replace('## ', '')}
        </h2>
      )
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-xl font-bold text-brand-navy mt-6 mb-3">
          {trimmed.replace('### ', '')}
        </h3>
      )
    }
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={idx} className="border-l-4 border-brand-orange bg-orange-50/60 p-4 rounded-r-xl my-6 text-brand-navy font-medium">
          {trimmed.replace('> ', '')}
        </blockquote>
      )
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <li key={idx} className="ml-4 list-disc text-gray-700 my-1 leading-relaxed">
          {trimmed.replace(/^[-*]\s+/, '')}
        </li>
      )
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <li key={idx} className="ml-4 list-decimal text-gray-700 my-1 leading-relaxed font-medium">
          {trimmed.replace(/^\d+\.\s+/, '')}
        </li>
      )
    }
    if (trimmed === '---') {
      return <hr key={idx} className="my-8 border-gray-200" />
    }
    if (trimmed === '') {
      return null
    }
    return (
      <p key={idx} className="text-gray-700 leading-relaxed my-4 text-base">
        {trimmed}
      </p>
    )
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllBlogPosts()
  const recentPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const faqs = (Array.isArray(post.faqs) ? post.faqs : []) as { q: string; a: string }[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: 'Above & Beyond Restoration',
      url: 'https://aboveandbeyondrestoration.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Above & Beyond Restoration',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aboveandbeyondrestoration.com/logo.png',
      },
    },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `https://aboveandbeyondrestoration.com/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-gray-50 min-h-screen">
        {/* Post Hero */}
        <section className="bg-brand-navy text-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-2 mb-4 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span>/</span>
              <span className="text-brand-orange font-semibold truncate max-w-xs">{post.title}</span>
            </div>

            <div className="inline-block bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              {post.category}
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 border-t border-white/10 pt-4">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-orange" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-orange" />
                IICRC Certified Insights
              </span>
            </div>
          </div>
        </section>

        {/* Article Body & Sidebar */}
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <article className="lg:col-span-2 bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
              <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden mb-8 bg-brand-navy">
                <Image
                  src={post.heroImage || '/images/why-choose-us-team.png'}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="prose max-w-none">
                {formatMarkdownContent(post.content)}
              </div>

              {/* FAQs Section if present */}
              {faqs.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-black text-brand-navy mb-6" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                        <h3 className="font-bold text-brand-navy mb-2">{faq.q}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share / Author Box */}
              <div className="mt-12 p-6 bg-orange-50/60 rounded-2xl border border-brand-orange/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-brand-navy text-lg">Have a Restoration Question?</h4>
                  <p className="text-gray-600 text-sm mt-1">Our certified specialists are available 24/7 for immediate dispatch.</p>
                </div>
                <a
                  href="tel:5036082930"
                  className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4" /> 503-608-2930
                </a>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Emergency Response Box */}
              <div className="bg-brand-navy rounded-2xl p-6 text-white shadow-md">
                <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange text-brand-orange px-3 py-1 rounded-full text-xs font-bold mb-4">
                  24/7 Emergency Service
                </div>
                <h3 className="text-xl font-black mb-2">90-Minute Emergency Response</h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed">
                  Water or mold emergency in Portland? Our crews arrive fast with industrial extraction and drying equipment.
                </p>
                <a
                  href="tel:5036082930"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors mb-3"
                >
                  <Phone className="w-4 h-4" /> Call 503-608-2930
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors text-sm"
                >
                  Request Free Estimate
                </Link>
              </div>

              {/* Recent Guides */}
              {recentPosts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-black text-brand-navy mb-4 text-lg">Related Guides</h3>
                  <div className="space-y-4">
                    {recentPosts.map((recent) => (
                      <div key={recent.id} className="pb-3 border-b border-gray-100 last:border-none last:pb-0">
                        <Link
                          href={`/blog/${recent.slug}`}
                          className="font-bold text-sm text-gray-800 hover:text-brand-orange transition-colors line-clamp-2"
                        >
                          {recent.title}
                        </Link>
                        <span className="text-xs text-gray-400 mt-1 block">{recent.readTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
