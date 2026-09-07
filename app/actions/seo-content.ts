'use server'

import { db, pool } from '@/lib/db'
import { seoContentSchedule, seoPages, blogPosts } from '@/lib/db/schema'
import { ensureSeoTablesExist } from '@/lib/db/init-seo-tables'
import { DEFAULT_30_DAY_STRATEGY, StrategyDayItem } from '@/lib/seo/default-strategy'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { eq, desc, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// In-memory persistent cache for localhost / preview when postgres is offline
const globalSeoStore = globalThis as unknown as {
  __seoSchedule?: StrategyDayItem[]
  __seoPages?: any[]
  __seoBlogs?: any[]
}

if (!globalSeoStore.__seoSchedule) {
  globalSeoStore.__seoSchedule = [...DEFAULT_30_DAY_STRATEGY]
}
if (!globalSeoStore.__seoPages) {
  globalSeoStore.__seoPages = []
}
if (!globalSeoStore.__seoBlogs) {
  globalSeoStore.__seoBlogs = []
}

// Helper to convert string to clean URL slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Zod schema for generating service landing pages
const servicePageAiSchema = z.object({
  title: z.string().describe('Clear, high-converting service page title with target keyword'),
  subtitle: z.string().describe('1-2 sentence compelling subtitle highlighting 24/7 rapid response, IICRC certification, and local service'),
  metaTitle: z.string().describe('SEO meta title under 60 characters with keyword and Portland/Oregon location'),
  metaDescription: z.string().describe('SEO meta description under 155 characters with phone number 503-608-2930 and 90-min response'),
  description: z.array(z.string()).min(3).max(4).describe('3 to 4 comprehensive, authoritative paragraphs explaining the service, why speed matters, and Above & Beyond restoration expertise'),
  benefits: z.array(z.string()).min(8).max(14).describe('8 to 12 bulleted highlights and benefits (e.g. 5-Day Max Dryout, Thermal Imaging, Direct Insurance Billing)'),
  process: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).min(5).max(6).describe('5 to 6 numbered steps from emergency call dispatch to final moisture clearance/restoration'),
  faqs: z.array(z.object({
    q: z.string().describe('Specific, realistic homeowner or business question'),
    a: z.string().describe('Detailed, reassuring, professional answer referencing IICRC standards or insurance procedures'),
  })).min(4).max(6).describe('4 to 6 localized FAQs matching the service keyword and location'),
  relatedServices: z.array(z.object({
    name: z.string(),
    href: z.string(),
  })).min(3).max(5).describe('Related services to cross-link on the site'),
})

// Zod schema for generating daily blog articles
const blogPostAiSchema = z.object({
  title: z.string().describe('Engaging, click-worthy, SEO-optimized blog title'),
  excerpt: z.string().describe('2 sentence hook summarizing the article and why immediate action is critical'),
  readTime: z.string().describe('e.g. "6 min read"'),
  content: z.string().describe('Comprehensive markdown article (1,200+ words) with # H2, ## H3 subheadings, numbered steps, bulleted warning signs, emergency callouts to 503-608-2930, and expert advice'),
  faqs: z.array(z.object({
    q: z.string(),
    a: z.string(),
  })).min(3).max(5).describe('3 to 5 frequently asked questions directly answered at the end of the post'),
  metaTitle: z.string().describe('SEO meta title under 60 chars'),
  metaDescription: z.string().describe('SEO meta description under 155 chars'),
})

export async function getSchedule(): Promise<StrategyDayItem[]> {
  try {
    await ensureSeoTablesExist()
    if (process.env.DATABASE_URL) {
      const rows = await db.select().from(seoContentSchedule).orderBy(asc(seoContentSchedule.dayNumber))
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          dayNumber: r.dayNumber,
          theme: r.theme,
          targetCity: r.targetCity,
          serviceCategory: 'Water Damage Restoration',
          pageKeywords: Array.isArray(r.pageKeywords) && r.pageKeywords.length === 3
            ? (r.pageKeywords as [string, string, string])
            : [r.pageKeywords?.[0] || 'Water Damage Restoration', r.pageKeywords?.[1] || 'Emergency Water Extraction', r.pageKeywords?.[2] || 'Property Restoration'],
          blogKeyword: r.blogKeyword,
          blogTitle: r.blogTitle || r.blogKeyword,
        }))
      }
    }
  } catch (err) {
    // DB offline, fallback to memory
  }

  return globalSeoStore.__seoSchedule || DEFAULT_30_DAY_STRATEGY
}

