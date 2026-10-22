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
        return rows.map((r) => {
          const defaultItem = DEFAULT_30_DAY_STRATEGY.find((d) => d.dayNumber === r.dayNumber)
          return {
            dayNumber: r.dayNumber,
            theme: r.theme,
            targetCity: r.targetCity,
            serviceCategory: defaultItem?.serviceCategory || (r.theme.toLowerCase().includes('mold') ? 'Mold Remediation' : r.theme.toLowerCase().includes('fire') || r.theme.toLowerCase().includes('smoke') ? 'Fire Damage Restoration' : r.theme.toLowerCase().includes('demolition') ? 'Demolition Services' : 'Water Damage Restoration'),
            pageKeywords: Array.isArray(r.pageKeywords) && r.pageKeywords.length === 3
              ? (r.pageKeywords as [string, string, string])
              : (defaultItem?.pageKeywords || ['Emergency Water Damage', 'Emergency Water Extraction', 'Emergency Water Removal']),
            blogKeyword: r.blogKeyword,
            blogTitle: r.blogTitle || r.blogKeyword,
          }
        })
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
  if (c.includes('tigard') || c.includes('tualatin') || c.includes('sherwood')) {
    return {
      neighborhoodTraits: 'mix of established residential neighborhoods and contemporary multi-story residences near the Tualatin River basin, Bull Mountain, and Sherwood vineyards',
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
      neighborhoodTraits: 'custom hillside estates, multi-level luxury properties, and lakeside residences with intricate multilevel framing and finished daylight basements',
      plumbingVulnerability: 'complex multi-zone radiant floor heating line failures, hillside groundwater infiltration, and premium hardwood subfloor saturation',
      weatherFactor: 'steep terrain stormwater runoff and high humidity levels surrounding Oswego Lake and the Willamette River corridor',
      commonLossScenario: 'subsurface water penetration behind downhill retaining foundation walls requiring specialized non-invasive structural drying',
    }
  }
  if (c.includes('oregon city') || c.includes('clackamas') || c.includes('milwaukie')) {
    return {
      neighborhoodTraits: 'historic hillside residences, established mid-century homes, and suburban developments throughout Clackamas County',
      plumbingVulnerability: 'aging galvanized plumbing, main line sewer backups, and perimeter footing drain blockages',
      weatherFactor: 'heavy Pacific Northwest atmospheric rivers causing hillside soil saturation and localized runoff surges',
      commonLossScenario: 'gravity storm drain backups and hidden bathroom plumbing leaks within older framing cavities',
    }
  }
  if (c.includes('vancouver') || c.includes('camas')) {
    return {
      neighborhoodTraits: 'mix of historic Clark County properties, Columbia River view homes, and newer master-planned developments in East Vancouver and Camas',
      plumbingVulnerability: 'freezing exterior wall plumbing lines during Columbia River Gorge east wind storms and crawlspace vapor barrier degradation',
      weatherFactor: 'prolonged sub-freezing Gorge winter winds followed by rapid sudden thaw cycles',
      commonLossScenario: 'exterior wall pipe splits thawing unnoticed during work hours, flooding main floor living areas and crawlspaces',
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

// Clean keyword and city helpers to prevent duplicate location strings
function cleanKeywordTitle(keyword: string, city: string): string {
  const cityClean = city.replace(/,?\s*(OR|WA)$/i, '').trim()
  return keyword.replace(new RegExp(`\\s*${cityClean}\\s*(OR|WA)?`, 'gi'), '').trim()
}

function generateCleanSlug(keyword: string, city: string): string {
  const cleanKw = cleanKeywordTitle(keyword, city)
  const cleanCity = city.replace(/,?\s*(OR|WA)$/i, '').trim()
  return slugify(`${cleanKw}-${cleanCity}`)
}

// 4 Distinct Category Fallback Generators
function generateDeterministicServicePage(
  keyword: string,
  city: string,
  theme: string,
  dayNumber: number,
  serviceCategory: string = 'Water Damage Restoration'
) {
  const cleanTitle = cleanKeywordTitle(keyword, city)
  const slug = generateCleanSlug(keyword, city)
  const geo = getCityArchitecturalContext(city)
  const cat = serviceCategory.toLowerCase()

  // 1. MOLD REMEDIATION
  if (cat.includes('mold')) {
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      slug,
      title: `${cleanTitle} in ${city}`,
      subtitle: `Certified IICRC S520 mold containment, physical removal of contaminated materials, EPA botanical treatment, and Kilz barrier encapsulation in ${city}. 90-minute dispatch.`,
      heroImage: '/images/mold-remediation.png',
      keyword: `${cleanTitle} in ${city}`,
      city,
      serviceCategory: 'Mold Remediation',
      description: [
        `When property owners in ${city} discover persistent moisture or fungal growth requiring **${cleanTitle.toLowerCase()}**, prompt certified mitigation from our [certified mold remediation](/services/mold-remediation) team is essential to protect indoor air quality and structural integrity. Above & Beyond Restoration delivers 24/7 emergency response with an on-site arrival guarantee of **90 minutes or less**. In ${city}, properties featuring ${geo.neighborhoodTraits} are especially prone to ${geo.commonLossScenario}, where hidden moisture breeds aggressive fungal colonies inside wall cavities and subfloors.`,
        `Effective mold eradication requires far more than cosmetic surface spraying. Following strict **IICRC S520 protocols**, our certified technicians erect 6-mil polyethylene containment chambers maintained under negative air pressure with industrial HEPA air scrubbers. Contaminated porous building materials—including ruined drywall, saturated fiberglass insulation, and compromised baseboards—are physically cut out, double-bagged, and safely disposed of. Structural framing lumber is HEPA-vacuumed, wire-brushed, and treated with hospital-grade EPA-registered botanical antimicrobials. For underlying plumbing leaks, our [emergency water extraction](/services/water-damage) team ensures the structure is completely dry.`,
        `To guarantee permanent protection against spore re-germination, we apply commercial fungicidal encapsulant sealants and stain-blocking barrier coatings (such as Kilz and antimicrobial sealers) over all treated framing. We document the entire protocol with psychrometric logs and digital moisture mapping, billing your insurance carrier directly using industry-standard Xactimate 2026 pricing. Backed by our **1-Year Workmanship Warranty** ([licensed Oregon CCB #262371](/about)), your property is restored to healthy, certified clearance standards. Schedule a [free on-site inspection](/contact) or call our 24/7 hotline directly.`,
      ],
      benefits: [
        'Full IICRC S520 Containment & Negative Air Pressure',
        'Physical Removal of Contaminated Drywall & Porous Materials',
        'Commercial HEPA Air Scrubbers & Airflow Filtration',
        'EPA-Registered Botanical Antimicrobial Sanitization',
        'Fungicidal Barrier Sealing & Kilz Stain Encapsulation',
        'FLIR Thermal Moisture & Infrared Colony Mapping',
        '100% Direct Insurance Billing with Xactimate 2026 Scoping',
        '1-Year Workmanship Warranty & Oregon CCB #262371 Certified',
      ],
      process: [
        { title: 'Emergency Dispatch & Thermal Inspection', description: `Our certified mold technicians arrive at your ${city} property within 90 minutes with thermal imaging cameras and penetrative moisture meters to map contamination.` },
        { title: 'Containment Setup & Negative Air Isolation', description: 'We erect sealed 6-mil poly containment barriers and vent HEPA air scrubbers outdoors to prevent airborne mold spores from spreading into unaffected rooms.' },
        { title: 'Physical Removal of Contaminated Materials', description: 'Porous materials with deep fungal hyphae (water-damaged drywall, insulation, tack strips) are safely removed, bagged, and eliminated from the property.' },
        { title: 'HEPA Vacuuming & Framing Abrasion', description: 'Exposed framing studs and joists are thoroughly HEPA vacuumed, wire-brushed, and sanded to completely remove embedded fungal roots.' },
        { title: 'EPA Botanical Antimicrobial Treatment', description: 'Application of hospital-grade, EPA-registered botanical antimicrobials to eliminate residual spores and bacteria.' },
        { title: 'Encapsulation & Post-Remediation Clearance', description: 'Application of commercial fungicidal encapsulant barrier coatings (Kilz/antimicrobial sealants) followed by dry-log verification and direct insurance submittal.' },
      ],
      faqs: [
        {
          q: `Why must moldy drywall and insulation be physically removed rather than just sprayed in ${city}?`,
          a: `Mold roots (hyphae) penetrate deep into porous organic materials like drywall paper and fiberglass insulation. Surface spraying only kills superficial spores, leaving the root system alive. Under IICRC S520 industry standards, contaminated porous materials must be physically cut out and removed to guarantee permanent eradication.`,
        },
        {
          q: 'What types of antimicrobial sealants and coatings do you apply after mold removal?',
          a: 'We apply hospital-grade EPA-registered botanical antimicrobials to disinfect the framing, followed by commercial fungicidal encapsulant coatings (including Kilz and specialized antimicrobial barrier sealers) that lock into wood pores and permanently inhibit fungal re-growth.',
        },
        {
          q: 'Will homeowners or commercial insurance cover mold remediation?',
          a: 'Yes, when mold results from a sudden and accidental covered peril such as a burst pipe or appliance line rupture. We document all moisture readings and damage in Xactimate 2026 software and bill your insurance company directly.',
        },
        {
          q: 'How long does a full mold containment and remediation process take?',
          a: 'A standard IICRC S520 containment, demolition, sanitization, and encapsulant dry cycle takes 2 to 4 days, ensuring complete clearance without compromising property safety.',
        },
      ],
      relatedServices: [
        { name: 'Mold Remediation', href: '/services/mold-remediation' },
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Demolition Services', href: '/services/demolition' },
        { name: 'Service Guides Directory', href: '/services/guides' },
      ],
      metaTitle: `${cleanTitle} in ${city} | 24/7 Certified Response`,
      metaDescription: `Certified ${cleanTitle.toLowerCase()} in ${city}. IICRC S520 containment, physical material removal, EPA botanical sanitization. Call 503-608-2930.`,
      dayNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // 2. FIRE & SMOKE DAMAGE RESTORATION
  if (cat.includes('fire') || cat.includes('smoke')) {
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      slug,
      title: `${cleanTitle} in ${city}`,
      subtitle: `24/7 Emergency fire damage restoration, soot sponge cleaning, thermal fogging, and smoke deodorization in ${city}. 90-minute dispatch.`,
      heroImage: '/images/fire-damage.png',
      keyword: `${cleanTitle} in ${city}`,
      city,
      serviceCategory: 'Fire Damage Restoration',
      description: [
        `Experiencing fire or smoke loss in ${city} requires rapid intervention to prevent acidic soot and smoke residue from causing irreversible etching on building surfaces. Above & Beyond Restoration provides 24/7 emergency response with a guaranteed arrival time of **90 minutes or less**. In ${city}, homes with ${geo.neighborhoodTraits} can suffer severe smoke migration through wall framing cavities and attic spaces during a fire event.`,
        `Our certified restoration specialists deploy chemical soot sponges, HEPA air scrubbers, and industrial thermal fogging to neutralize microscopic odor molecules embedded in drywall, wood framing, and HVAC systems. If firefighting efforts left standing water, our certified [emergency water extraction](/services/water-damage) crews immediately remove water and deploy LGR dehumidifiers to prevent secondary structural rot and mold. For damaged structural elements, we coordinate [emergency fire restoration](/services/fire-damage) and structural demolition.`,
        `We work directly alongside your insurance adjuster, documenting all damaged contents and structural losses using industry-standard Xactimate 2026 pricing. Backed by our **1-Year Workmanship Warranty** ([licensed Oregon CCB #262371](/about)), we restore your property safely to pre-loss condition. For an emergency inspection, request a [free on-site estimate](/contact) or call our 24/7 hotline.`,
      ],
      benefits: [
        '90-Minute Emergency Dispatch Across Portland Metro',
        'Chemical Soot Sponge & Dry Surface Cleaning',
        'Thermal Fogging & Hydroxyl Smoke Odor Removal',
        'Industrial HEPA Air Scrubbers & Carbon Filtration',
        'Emergency Water Extraction & Structural Drying',
        'HVAC Duct Decontamination & Air Quality Clearance',
        '100% Direct Insurance Billing via Xactimate 2026',
        '1-Year Workmanship Warranty & Oregon CCB #262371',
      ],
      process: [
        { title: 'Emergency Dispatch & Structural Assessment', description: `Our emergency fire crew arrives in ${city} within 90 minutes to secure the structure and assess fire, smoke, and water damage.` },
        { title: 'Emergency Water Extraction & Drying', description: 'Immediate extraction of standing water from firefighting efforts using industrial extractors and LGR dehumidifiers.' },
        { title: 'Soot Removal & Surface Decontamination', description: 'Chemical soot sponges and specialized cleaning agents remove corrosive soot from walls, ceilings, and fixtures.' },
        { title: 'Thermal Fogging & Smoke Deodorization', description: 'Industrial thermal foggers and hydroxyl generators neutralize deep smoke odors at the molecular level.' },
        { title: 'HVAC Duct & Air Cleaning', description: 'HEPA air filtration and duct cleaning to eliminate lingering smoke particles and ensure safe air quality.' },
        { title: 'Final Clearance & Insurance Billing', description: 'Complete restoration walk-through, clearance verification, and direct claim submission to your insurance carrier.' },
      ],
      faqs: [
        {
          q: `How quickly should soot and smoke damage be cleaned after a fire in ${city}?`,
          a: 'Within 24 to 48 hours. Acidic soot residue rapidly etches glass, tarnishes metals, and permanently discolors drywall and plastics if not neutralized promptly with professional chemical sponges.',
        },
        {
          q: 'Can smoke odors be completely removed from framing and drywall?',
          a: 'Yes. We utilize industrial thermal fogging, ozone, and hydroxyl generators that penetrate deep into porous wood studs to neutralize odor compounds at the molecular level.',
        },
        {
          q: 'Do you handle both fire damage and the water damage from firefighting efforts?',
          a: 'Yes. Above & Beyond Restoration is fully equipped for complete dual-loss mitigation, extracting firefighting water and restoring fire/smoke damage under one seamless project.',
        },
      ],
      relatedServices: [
        { name: 'Fire Damage Restoration', href: '/services/fire-damage' },
        { name: 'Smoke Damage Restoration', href: '/services/smoke-damage' },
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Service Guides Directory', href: '/services/guides' },
      ],
      metaTitle: `${cleanTitle} in ${city} | 24/7 Fire & Smoke Response`,
      metaDescription: `24/7 ${cleanTitle.toLowerCase()} in ${city}. Rapid soot removal, smoke deodorization, and direct insurance billing. Call 503-608-2930.`,
      dayNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // 3. DEMOLITION SERVICES
  if (cat.includes('demolition')) {
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      slug,
      title: `${cleanTitle} in ${city}`,
      subtitle: `Safe selective non-structural demolition, flood material strip-out, and debris removal in ${city}. Oregon CCB #262371 certified.`,
      heroImage: '/images/demolition.png',
      keyword: `${cleanTitle} in ${city}`,
      city,
      serviceCategory: 'Demolition Services',
      description: [
        `When residential or commercial properties in ${city} suffer severe water, fire, or microbial damage, professional **${cleanTitle.toLowerCase()}** from our [certified demolition services](/services/demolition) team ensures safe, controlled removal of compromised structural materials. Above & Beyond Restoration delivers rapid dispatch with an arrival time of **90 minutes or less**. In ${city}, homes with ${geo.neighborhoodTraits} require methodical strip-out protocols to preserve non-damaged framing.`,
        `Our crews establish dust containment barriers and utilize HEPA air scrubbers to prevent airborne particulates from migrating into living areas. We carefully remove saturated drywall, buckled hardwood flooring, compromised subfloors, and contaminated insulation down to clean structural studs. If secondary fungal issues are present, our [certified mold remediation](/services/mold-remediation) team sanitizes remaining framing with EPA-registered botanical antimicrobials.`,
        `We provide complete haul-away and disposal, leaving the site clean, dry, and ready for reconstruction. All scopes are itemized in Xactimate 2026 pricing for direct submission to your insurance adjuster. Backed by our **1-Year Workmanship Warranty** ([licensed Oregon CCB #262371](/about)), your project is handled with precision. Request a [free on-site estimate](/contact) or call 503-608-2930 today.`,
      ],
      benefits: [
        'Selective Non-Structural Interior Strip-Out',
        'Dust Containment & HEPA Negative Air Filtration',
        'Safe Removal of Water-Damaged Drywall & Flooring',
        'Debris Hauling & Responsible Disposal',
        'Framing Preparation & Antimicrobial Sanitization',
        'Direct Insurance Billing with Xactimate 2026',
        'Licensed & Insured Oregon CCB #262371',
        '100% Satisfaction & 1-Year Workmanship Warranty',
      ],
      process: [
        { title: 'Site Inspection & Safety Planning', description: `Our demolition crew assesses structural integrity in ${city} and identifies non-bearing partitions and utility shut-offs.` },
        { title: 'Containment & Negative Air Setup', description: 'Installation of plastic dust barriers and HEPA filtration units to protect clean zones of the building.' },
        { title: 'Controlled Selective Strip-Out', description: 'Methodical removal of damaged drywall, flooring, trim, and insulation without damaging underlying framing.' },
        { title: 'HEPA Vacuuming & Framing Scrubbing', description: 'Removal of all demolition dust and debris from wood studs and concrete foundation slabs.' },
        { title: 'Antimicrobial Sanitization', description: 'Application of botanical antimicrobials to protect exposed wood framing against fungal growth.' },
        { title: 'Debris Disposal & Final Clearance', description: 'Complete haul-away and site cleanup, leaving the property ready for reconstruction.' },
      ],
      faqs: [
        {
          q: `What is selective non-structural demolition in ${city}?`,
          a: 'Selective demolition involves removing only damaged interior materials (such as drywall, wet carpet, buckled flooring, and cabinetry) while preserving load-bearing structural walls, joists, and foundation elements.',
        },
        {
          q: 'How do you control dust during demolition?',
          a: 'We isolate work zones with heavy plastic zip-wall containment barriers and run industrial HEPA air scrubbers under negative pressure to capture 99.97% of airborne dust and particulates.',
        },
      ],
      relatedServices: [
        { name: 'Demolition Services', href: '/services/demolition' },
        { name: 'Water Damage Restoration', href: '/services/water-damage' },
        { name: 'Mold Remediation', href: '/services/mold-remediation' },
        { name: 'Service Guides Directory', href: '/services/guides' },
      ],
      metaTitle: `${cleanTitle} in ${city} | 24/7 Demolition Response`,
      metaDescription: `Professional ${cleanTitle.toLowerCase()} in ${city}. Safe selective strip-out, dust containment, direct insurance billing. Call 503-608-2930.`,
      dayNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // 4. DEFAULT: WATER DAMAGE RESTORATION
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    slug,
    title: `${cleanTitle} in ${city}`,
    subtitle: `24/7 Rapid-response emergency water mitigation, high-volume extraction, and structural drying in ${city}, OR. 90-minute arrival and direct insurance billing.`,
    heroImage: '/images/water-damage.png',
    keyword: `${cleanTitle} in ${city}`,
    city,
    serviceCategory: 'Water Damage Restoration',
    description: [
      `When property owners in ${city} experience an emergency requiring **${cleanTitle.toLowerCase()}**, prompt certified mitigation from our [emergency water extraction](/services/water-damage) team is essential to avoid permanent structural degradation. Above & Beyond Restoration delivers 24/7/365 emergency response with an on-site arrival guarantee of **90 minutes or less**. In ${city}, homes characterized by ${geo.neighborhoodTraits} are particularly susceptible to ${geo.commonLossScenario}. Our rapid extraction protocols halt water migration before secondary mold growth develops.`,
      `Managing structural restoration in ${city} demands specialized familiarity with regional construction methods. Whether dealing with ${geo.plumbingVulnerability} or mitigating exterior water intrusion caused by ${geo.weatherFactor}, our IICRC-certified crews deploy commercial thermal infrared cameras, penetrating moisture meters, and industrial Low-Grain Refrigerant (LGR) dehumidifiers. For extensive structural recovery needs, explore our certified [mold remediation procedures](/services/mold-remediation) and non-invasive drying capabilities.`,
      `We advocate directly for property owners by documenting all moisture readings and structural damage using industry-standard Xactimate 2026 pricing. We bill your insurance carrier directly, eliminating out-of-pocket stress. Backed by our **5-Day Maximum Dry-Out Policy** on clean water losses and a **1-Year Full Workmanship Warranty** ([licensed Oregon CCB #262371](/about)), your property is restored to pre-loss dry standard with complete peace of mind. To get an inspection within 90 minutes, request a [free on-site estimate](/contact) or call our 24/7 dispatch hotline directly.`,
    ],
    benefits: [
      '5-Day Maximum Dry-Out Charge on Clean Water',
      `90-Minute Guaranteed Emergency Dispatch in ${city}`,
      'IICRC S500 Certified Master Water Restorers',
      'Direct Insurance Billing & Xactimate 2026 Scoping',
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
        q: `How quickly can Above & Beyond arrive in ${city} for ${cleanTitle.toLowerCase()}?`,
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
    metaTitle: `${cleanTitle} in ${city} | 24/7 Emergency Response`,
    metaDescription: `24/7 emergency ${cleanTitle.toLowerCase()} in ${city}. 90-min response, IICRC certified, direct insurance billing. Call 503-608-2930.`,
    dayNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function generateDeterministicBlogPost(
  keyword: string,
  title: string,
  city: string,
  theme: string,
  dayNumber: number,
  relatedPageSlugs: string[] = [],
  serviceCategory: string = 'Water Damage Restoration'
) {
  const slug = slugify(title)
  const geo = getCityArchitecturalContext(city)
  const isMold = serviceCategory.toLowerCase().includes('mold')
  const isFire = serviceCategory.toLowerCase().includes('fire') || serviceCategory.toLowerCase().includes('smoke')

  const serviceLinksMarkdown = relatedPageSlugs.length > 0
    ? relatedPageSlugs.map((s) => `- **[${s.replace(/-/g, ' ').toUpperCase()}](/services/${s})** — 24/7 rapid response and professional certified mitigation`).join('\n')
    : `- **[Emergency Water Extraction in ${city}](/services/water-damage)**\n- **[Certified Mold Remediation in ${city}](/services/mold-remediation)**\n- **[Emergency Fire Damage Cleanup](/services/fire-damage)**`

  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    slug,
    title,
    excerpt: `Experiencing a property emergency in ${city}? Learn the essential steps to protect your structure, navigate insurance claims, and mitigate ${isMold ? 'mold growth' : isFire ? 'fire and smoke damage' : 'water damage'} in Pacific Northwest homes.`,
    category: serviceCategory,
    keyword,
    author: 'Tommy Bletcher — Certified Restoration Specialist',
    readTime: '6 min read',
    content: `
# ${title}

When a sudden property disaster strikes your home or business in ${city}, taking immediate, methodical action is the single most critical factor determining whether building materials can be salvaged or require extensive reconstruction. At **Above & Beyond Restoration** (CCB #262371), our certified crews provide 24/7 emergency response across the Portland metropolitan area with a guaranteed **90-minute on-site response time**.

In ${city}, residential and commercial properties characterized by ${geo.neighborhoodTraits} face heightened vulnerability to ${geo.commonLossScenario}. Understanding the physical dynamics of Pacific Northwest weather and localized construction allows property owners to mitigate damage before secondary structural degradation occurs.

---

## Why Immediate Professional Action Is Critical in Oregon

${isMold 
  ? `Mold spores proliferate rapidly in our damp Pacific Northwest climate. When moisture lingers in wall framing or crawl spaces, fungal colonies establish within 24 to 48 hours. Surface bleach only masks symptoms—true eradication under **IICRC S520 guidelines** requires physical containment, cutting out contaminated porous materials, and applying EPA botanical antimicrobials and Kilz barrier sealants.`
  : isFire 
  ? `Corrosive soot and acidic smoke residue begin etching glass, discolouring plastics, and penetrating structural framing within hours of a fire. Prompt chemical soot sponge cleaning, thermal fogging, and HEPA air filtration prevent permanent smoke odor absorption.`
  : `Water damage behaves aggressively in our damp climate. Within the first 24 hours of a pipe burst or groundwater intrusion, moisture penetrates subfloors, wall studs, and insulation cavities. Industrial LGR dehumidifiers and thermal imaging are required to halt water migration before hazardous mold colonies develop.`}

---

## 5 Essential Steps to Take Right Now

1. **Ensure Safety First:** Never enter standing water near submerged electrical outlets or fire-damaged structural framing. Switch off main breakers if safely accessible.
2. **Control the Source:** Shut off the main water shut-off valve or isolate fire/smoke hazards immediately.
3. **Document Everything for Insurance:** Photograph and video all damaged areas, standing water, waterlines, or soot residue prior to disturbance.
4. **Call a Certified Restoration Contractor:** Call Above & Beyond Restoration at **[503-608-2930](tel:5036082930)** for guaranteed 90-minute emergency dispatch.
5. **Direct Insurance Billing:** Inform your carrier that Above & Beyond Restoration is managing mitigation under industry-standard Xactimate 2026 pricing.

---

## Localized Emergency Services & Coverage in ${city}

If you need immediate emergency mitigation in ${city} or surrounding communities, our specialized local response teams are on standby:

${serviceLinksMarkdown}

For comprehensive parent service overviews, learn more about our [Portland water damage restoration services](/services/water-damage), our certified [mold remediation procedures](/services/mold-remediation), our [emergency fire damage cleanup](/services/fire-damage), or explore our complete [service guides directory](/services/guides).

---

## Frequently Asked Questions

### How quickly can Above & Beyond respond in ${city}?
Our emergency crews are on call 24 hours a day, 365 days a year, guaranteeing on-site arrival in ${city} within 90 minutes or less with full extraction and mitigation equipment.

### How do you handle insurance billing for restoration?
We work directly with all major insurance carriers, documenting all moisture levels and damage in Xactimate 2026 software to ensure smooth, direct claim settlement with zero out-of-pocket hassle for covered losses.
    `,
    faqs: [
      {
        q: `What should I do first during a property emergency in ${city}?`,
        a: `Shut off the main utility sources (water/power if safe), photograph the damage for your insurance claim, and call 503-608-2930 for 90-minute emergency dispatch in ${city}.`,
      },
      {
        q: `Why are ${city} homes uniquely vulnerable?`,
        a: `Properties in ${city} often feature ${geo.neighborhoodTraits}, making them vulnerable to ${geo.commonLossScenario} during ${geo.weatherFactor}. Prompt certified mitigation prevents costly structural reconstruction.`,
      },
      {
        q: 'How does Above & Beyond bill insurance for property restoration?',
        a: 'We document all damage with thermal imaging and psychrometric moisture logs, then submit itemized Xactimate 2026 estimates directly to your insurance carrier with zero upfront fees.',
      },
    ],
    heroImage: '/images/why-choose-us-team.png',
    metaTitle: `${title} | Above & Beyond Blog`,
    metaDescription: `Expert restoration guidance for ${keyword} in ${city}. Learn key safety steps, mitigation protocols, and insurance claim tips. Call 503-608-2930.`,
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
      let pageData = generateDeterministicServicePage(
        kw,
        dayItem.targetCity,
        dayItem.theme,
        dayNumber,
        dayItem.serviceCategory
      )

      // Try AI enhancement if environment has key
      if (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.AI_GATEWAY_KEY) {
        try {
          const isMold = dayItem.serviceCategory.toLowerCase().includes('mold')
          const isFire = dayItem.serviceCategory.toLowerCase().includes('fire') || dayItem.serviceCategory.toLowerCase().includes('smoke')
          const isDemo = dayItem.serviceCategory.toLowerCase().includes('demolition')

          const { output } = await generateText({
            model: 'google/gemini-2.5-flash',
            output: Output.object({ schema: servicePageAiSchema }),
            prompt: `You are the lead restoration specialist and master SEO architect for Above & Beyond Restoration LLC in Portland, OR (CCB #262371, Phone 503-608-2930, 90-min emergency response, 5-day max dryout guarantee on clean water).

CRITICAL ANTI-DUPLICATION & INDUSTRY PROTOCOL RULES:
- Target Keyword: "${kw}"
- Service Category: "${dayItem.serviceCategory}"
- Target City: "${dayItem.targetCity}"
- Local Housing Dynamics: ${geo.neighborhoodTraits}
- Specific Vulnerability: ${geo.plumbingVulnerability}
- Local Climate & Weather: ${geo.weatherFactor}
- Typical Scenario: ${geo.commonLossScenario}

CATEGORY SPECIFIC INSTRUCTIONS:
${isMold ? `
- THIS IS A MOLD REMEDIATION PAGE (NOT just water drying).
- MUST detail IICRC S520 containment chambers under negative air pressure with HEPA air scrubbers.
- MUST detail physical removal of unsalvageable contaminated porous materials (drywall, insulation, baseboards).
- MUST detail HEPA vacuuming, wire-brushing/sanding of framing, EPA-registered botanical antimicrobials, and fungicidal encapsulant barrier coatings (Kilz/antimicrobial sealants).
` : isFire ? `
- THIS IS A FIRE & SMOKE RESTORATION PAGE.
- MUST detail chemical soot sponges, thermal fogging, hydroxyl deodorization, HEPA air scrubbers, and structural charred material demolition.
` : isDemo ? `
- THIS IS A DEMOLITION / STRIP-OUT PAGE.
- MUST detail selective non-structural demolition, dust barriers, HEPA negative air, and debris hauling.
` : `
- THIS IS A WATER DAMAGE / EXTRACTION PAGE.
- MUST detail 90-minute emergency arrival, high-volume extraction, LGR dehumidifiers, psychrometric moisture logs, 5-day maximum dryout fee guarantee on clean water, and direct insurance billing.
`}

MANDATORY LINK SPACING & NATURAL PLACEMENT:
- In the description, provide 3 rich paragraphs.
- Space your internal hyperlinks evenly: exactly ONE contextual hyperlink per paragraph.
- NEVER cluster multiple links together in the same sentence.
- Paragraph 1: Link naturally to [emergency water extraction](/services/water-damage) or [certified mold remediation](/services/mold-remediation) depending on category.
- Paragraph 2: Link naturally to sister parent services: [certified mold remediation](/services/mold-remediation), [emergency fire damage repair](/services/fire-damage), or [selective demolition services](/services/demolition).
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
      createdPages,
      dayItem.serviceCategory
    )

    if (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.AI_GATEWAY_KEY) {
      try {
        const { output } = await generateText({
          model: 'google/gemini-2.5-flash',
          output: Output.object({ schema: blogPostAiSchema }),
          prompt: `You are the senior restoration specialist writing a deep, authoritative educational guide for Above & Beyond Restoration LLC (Portland, OR metro, CCB #262371, Phone 503-608-2930).

Article Theme: "${dayItem.blogTitle}"
Focus Keyword: "${dayItem.blogKeyword}"
Service Category: "${dayItem.serviceCategory}"
Location: "${dayItem.targetCity}"
Housing Context: ${geo.neighborhoodTraits}
Weather Context: ${geo.weatherFactor}

MANDATORY INTERLINKING TRIANGLE:
You MUST contextually cite and hyperlink the 3 newly published landing pages for this cluster in the body:
${createdPages.map((p) => `- [${p.replace(/-/g, ' ')}](/services/${p})`).join('\n')}
AND link to the parent hub: [Portland water damage restoration](/services/water-damage).

Write a complete 1,200+ word markdown guide formatted with H2, H3 subheadings, numbered actionable steps, psychrometric drying or IICRC S520 mold principles, and 3-5 hyper-local FAQs.`,
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
