import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogPosts } from '@/app/actions/seo-content'
import { Clock, User, ArrowRight, BookOpen, Shield, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Restoration Blog & Guides | Above & Beyond Restoration',
  description: 'Expert property restoration advice, disaster mitigation guides, and emergency tips for homeowners and businesses in Portland, OR.',
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="bg-gray-50 min-h-screen">
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
                    src={post.heroImage || '/images/why-choose-us-team.png'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-orange" />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-orange" />
                      {post.author ? post.author.split('—')[0] : 'Above & Beyond'}
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

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:gap-3 transition-all pt-3 border-t border-gray-100"
                  >
                    Read Full Guide <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