export async function saveSchedule(schedule: StrategyDayItem[]): Promise<{ ok: boolean; message: string }> {
  globalSeoStore.__seoSchedule = schedule

  try {
    await ensureSeoTablesExist()
    if (process.env.DATABASE_URL) {
      for (const item of schedule) {
        const existing = await db.select().from(seoContentSchedule).where(eq(seoContentSchedule.dayNumber, item.dayNumber))
        if (existing.length > 0) {
          await db.update(seoContentSchedule).set({
            theme: item.theme,
            targetCity: item.targetCity,
            pageKeywords: item.pageKeywords,
            blogKeyword: item.blogKeyword,
            blogTitle: item.blogTitle,
            updatedAt: new Date(),
          }).where(eq(seoContentSchedule.dayNumber, item.dayNumber))
        } else {
          await db.insert(seoContentSchedule).values({
            dayNumber: item.dayNumber,
            theme: item.theme,
            targetCity: item.targetCity,
            pageKeywords: item.pageKeywords,
            blogKeyword: item.blogKeyword,
            blogTitle: item.blogTitle,
            status: 'pending',
          })
        }
      }
    }
  } catch (err) {
    console.log('Saved to memory storage for local development preview.')
  }

  revalidatePath('/admin/seo-content')
  return { ok: true, message: '30-Day Content Schedule saved successfully!' }
}

export async function resetScheduleToDefault(): Promise<{ ok: boolean; message: string }> {
  globalSeoStore.__seoSchedule = [...DEFAULT_30_DAY_STRATEGY]
  return await saveSchedule(DEFAULT_30_DAY_STRATEGY)
}

