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

// City-specific housing construction and environmental dynamics for high-ranking localized content
function getCityArchitecturalContext(city: string): {
  neighborhoodTraits: string
  plumbingVulnerability: string
  weatherFactor: string
  commonLossScenario: string
} {
  const c = city.toLowerCase()
  if (c.includes('beaverton')) {
    return {
      neighborhoodTraits: '1960s to 1980s ranch and split-level homes across Cedar Hills and Murrayhill, many built on concrete slab foundations with embedded copper lines',
      plumbingVulnerability: 'underslab copper pinhole leaks and aging water heater supply connections in finished single-level basements',
      weatherFactor: 'seasonal high groundwater and saturated soil conditions near Fanno Creek greenways during extended November through March rains',
      commonLossScenario: 'unnoticed slab leaks migrating beneath laminate and engineered hardwood flooring into adjacent drywall base plates',
    }
  }
  if (c.includes('tigard') || c.includes('tualatin')) {
    return {
      neighborhoodTraits: 'mix of 1970s suburban developments and contemporary multi-story residences near the Tualatin River basin and Bull Mountain slopes',
      plumbingVulnerability: 'sump pump mechanical failures during heavy storm power surges, crawlspace moisture barrier deterioration, and polybutylene piping',
      weatherFactor: 'shallow water tables and severe winter rainfall causing hydrostatic pressure against foundation stem walls',
      commonLossScenario: 'crawlspace standing water entering HVAC floor ducting and causing secondary microbial spores in subfloors',
    }
  }
  if (c.includes('hillsboro') || c.includes('aloha')) {
    return {
      neighborhoodTraits: 'rapidly expanding residential master-planned subdivisions, high-density townhome developments, and modern two-story family homes',
      plumbingVulnerability: 'upper-level PEX fitting failures, washing machine braided stainless line bursts, and high-pressure tankless water heater valve leaks',
      weatherFactor: 'open valley frost exposure during sub-freezing winter Arctic fronts followed by rapid warming cycles',
      commonLossScenario: 'second-story bathroom supply line ruptures cascading down through ceiling drywall into main-level open concept living spaces',
    }
  }
  if (c.includes('lake oswego') || c.includes('west linn')) {
    return {
      neighborhoodTraits: 'custom hillside estates, multi-level luxury properties, and older lakeside cottages with intricate multilevel framing and finished daylight basements',
      plumbingVulnerability: 'complex multi-zone radiant floor heating line failures, hillside groundwater infiltration, and premium hardwood subfloor saturation',
      weatherFactor: 'steep terrain stormwater runoff and high humidity levels surrounding Oswego Lake and the Willamette River corridor',
      commonLossScenario: 'subsurface water penetration behind downhill retaining foundation walls requiring specialized non-invasive structural drying',
    }
  }
  if (c.includes('gresham') || c.includes('troutdale')) {
    return {
      neighborhoodTraits: 'established East County neighborhoods, mid-century daylight ranches, and properties directly exposed to the Columbia River Gorge wind corridor',
      plumbingVulnerability: 'exterior wall pipe freeze-ups, hose bib ruptures within siding cavities, and attic plumbing line freezing during sub-zero gorge winds',
      weatherFactor: 'severe winter east winds bringing prolonged sub-freezing temperatures followed by rapid post-freeze thaws',
      commonLossScenario: 'exterior wall copper pipe splits thawing unnoticed during working hours, flooding main floor living areas and crawlspaces',
    }
  }
  // Default Portland Proper (NE/SE/NW/SW)
  return {
    neighborhoodTraits: 'historic 1910s to 1940s Craftsman bungalows, classic Victorian homes, and mid-century residences across Hawthorne, Laurelhurst, Sellwood, and the West Hills',
    plumbingVulnerability: 'unreinforced masonry daylight basements, gravity storm drain backups, galvanized supply piping, and aging clay sewer laterals',
    weatherFactor: 'frequent atmospheric river storm cycles delivering multi-day rainfall that saturates older foundation footings and gravity drainage networks',
    commonLossScenario: 'perimeter basement foundation seepage, sewer line backups during storm surges, and hidden bathroom plumbing leaks behind lath and plaster walls',
  }
}