// Fallback high-quality template generator in case AI API key is not present or rate limited
function generateDeterministicServicePage(keyword: string, city: string, theme: string, dayNumber: number) {
  const slug = slugify(`${keyword}-${city}`)
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    slug,
    title: keyword,
    subtitle: `24/7 Emergency restoration response in ${city} and surrounding areas. IICRC certified technicians, 90-minute arrival, and direct insurance billing.`,
    heroImage: '/images/water-damage.png',
    keyword,
    city,
    serviceCategory: 'Water Damage Restoration',
    description: [
      `Above & Beyond Restoration is ${city}'s premier property restoration company, delivering fast, certified emergency service for residential and commercial properties experiencing ${keyword.toLowerCase()}. Our technicians are on call 24 hours a day, 365 days a year, with a guaranteed 90-minute response time.`,
      `When dealing with ${keyword.toLowerCase()}, every minute counts. Standing moisture quickly penetrates deep into subflooring, drywall, and structural framing, fostering hazardous mold growth in as little as 24 to 48 hours. Using commercial-grade thermal imaging cameras, moisture meters, and industrial dehumidifiers, we thoroughly extract water and dry out affected materials.`,
      `We advocate directly for property owners by documenting every phase of the mitigation using industry-standard Xactimate pricing. We bill your insurance carrier directly, taking the stress out of claims while protecting your property from secondary structural damage.`,
    ],
    benefits: [
      '5-Day Maximum Dry-Out Charge on Clean Water',
      '90-Minute Emergency Dispatch in ' + city,
      'IICRC S500 / S520 Certified Technicians',
      'Direct Insurance Billing & Xactimate Scoping',
      'Thermal Imaging & Non-Invasive Moisture Mapping',
      'Industrial Air Movers & LGR Dehumidifiers',
      'Hospital-Grade Antimicrobial Sanitization',
      '100% Satisfaction Guarantee & 1-Year Work Warranty',
    ],
    process: [
      { title: 'Emergency Dispatch & Immediate Arrival', description: `Our rapid response team arrives at your ${city} property within 90 minutes equipped for immediate water mitigation.` },
      { title: 'Thermal Moisture Inspection', description: 'We map all affected areas using infrared thermal imaging cameras and calibrated penetrative moisture meters.' },
      { title: 'High-Volume Water Extraction', description: 'Truck-mounted and industrial submersible extractors remove standing water quickly from carpet, hardwood, and concrete.' },
      { title: 'Controlled Structural Drying', description: 'Strategic placement of high-velocity air movers and commercial dehumidifiers to return humidity and structural moisture to pre-loss dry standard.' },
      { title: 'Antimicrobial Treatment & Odor Removal', description: 'Application of EPA-registered botanical antimicrobials to eliminate bacteria, prevent toxic mold spores, and purify indoor air.' },
      { title: 'Final Moisture Clearance & Insurance Sign-Off', description: 'Comprehensive dry-log verification confirming 100% moisture removal, followed by insurance documentation submittal.' },
    ],
    faqs: [
      {
        q: `How quickly can you arrive in ${city} for ${keyword}?`,
        a: `We provide guaranteed 24/7 emergency dispatch across ${city} and the entire Portland metro area, arriving on-site within 90 minutes or less.`,
      },
      {
        q: 'Will homeowners or commercial property insurance cover this restoration?',
        a: 'Yes, most property insurance policies cover sudden and accidental water, mold, fire, and storm damage. We handle the entire claims process and bill your insurer directly.',
      },
      {
        q: 'How do you ensure mold will not grow after water damage?',
        a: 'We strictly adhere to IICRC S500 and S520 standards, deploying industrial desiccant dehumidifiers and applying hospital-grade EPA antimicrobial sanitizers within the critical first 24-48 hours.',
      },
      {
        q: 'What is your 5-Day Dry-Out Guarantee?',
        a: 'For clean water losses, we cap our dry-out equipment charges at a maximum of 5 days, ensuring fast, efficient drying without unnecessary costs for you or your insurance carrier.',
      },
    ],
    relatedServices: [
      { name: 'Water Damage Restoration', href: '/services/water-damage' },
      { name: 'Mold Remediation', href: '/services/mold-remediation' },
      { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
      { name: 'Demolition Services', href: '/services/demolition' },
    ],
    metaTitle: `${keyword} | Above & Beyond Restoration`,
    metaDescription: `24/7 emergency ${keyword.toLowerCase()} in ${city}. 90-minute response, IICRC certified, direct insurance billing. Call 503-608-2930 now.`,
    dayNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function generateDeterministicBlogPost(keyword: string, title: string, city: string, theme: string, dayNumber: number) {
  const slug = slugify(title)
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    slug,
    title,
    excerpt: `Experiencing a property emergency in ${city}? Learn the essential steps to protect your structure, prevent toxic mold growth, and navigate insurance claims effectively.`,
    category: 'Water Damage & Restoration',
    keyword,
    author: 'Tommy Bletcher — Certified Restoration Specialist',
    readTime: '6 min read',
    content: `
# ${title}

When disaster strikes your home or commercial building in ${city}, immediate action is the single most important factor determining whether your property can be saved or suffers irreversible structural damage. At **Above & Beyond Restoration**, our IICRC-certified team responds 24/7 across the Portland metro area within **90 minutes or less**.

---

## Why the First 24 to 48 Hours Are Critical

Water is relentless. Within the first hour of a pipe burst, appliance leak, or storm flood, water spreads into drywall, baseboards, carpeting, and porous subfloors. 

Key timelines you must know:
- **Within 1–24 Hours:** Water saturates porous materials, causes drywall to sag, and begins swelling hardwood floor planks.
- **Within 24–48 Hours:** Fungi and mold spores begin germinating on damp organic building materials.
- **Within 48–72 Hours:** Secondary damage accelerates; structural integrity weakens, and bio-contaminants proliferate.

> **Emergency Tip:** If you have active water pouring into your property, locate your main water shut-off valve immediately and turn it clockwise until fully closed. Then call Above & Beyond Restoration at **[503-608-2930](tel:5036082930)**.

---

## 5 Essential Steps to Take Right Now

1. **Ensure Electrical Safety:** Never walk into standing water if electrical outlets or appliances are submerged. Switch off the main breaker if safely accessible.
2. **Stop the Water Source:** Shut off the water main or individual appliance supply line.
3. **Document the Damage for Insurance:** Before discarding or moving wet items, take high-resolution photos and video of all standing water, water lines on walls, and damaged belongings.
4. **Call a Certified Restoration Company:** Consumer fans and household shop vacs cannot extract trapped moisture from wall cavities and subfloors. Industrial-grade LGR dehumidifiers and air movers are required.
5. **Notify Your Insurance Carrier:** File a claim notice and inform them that **Above & Beyond Restoration** (CCB #262371) is performing the emergency structural drying.

---

## How Above & Beyond Restoration Protects Your Investment

Our certified restoration protocol ensures complete recovery with minimal disruption:
- **90-Minute Emergency Arrival:** We dispatch immediate extraction crews anywhere in ${city} and surrounding areas.
- **5-Day Maximum Dryout Policy:** We do not inflate drying times; on clean water jobs, equipment charges are capped at 5 days.
- **Direct Insurance Billing:** We submit detailed line-item scopes using Xactimate pricing directly to your adjuster.
- **1-Year Warranty:** We stand behind all completed mitigation and reconstruction work.

---

## Frequently Asked Questions

### Can my wet hardwood floors be saved without replacement?
In many cases, yes. By deploying specialized high-pressure injection mat drying systems that pull moisture directly out of hardwood planks and the subfloor beneath, we frequently save expensive hardwood flooring from cupping and permanent replacement.

### Will insurance cover mold remediation if it started after a leak?
If mold developed as a direct result of a covered sudden and accidental water loss (such as a burst pipe), insurance policies generally cover the associated mold remediation and structural repairs.

### How do I schedule an emergency inspection in ${city}?
Call our 24/7 dispatch hotline directly at **503-608-2930** or use our [Online Estimate Form](/contact).
    `,
    faqs: [
      {
        q: `What should I do first during a water leak in ${city}?`,
        a: 'Turn off the main water valve immediately, ensure electrical safety by shutting off power to affected rooms, and call 503-608-2930 for 90-minute emergency extraction.',
      },
      {
        q: 'How does Above & Beyond bill insurance for property restoration?',
        a: 'We document all damage with moisture logs, thermal imaging, and Xactimate line-item estimates, then submit claims directly to your insurance company so you do not pay out-of-pocket for covered losses.',
      },
    ],
    metaTitle: `${title} | Above & Beyond Blog`,
    metaDescription: `Expert guidance for ${keyword.toLowerCase()} in ${city}. Learn key safety steps, mold prevention, and insurance claim tips. Call 503-608-2930.`,
    dayNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Generate Day Content: 3 Pages + 1 Blog
export async function generateDayContent(dayNumber: number): Promise<{
  ok: boolean
  message: string
  createdPages?: string[]
  createdBlog?: string
}> {
  const schedule = await getSchedule()
  const dayItem = schedule.find((s) => s.dayNumber === dayNumber) || schedule[(dayNumber - 1) % schedule.length]

  if (!dayItem) {
    return { ok: false, message: `Could not find schedule for Day ${dayNumber}` }
  }

  const createdPages: string[] = []
  let createdBlogSlug = ''

  try {
    // 1. Generate 3 Landing Pages
    for (const kw of dayItem.pageKeywords) {
      let pageData = generateDeterministicServicePage(kw, dayItem.targetCity, dayItem.theme, dayNumber)

      // Try AI enhancement if environment has key
      if (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.AI_GATEWAY_KEY) {
        try {
          const { output } = await generateText({
            model: 'google/gemini-2.5-flash',
            output: Output.object({ schema: servicePageAiSchema }),
            prompt: `You are the lead SEO and restoration expert for Above & Beyond Restoration (Portland, OR metro, CCB #262371, Phone 503-608-2930, 90-min emergency response, 5-day max dryout charge).
Generate a complete, high-converting service landing page for the keyword: "${kw}" in "${dayItem.targetCity}". Theme: "${dayItem.theme}".
Ensure high semantic density for local AI search and Google organic search. Include 4-6 rich localized FAQs.`,
          })

          if (output) {
            pageData = {
              ...pageData,
              title: output.title || pageData.title,
              subtitle: output.subtitle || pageData.subtitle,
              metaTitle: output.metaTitle || pageData.metaTitle,
              metaDescription: output.metaDescription || pageData.metaDescription,
              description: output.description || pageData.description,
              benefits: output.benefits || pageData.benefits,
              process: output.process || pageData.process,
              faqs: output.faqs || pageData.faqs,
              relatedServices: output.relatedServices || pageData.relatedServices,
            }
          }
        } catch (aiErr) {
          // Keep deterministic structured page
        }
      }

      // Save to memory store
      if (!globalSeoStore.__seoPages) globalSeoStore.__seoPages = []
      const existingMemIdx = globalSeoStore.__seoPages.findIndex((p) => p.slug === pageData.slug)
      if (existingMemIdx >= 0) {
        globalSeoStore.__seoPages[existingMemIdx] = pageData
      } else {
        globalSeoStore.__seoPages.unshift(pageData)
      }

      // Save to database if connected
      try {
        await ensureSeoTablesExist()
        if (process.env.DATABASE_URL) {
          const existing = await db.select().from(seoPages).where(eq(seoPages.slug, pageData.slug))
          if (existing.length > 0) {
            await db.update(seoPages).set({
              title: pageData.title,
              subtitle: pageData.subtitle,
              heroImage: pageData.heroImage,
              keyword: pageData.keyword,
              city: pageData.city,
              serviceCategory: pageData.serviceCategory,
              description: pageData.description,
              benefits: pageData.benefits,
              process: pageData.process,
              faqs: pageData.faqs,
              relatedServices: pageData.relatedServices,
              metaTitle: pageData.metaTitle,
              metaDescription: pageData.metaDescription,
              dayNumber,
              updatedAt: new Date(),
            }).where(eq(seoPages.slug, pageData.slug))
          } else {
            await db.insert(seoPages).values(pageData)
          }
        }
      } catch (dbErr) {
        // Ignored for local memory fallback
      }

      createdPages.push(pageData.slug)
    }

    // 2. Generate 1 Daily Blog Post
    let blogData = generateDeterministicBlogPost(
      dayItem.blogKeyword,
      dayItem.blogTitle,
      dayItem.targetCity,
      dayItem.theme,
      dayNumber
    )

    if (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.AI_GATEWAY_KEY) {
      try {
        const { output } = await generateText({
          model: 'google/gemini-2.5-flash',
          output: Output.object({ schema: blogPostAiSchema }),
          prompt: `You are the senior restoration specialist writing a deep, authoritative guide for Above & Beyond Restoration (Portland, OR).
Topic: "${dayItem.blogTitle}", Keyword: "${dayItem.blogKeyword}", Location: "${dayItem.targetCity}".
Write a complete 1,200+ word markdown guide formatted with H2, H3, emergency checklists, and FAQs. Phone is 503-608-2930.`,
        })

        if (output) {
          blogData = {
            ...blogData,
            title: output.title || blogData.title,
            excerpt: output.excerpt || blogData.excerpt,
            readTime: output.readTime || blogData.readTime,
            content: output.content || blogData.content,
            faqs: output.faqs || blogData.faqs,
            metaTitle: output.metaTitle || blogData.metaTitle,
            metaDescription: output.metaDescription || blogData.metaDescription,
          }
        }
      } catch (aiErr) {
        // Keep deterministic blog
      }
    }

    // Save to memory store
    if (!globalSeoStore.__seoBlogs) globalSeoStore.__seoBlogs = []
    const existingBlogIdx = globalSeoStore.__seoBlogs.findIndex((b) => b.slug === blogData.slug)
    if (existingBlogIdx >= 0) {
      globalSeoStore.__seoBlogs[existingBlogIdx] = blogData
    } else {
      globalSeoStore.__seoBlogs.unshift(blogData)
    }

    // Save to DB if connected
    try {
      if (process.env.DATABASE_URL) {
        const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, blogData.slug))
        if (existing.length > 0) {
          await db.update(blogPosts).set({
            title: blogData.title,
            excerpt: blogData.excerpt,
            content: blogData.content,
            heroImage: blogData.heroImage,
            category: blogData.category,
            keyword: blogData.keyword,
            author: blogData.author,
            readTime: blogData.readTime,
            faqs: blogData.faqs,
            metaTitle: blogData.metaTitle,
            metaDescription: blogData.metaDescription,
            dayNumber,
            updatedAt: new Date(),
          }).where(eq(blogPosts.slug, blogData.slug))
        } else {
          await db.insert(blogPosts).values(blogData)
        }

        await db.update(seoContentSchedule).set({
          status: 'generated',
          generatedAt: new Date(),
        }).where(eq(seoContentSchedule.dayNumber, dayNumber))
      }
    } catch (dbErr) {
      // Ignored for local memory fallback
    }

    createdBlogSlug = blogData.slug

    revalidatePath('/services')
    revalidatePath('/blog')
    revalidatePath('/sitemap.xml')
    revalidatePath('/admin/seo-content')

    return {
      ok: true,
      message: `Day ${dayNumber} content generated successfully: 3 Service Pages + 1 Blog Article.`,
      createdPages,
      createdBlog: createdBlogSlug,
    }
  } catch (err) {
    console.error('Failed generating day content:', err)
    return { ok: false, message: err instanceof Error ? err.message : 'Generation failed.' }
  }
}

export async function getAllSeoPages() {
  try {
    await ensureSeoTablesExist()
    if (process.env.DATABASE_URL) {
      const rows = await db.select().from(seoPages).orderBy(desc(seoPages.createdAt))
      if (rows && rows.length > 0) return rows
    }
  } catch (err) {
    // DB offline
  }
  return globalSeoStore.__seoPages || []
}

export async function getAllBlogPosts() {
  try {
    await ensureSeoTablesExist()
    if (process.env.DATABASE_URL) {
      const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt))
      if (rows && rows.length > 0) return rows
    }
  } catch (err) {
    // DB offline
  }
  return globalSeoStore.__seoBlogs || []
}

export async function getSeoPageBySlug(slug: string) {
  try {
    await ensureSeoTablesExist()
    if (process.env.DATABASE_URL) {
      const rows = await db.select().from(seoPages).where(eq(seoPages.slug, slug))
      if (rows.length > 0) return rows[0]
    }
  } catch (err) {
    // DB offline
  }
  return (globalSeoStore.__seoPages || []).find((p) => p.slug === slug) || null
}

export async function getBlogPostBySlug(slug: string) {
  try {
    await ensureSeoTablesExist()
    if (process.env.DATABASE_URL) {
      const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug))
      if (rows.length > 0) return rows[0]
    }
  } catch (err) {
    // DB offline
  }
  return (globalSeoStore.__seoBlogs || []).find((b) => b.slug === slug) || null
}

export async function deleteSeoPage(slug: string): Promise<{ ok: boolean }> {
  if (globalSeoStore.__seoPages) {
    globalSeoStore.__seoPages = globalSeoStore.__seoPages.filter((p) => p.slug !== slug)
  }
  try {
    await ensureSeoTablesExist()
    if (process.env.DATABASE_URL) {
      await db.delete(seoPages).where(eq(seoPages.slug, slug))
    }
  } catch (err) {
    // DB offline
  }
  revalidatePath('/services')
  revalidatePath('/sitemap.xml')
  revalidatePath('/admin/seo-content')
  return { ok: true }
}

export async function deleteBlogPost(slug: string): Promise<{ ok: boolean }> {
  if (globalSeoStore.__seoBlogs) {
    globalSeoStore.__seoBlogs = globalSeoStore.__seoBlogs.filter((b) => b.slug !== slug)
  }
  try {
    await ensureSeoTablesExist()
    if (process.env.DATABASE_URL) {
      await db.delete(blogPosts).where(eq(blogPosts.slug, slug))
    }
  } catch (err) {
    // DB offline
  }
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')
  revalidatePath('/admin/seo-content')
  return { ok: true }
}