// Fallback high-quality localized template generator in case AI API key is not present or rate limited
function generateDeterministicServicePage(keyword: string, city: string, theme: string, dayNumber: number) {
  const slug = slugify(`${keyword}-${city}`)
  const geo = getCityArchitecturalContext(city)

  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    slug,
    title: keyword,
    subtitle: `24/7 Rapid-response emergency mitigation and restoration in ${city}, OR. IICRC S500 certified technicians, 90-minute arrival, and direct insurance billing.`,
    heroImage: '/images/water-damage.png',
    keyword,
    city,
    serviceCategory: 'Water Damage Restoration',
    description: [
      `When property owners in ${city} experience an emergency requiring **${keyword.toLowerCase()}**, prompt certified mitigation from our [emergency water extraction](/services/water-damage) team is essential to avoid permanent structural degradation. Above & Beyond Restoration delivers 24/7/365 emergency response with an on-site arrival guarantee of **90 minutes or less**. In ${city}, homes characterized by ${geo.neighborhoodTraits} are particularly susceptible to ${geo.commonLossScenario}. Our rapid extraction protocols halt water migration before secondary mold growth develops.`,
      `Managing structural restoration in ${city} demands specialized familiarity with regional construction methods. Whether dealing with ${geo.plumbingVulnerability} or mitigating exterior water intrusion caused by ${geo.weatherFactor}, our IICRC-certified crews deploy commercial thermal infrared cameras, penetrating moisture meters, and industrial Low-Grain Refrigerant (LGR) dehumidifiers. For extensive structural recovery needs, explore our certified [mold remediation procedures](/services/mold-remediation) and non-invasive drying capabilities.`,
      `We advocate directly for property owners by documenting all moisture readings and structural damage using industry-standard Xactimate 2026 pricing. We bill your insurance carrier directly, eliminating out-of-pocket stress. Backed by our **5-Day Maximum Dry-Out Policy** on clean water losses and a **1-Year Full Workmanship Warranty** ([Oregon CCB #262371](/about)), your property is restored to pre-loss dry standard with complete peace of mind. To get an inspection within 90 minutes, request a [free on-site estimate](/contact) or call our 24/7 dispatch hotline directly.`,
    ],
    benefits: [
      '5-Day Maximum Dry-Out Charge on Clean Water',
      `90-Minute Guaranteed Emergency Dispatch in ${city}`,
      'IICRC S500 / S520 Certified Master Technicians',
      'Direct Insurance Billing & Xactimate Scoping',
      'FLIR Thermal Imaging & Non-Invasive Moisture Mapping',
      'High-Velocity Air Movers & Commercial LGR Dehumidifiers',
      'EPA-Registered Botanical Antimicrobial Sanitization',
      '100% Satisfaction Guarantee & 1-Year Workmanship Warranty',
    ],
    process: [
      { title: 'Emergency Dispatch & Immediate Arrival', description: `Our rapid response team arrives at your ${city} property within 90 minutes equipped with truck-mounted and submersible extraction systems.` },
      { title: 'Thermal Moisture Mapping & Psychrometric Profiling', description: `We inspect all affected areas using infrared thermal imaging cameras and penetrative probes to detect trapped moisture behind drywall and subflooring common in ${city} homes.` },
      { title: 'High-Volume Water Extraction', description: 'Industrial extractors remove standing water quickly from carpet, pad, subfloor, and concrete foundation slabs.' },
      { title: 'Controlled Structural Drying', description: 'Strategic placement of commercial LGR dehumidifiers and high-velocity air movers to restore relative humidity and structural materials to dry standards.' },
      { title: 'Antimicrobial Sanitization & Odor Control', description: 'Application of hospital-grade, EPA-registered botanical antimicrobials to eliminate bacteria and prevent hazardous fungal spore germination.' },
      { title: 'Final Moisture Clearance & Insurance Sign-Off', description: 'Comprehensive dry-log verification confirming 100% moisture removal, followed by insurance documentation submittal.' },
    ],
    faqs: [
      {
        q: `How quickly can Above & Beyond arrive in ${city} for ${keyword.toLowerCase()}?`,
        a: `We maintain 24/7 on-call emergency crews throughout the Portland metro area, guaranteeing on-site arrival in ${city} within 90 minutes or less with full extraction equipment.`,
      },
      {
        q: `What unique property risks affect ${city} homes during water emergencies?`,
        a: `In ${city}, properties often experience ${geo.commonLossScenario} due to ${geo.weatherFactor}. Our technicians are specifically trained in localized building construction to address these unique structural vulnerabilities without unnecessary demolition.`,
      },
      {
        q: 'Will my homeowners or commercial property insurance cover this restoration?',
        a: 'Yes. Most property insurance policies cover sudden and accidental water losses. We handle all documentation, photograph moisture readings, scope the project in Xactimate 2026, and bill your insurance company directly.',
      },
      {
        q: 'What is your 5-Day Maximum Dry-Out Guarantee?',
        a: 'For Category 1 clean water losses, we cap our drying equipment run charges at a maximum of 5 days, ensuring fast, effective structural drying without inflated costs for you or your insurance carrier.',
      },
    ],
    relatedServices: [
      { name: 'Water Damage Restoration', href: '/services/water-damage' },
      { name: 'Mold Remediation', href: '/services/mold-remediation' },
      { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
      { name: 'Demolition Services', href: '/services/demolition' },
    ],
    metaTitle: `${keyword} in ${city}, OR | 24/7 Response`,
    metaDescription: `24/7 emergency ${keyword.toLowerCase()} in ${city}, OR. 90-min response, IICRC certified, direct insurance billing. Call 503-608-2930.`,
    dayNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function generateDeterministicBlogPost(keyword: string, title: string, city: string, theme: string, dayNumber: number, relatedPageSlugs: string[] = []) {
  const slug = slugify(title)
  const geo = getCityArchitecturalContext(city)

  const serviceLinksMarkdown = relatedPageSlugs.length > 0
    ? relatedPageSlugs.map((s) => `- **[${s.replace(/-/g, ' ').toUpperCase()}](/services/${s})** — 24/7 rapid response and professional moisture mitigation`).join('\n')
    : `- **[Emergency Water Extraction in ${city}](/services/water-damage)**\n- **[Certified Mold Remediation in ${city}](/services/mold-remediation)**\n- **[Emergency Structural Demolition](/services/demolition)**`

  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    slug,
    title,
    excerpt: `Experiencing a property emergency in ${city}? Learn the essential steps to protect your structure, navigate insurance claims, and prevent mold growth in Pacific Northwest homes.`,
    category: 'Water Damage & Restoration',
    keyword,
    author: 'Tommy Bletcher — Certified Restoration Specialist',
    readTime: '6 min read',
    content: `
# ${title}

When a sudden water intrusion or disaster strikes your property in ${city}, taking immediate, methodical action is the single most critical factor determining whether building materials can be saved or suffer irreversible structural failure. At **Above & Beyond Restoration** (CCB #262371), our IICRC-certified crews provide 24/7 emergency response across the Portland metropolitan area with a guaranteed **90-minute on-site response time**.

In ${city}, residential and commercial properties characterized by ${geo.neighborhoodTraits} face heightened vulnerability to ${geo.commonLossScenario}. Understanding the physical dynamics of moisture migration in the Pacific Northwest allows property owners to mitigate damage before hazardous mold colonies establish.

---

## Why the First 24 to 48 Hours Are Critical in Oregon

Water damage behaves aggressively in our damp climate. Within the first hour of a pipe burst, appliance leak, or groundwater surge caused by ${geo.weatherFactor}, moisture penetrates deep into subfloors, wall studs, and insulation cavities.

Key degradation timelines:
- **Within 1–24 Hours:** Drywall absorbs moisture through capillary action, causing paint bubbling, baseboard warping, and hardwood floor plank cupping.
- **Within 24–48 Hours:** Fungi and mold spores begin active germination on damp organic building materials when indoor relative humidity exceeds 60%.
- **Within 48–72 Hours:** Secondary damage accelerates; structural framing weakens, drywall sags, and bio-contaminants proliferate.

> **Emergency Tip:** If you have active water pouring into your property, locate your main shut-off valve immediately and turn it clockwise until closed. Then call Above & Beyond Restoration at **[503-608-2930](tel:5036082930)** for immediate extraction.

---

## 5 Essential Steps to Take Right Now

1. **Ensure Electrical & Personal Safety:** Never step into standing water if electrical outlets or appliances are submerged. If safely accessible, switch off the main electrical breaker.
2. **Stop the Water Source:** Shut off the main water valve or supply line leading to the affected fixture.
3. **Document the Damage for Insurance:** Before moving wet belongings, photograph and video all standing water, waterlines on drywall, and affected property.
4. **Call a Certified Restoration Company:** Household box fans and shop vacuums cannot extract trapped subfloor moisture. Professional Low-Grain Refrigerant (LGR) dehumidifiers and thermal imaging are required.
5. **Notify Your Insurance Carrier:** Report the loss and inform them that **Above & Beyond Restoration** is handling the emergency structural mitigation under industry-standard Xactimate pricing.

---

## Localized Emergency Services & Coverage in ${city}

If you need immediate emergency mitigation in ${city} or surrounding communities, our specialized local response teams are on standby:

${serviceLinksMarkdown}

For comprehensive parent service overviews, learn more about our [Portland water damage restoration services](/services/water-damage), our certified [mold remediation procedures](/services/mold-remediation), or explore our complete [service guides directory](/services/guides).

---

## How Above & Beyond Restoration Protects Your Property

- **90-Minute Emergency Dispatch:** Immediate extraction crews dispatched across ${city} and Portland Metro.
- **5-Day Maximum Dry-Out Guarantee:** We never artificially extend drying cycles; on clean water losses, equipment fees are capped at 5 days.
- **100% Direct Insurance Billing:** We submit detailed line-item scopes using Xactimate pricing directly to your adjuster.
- **1-Year Workmanship Warranty:** We stand behind all completed mitigation and reconstruction work.

---

## Frequently Asked Questions

### How quickly can Above & Beyond respond to an emergency in ${city}?
Our emergency crews are on call 24 hours a day, 365 days a year, with a guaranteed arrival time of 90 minutes or less anywhere in ${city} and the greater Portland metropolitan area.

### Can water-damaged hardwood floors be dried without replacement?
In many cases, yes. By utilizing specialized high-pressure injection mat drying systems that draw moisture out of the hardwood planks and subfloor, we frequently save hardwood floors from permanent replacement.

### How do you handle insurance billing for restoration?
We work directly with all major insurance carriers, documenting all moisture levels and damage in Xactimate software to ensure smooth, direct claim settlement with zero hassle for the homeowner.
    `,
    faqs: [
      {
        q: `What should I do first during a water leak in ${city}?`,
        a: `Turn off the main water shut-off valve immediately, turn off electrical power if safe to do so, and call 503-608-2930 for 90-minute emergency extraction in ${city}.`,
      },
      {
        q: `Why are ${city} homes uniquely susceptible to water damage?`,
        a: `Properties in ${city} often feature ${geo.neighborhoodTraits}, making them vulnerable to ${geo.commonLossScenario} during ${geo.weatherFactor}. Prompt professional structural drying prevents costly secondary structural repairs.`,
      },
      {
        q: 'How does Above & Beyond bill insurance for property restoration?',
        a: 'We document all damage with thermal imaging and psychrometric moisture logs, then submit itemized Xactimate estimates directly to your insurance company so you do not pay out-of-pocket for covered losses.',
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
  const geo = getCityArchitecturalContext(dayItem.targetCity)

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
            prompt: `You are the lead restoration specialist and master SEO architect for Above & Beyond Restoration in Portland, OR (CCB #262371, Phone 503-608-2930, 90-min emergency response, 5-day max dryout guarantee).

CRITICAL ANTI-DUPLICATION RULE:
Do NOT create a generic find-and-replace page. Craft a 100% unique, authoritative, deep landing page tailored specifically for:
- Target Keyword: "${kw}"
- City / Neighborhood: "${dayItem.targetCity}"
- Local Housing Dynamics: ${geo.neighborhoodTraits}
- Specific Vulnerability: ${geo.plumbingVulnerability}
- Local Climate & Weather: ${geo.weatherFactor}
- Typical Scenario: ${geo.commonLossScenario}

MANDATORY LINK SPACING & NATURAL PLACEMENT:
- In the description, provide 3 rich paragraphs.
- Space your internal hyperlinks evenly: exactly ONE contextual hyperlink per paragraph.
- NEVER cluster multiple links together in the same sentence.
- Paragraph 1: Link naturally to [emergency water extraction](/services/water-damage) or [Portland water damage restoration](/services/water-damage).
- Paragraph 2: Link naturally to [certified mold remediation](/services/mold-remediation) or [emergency fire damage repair](/services/fire-damage).
- Paragraph 3: Link naturally to [free on-site inspection & estimate](/contact) or [service guides directory](/services/guides).

Ensure high semantic density for local AI search (Perplexity, ChatGPT, Gemini) and Google organic search. Include 4 to 6 localized, non-generic FAQs with detailed answers.`,
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
            const { id: _ignoreId, ...insertData } = pageData
            await db.insert(seoPages).values(insertData)
          }
        }
      } catch (dbErr) {
        console.error('[SEO DB Insert Error - seoPages]:', dbErr)
      }

      createdPages.push(pageData.slug)
    }

    // 2. Generate 1 Daily Blog Post linking to the 3 newly created sub-pages
    let blogData = generateDeterministicBlogPost(
      dayItem.blogKeyword,
      dayItem.blogTitle,
      dayItem.targetCity,
      dayItem.theme,
      dayNumber,
      createdPages
    )

    if (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.AI_GATEWAY_KEY) {
      try {
        const { output } = await generateText({
          model: 'google/gemini-2.5-flash',
          output: Output.object({ schema: blogPostAiSchema }),
          prompt: `You are the senior restoration specialist writing a deep, authoritative educational guide for Above & Beyond Restoration (Portland, OR metro, CCB #262371, Phone 503-608-2930).

Article Theme: "${dayItem.blogTitle}"
Focus Keyword: "${dayItem.blogKeyword}"
Location: "${dayItem.targetCity}"
Housing Context: ${geo.neighborhoodTraits}
Weather Context: ${geo.weatherFactor}

MANDATORY INTERLINKING TRIANGLE:
You MUST contextually cite and hyperlink the 3 newly published landing pages for this cluster in the body:
${createdPages.map((p) => `- [${p.replace(/-/g, ' ')}](/services/${p})`).join('\n')}
AND link to the parent hub: [Portland water damage restoration](/services/water-damage).

Write a complete 1,200+ word markdown guide formatted with H2, H3 subheadings, numbered actionable steps, psychrometric drying principles, and 3-5 hyper-local FAQs.`,
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
          const { id: _ignoreId, ...insertBlogData } = blogData
          await db.insert(blogPosts).values(insertBlogData)
        }

        await db.update(seoContentSchedule).set({
          status: 'generated',
          generatedAt: new Date(),
        }).where(eq(seoContentSchedule.dayNumber, dayNumber))
      }
    } catch (dbErr) {
      console.error('[SEO DB Insert Error - blogPosts]:', dbErr)
    }

    createdBlogSlug = blogData.slug

    revalidatePath('/services')
    revalidatePath('/services/guides')
    revalidatePath('/services/[slug]', 'page')
    revalidatePath('/blog')
    revalidatePath('/blog/[slug]', 'page')
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
    console.error('[SEO DB Query Error - getAllSeoPages]:', err)
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
    console.error('[SEO DB Query Error - getAllBlogPosts]:', err)
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
    console.error('[SEO DB Query Error - getSeoPageBySlug]:', err)
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
    console.error('[SEO DB Query Error - getBlogPostBySlug]:', err)
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
