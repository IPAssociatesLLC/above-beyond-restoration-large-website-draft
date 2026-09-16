export interface StrategyDayItem {
  dayNumber: number
  theme: string
  targetCity: string
  serviceCategory: string
  pageKeywords: [string, string, string]
  blogKeyword: string
  blogTitle: string
}

export const DEFAULT_30_DAY_STRATEGY: StrategyDayItem[] = [
  // ─── DAYS 1–4: PORTLAND, OR ───────────────────────────────────────────
  {
    dayNumber: 1,
    theme: 'Emergency Water Damage & Extraction',
    targetCity: 'Portland, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Extraction',
      'Emergency Water Removal',
    ],
    blogKeyword: 'Emergency Water Damage Restoration Near Me',
    blogTitle: 'How to Handle Emergency Water Damage Restoration in Portland, OR',
  },
  {
    dayNumber: 2,
    theme: 'Emergency Water Damage Restoration Services',
    targetCity: 'Portland, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage Restoration',
      'Emergency Water Restoration Company',
      'Emergency Water Damage Contractor',
    ],
    blogKeyword: '24/7 Water Damage Restoration Company Portland',
    blogTitle: 'Finding a Certified 24/7 Water Damage Restoration Contractor in Portland, OR',
  },
  {
    dayNumber: 3,
    theme: 'Emergency Flooded Basement & Pipe Burst Mitigation',
    targetCity: 'Portland, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Flooded Basement Cleanup',
      'Emergency Burst Pipe Water Removal',
      'Water Leak Home Restoration',
    ],
    blogKeyword: 'Flooded Basement Water Extraction Portland',
    blogTitle: 'Step-by-Step Flooded Basement Water Cleanup in Older Portland Homes',
  },
  {
    dayNumber: 4,
    theme: 'Emergency Mold Remediation & Contaminated Material Removal',
    targetCity: 'Portland, OR',
    serviceCategory: 'Mold Remediation',
    pageKeywords: [
      'Emergency Mold Remediation',
      'Certified Mold Removal & Remediation',
      'Water Damage and Mold Restoration',
    ],
    blogKeyword: 'Certified Mold Remediation and Removal Portland',
    blogTitle: 'Why Proper Containment & Physical Removal Is Required for Mold Remediation in Portland',
  },

  // ─── DAYS 5–8: BEAVERTON, OR ──────────────────────────────────────────
  {
    dayNumber: 5,
    theme: 'Emergency Water Damage & Rapid Extraction',
    targetCity: 'Beaverton, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Extraction',
      'Emergency Water Removal',
    ],
    blogKeyword: 'Emergency Water Damage Cleanup Beaverton OR',
    blogTitle: 'Emergency Water Damage Response and Fast Structural Drying in Beaverton, OR',
  },
  {
    dayNumber: 6,
    theme: 'Emergency Water Restoration & Contractor Services',
    targetCity: 'Beaverton, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage Restoration',
      'Emergency Water Restoration Service',
      'Emergency Water Damage Dry-Out Service',
    ],
    blogKeyword: 'Emergency Water Damage Restoration Beaverton',
    blogTitle: 'The Complete Guide to Emergency Water Damage Dry-Out Services in Beaverton',
  },
  {
    dayNumber: 7,
    theme: 'Residential & Commercial Water Damage Cleanup',
    targetCity: 'Beaverton, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Residential Water Damage Cleanup',
      'Commercial Water Damage Restoration',
      'Emergency Slab Leak Water Restoration',
    ],
    blogKeyword: 'Residential Water Restoration Contractor Beaverton',
    blogTitle: 'How to Identify and Mitigate Concrete Slab Leaks in Beaverton Properties',
  },
  {
    dayNumber: 8,
    theme: 'Certified Mold Remediation & Removal',
    targetCity: 'Beaverton, OR',
    serviceCategory: 'Mold Remediation',
    pageKeywords: [
      'Emergency Mold Remediation',
      'Certified Mold Removal',
      'Crawl Space and Attic Mold Removal',
    ],
    blogKeyword: 'Certified Mold Removal Beaverton OR',
    blogTitle: 'Safe Crawl Space and Attic Mold Removal Protocols for Beaverton Homes',
  },

  // ─── DAYS 9–11: TIGARD, OR ────────────────────────────────────────────
  {
    dayNumber: 9,
    theme: 'Emergency Water Damage & Extraction',
    targetCity: 'Tigard, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Damage Restoration',
      'Emergency Water Extraction',
    ],
    blogKeyword: 'Emergency Water Damage Restoration Tigard OR',
    blogTitle: 'Rapid 90-Minute Water Damage Response for Tigard Homeowners and Businesses',
  },
  {
    dayNumber: 10,
    theme: 'Flooded Basement, Crawl Space & Leak Mitigation',
    targetCity: 'Tigard, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Flooded Basement Cleanup',
      'Emergency Burst Pipe Repair',
      'Residential Water Restoration',
    ],
    blogKeyword: 'Basement and Crawl Space Flood Cleanup Tigard',
    blogTitle: 'How to Prevent Hydrostatic Basement Seepage and Foundation Leaks in Tigard',
  },
  {
    dayNumber: 11,
    theme: 'Certified Mold Remediation & Material Removal',
    targetCity: 'Tigard, OR',
    serviceCategory: 'Mold Remediation',
    pageKeywords: [
      'Emergency Mold Remediation',
      'Certified Mold Removal',
      'Water Damage and Mold Restoration',
    ],
    blogKeyword: 'Emergency Mold Remediation Tigard OR',
    blogTitle: 'Why Antimicrobial Sealing and HEPA Containment Are Essential for Mold Removal in Tigard',
  },

  // ─── DAYS 12–14: LAKE OSWEGO & WEST LINN, OR ──────────────────────────
  {
    dayNumber: 12,
    theme: 'Emergency Water Damage & Premium Hardwood Drying',
    targetCity: 'Lake Oswego, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Damage Restoration',
      'Emergency Water Extraction',
    ],
    blogKeyword: 'Emergency Water Damage Restoration Lake Oswego',
    blogTitle: 'Non-Invasive Structural Drying and Hardwood Floor Preservation in Lake Oswego',
  },
  {
    dayNumber: 13,
    theme: 'Water Damage Restoration & Contractor Services',
    targetCity: 'West Linn, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage Restoration',
      'Emergency Water Damage Contractor',
      'Emergency Burst Pipe Water Removal',
    ],
    blogKeyword: 'Emergency Water Restoration Contractor West Linn',
    blogTitle: 'Handling Multi-Level Water Losses and Hillside Plumbing Leaks in West Linn',
  },
  {
    dayNumber: 14,
    theme: 'Certified Mold Remediation & Structural Antimicrobial Sealing',
    targetCity: 'Lake Oswego, OR',
    serviceCategory: 'Mold Remediation',
    pageKeywords: [
      'Emergency Mold Remediation',
      'Certified Mold Removal',
      'Water Damage and Mold Restoration',
    ],
    blogKeyword: 'Certified Mold Removal Lake Oswego OR',
    blogTitle: 'Comprehensive IICRC S520 Mold Containment and Clearance in Lake Oswego Estates',
  },

  // ─── DAYS 15–17: SHERWOOD & TUALATIN, OR ──────────────────────────────
  {
    dayNumber: 15,
    theme: 'Emergency Water Damage & Extraction',
    targetCity: 'Sherwood, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Damage Restoration',
      'Emergency Water Extraction',
    ],
    blogKeyword: 'Emergency Water Damage Restoration Sherwood OR',
    blogTitle: '24/7 Emergency Water Extraction and Direct Insurance Billing in Sherwood, OR',
  },
  {
    dayNumber: 16,
    theme: 'Emergency Water Restoration & Flooded Property Cleanup',
    targetCity: 'Tualatin, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage Restoration',
      'Emergency Flooded Basement Cleanup',
      'Commercial Water Damage Restoration',
    ],
    blogKeyword: 'Emergency Flood Restoration Tualatin OR',
    blogTitle: 'Commercial and Residential Water Damage Mitigation Along the Tualatin River Corridor',
  },
  {
    dayNumber: 17,
    theme: 'Certified Mold Remediation & Inspection',
    targetCity: 'Sherwood, OR',
    serviceCategory: 'Mold Remediation',
    pageKeywords: [
      'Emergency Mold Remediation',
      'Certified Mold Removal',
      'Water Damage and Mold Restoration',
    ],
    blogKeyword: 'Emergency Mold Remediation Sherwood OR',
    blogTitle: 'Identifying Hidden Crawl Space Moisture and Structural Mold in Sherwood',
  },

  // ─── DAYS 18–20: OREGON CITY & CLACKAMAS, OR ───────────────────────────
  {
    dayNumber: 18,
    theme: 'Emergency Water Damage & Structural Drying',
    targetCity: 'Oregon City, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Damage Restoration',
      'Emergency Water Extraction',
    ],
    blogKeyword: 'Emergency Water Damage Oregon City OR',
    blogTitle: 'Historic Property Water Extraction and Structural Drying in Oregon City',
  },
  {
    dayNumber: 19,
    theme: 'Emergency Water Damage Cleanup & Burst Pipe Recovery',
    targetCity: 'Oregon City, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Residential Water Damage Cleanup',
      'Emergency Burst Pipe Repair',
      'Emergency Water Damage Dry-Out Service',
    ],
    blogKeyword: 'Emergency Burst Pipe Water Damage Oregon City',
    blogTitle: 'Fast Emergency Plumbing Leak Extraction and Insurance Scoping in Oregon City',
  },
  {
    dayNumber: 20,
    theme: 'Certified Mold Remediation & Barrier Encapsulation',
    targetCity: 'Oregon City, OR',
    serviceCategory: 'Mold Remediation',
    pageKeywords: [
      'Emergency Mold Remediation',
      'Certified Mold Removal',
      'Water Damage and Mold Restoration',
    ],
    blogKeyword: 'Certified Mold Remediation Oregon City',
    blogTitle: 'Proper Contaminated Material Disposal and Antimicrobial Barrier Sealing in Oregon City',
  },

  // ─── DAYS 21–24: VANCOUVER & CAMAS, WA ─────────────────────────────────
  {
    dayNumber: 21,
    theme: 'Emergency Water Damage & Extraction',
    targetCity: 'Vancouver, WA',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Damage Restoration',
      'Emergency Water Extraction',
    ],
    blogKeyword: 'Emergency Water Damage Restoration Vancouver WA',
    blogTitle: '24/7 Rapid Emergency Water Extraction for Vancouver, WA Homes and Businesses',
  },
  {
    dayNumber: 22,
    theme: 'Emergency Water Restoration & Flooded Property Cleanup',
    targetCity: 'Vancouver, WA',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Restoration Company',
      'Emergency Flooded Basement Cleanup',
      'Residential Water Damage Cleanup',
    ],
    blogKeyword: 'Emergency Water Restoration Contractor Vancouver WA',
    blogTitle: 'How to Choose a Licensed 24/7 Water Restoration Contractor in Vancouver, WA',
  },
  {
    dayNumber: 23,
    theme: 'Emergency Water Damage & Rapid Response',
    targetCity: 'Camas, WA',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Damage Restoration',
      'Emergency Burst Pipe Water Removal',
    ],
    blogKeyword: 'Emergency Water Damage Camas WA',
    blogTitle: 'Mitigating Water Pipe Freezes and Heavy Storm Intrusions in Camas and East Clark County',
  },
  {
    dayNumber: 24,
    theme: 'Certified Mold Remediation & Contaminated Material Stripping',
    targetCity: 'Vancouver, WA',
    serviceCategory: 'Mold Remediation',
    pageKeywords: [
      'Emergency Mold Remediation',
      'Certified Mold Removal',
      'Water Damage and Mold Restoration',
    ],
    blogKeyword: 'Certified Mold Removal Vancouver WA',
    blogTitle: 'IICRC S520 Mold Containment and EPA Botanical Sanitization in Vancouver, WA',
  },

  // ─── DAYS 25–27: HILLSBORO & ALOHA, OR ─────────────────────────────────
  {
    dayNumber: 25,
    theme: 'Emergency Water Damage & Extraction',
    targetCity: 'Hillsboro, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Damage Restoration',
      'Emergency Water Extraction',
    ],
    blogKeyword: 'Emergency Water Damage Hillsboro OR',
    blogTitle: '90-Minute Guaranteed Water Damage Response Across Hillsboro and Silicon Forest Tech Corridor',
  },
  {
    dayNumber: 26,
    theme: 'Commercial & Residential Water Damage Restoration',
    targetCity: 'Hillsboro, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Commercial Water Damage Restoration',
      'Residential Water Damage Cleanup',
      'Emergency Water Damage Contractor',
    ],
    blogKeyword: 'Commercial Water Damage Restoration Hillsboro',
    blogTitle: 'Mitigating Commercial Office and Multi-Family Water Loss in Hillsboro, OR',
  },
  {
    dayNumber: 27,
    theme: 'Certified Mold Remediation & Attic/Crawl Space Clearance',
    targetCity: 'Hillsboro, OR',
    serviceCategory: 'Mold Remediation',
    pageKeywords: [
      'Emergency Mold Remediation',
      'Certified Mold Removal',
      'Water Damage and Mold Restoration',
    ],
    blogKeyword: 'Emergency Mold Remediation Hillsboro OR',
    blogTitle: 'Eradicating Toxic Black Mold and Attic Condensation Issues in Hillsboro Subdivisions',
  },

  // ─── DAYS 28–30: GRESHAM & MILWAUKIE / FIRE & WATER DAMAGE ─────────────
  {
    dayNumber: 28,
    theme: 'Emergency Water Damage & Freeze-Up Mitigation',
    targetCity: 'Gresham, OR',
    serviceCategory: 'Water Damage Restoration',
    pageKeywords: [
      'Emergency Water Damage',
      'Emergency Water Damage Restoration',
      'Emergency Burst Pipe Water Removal',
    ],
    blogKeyword: 'Emergency Water Damage Restoration Gresham OR',
    blogTitle: 'Gorge Wind Pipe Freeze Prevention and Rapid Thaw Water Extraction in Gresham',
  },
  {
    dayNumber: 29,
    theme: 'Emergency Fire & Smoke Damage Restoration',
    targetCity: 'Portland, OR',
    serviceCategory: 'Fire Damage Restoration',
    pageKeywords: [
      'Emergency Fire Damage Restoration',
      'Smoke Damage Cleanup',
      'Fire and Water Damage Restoration',
    ],
    blogKeyword: 'Emergency Fire Damage Restoration Portland OR',
    blogTitle: 'Comprehensive Fire Damage Recovery: Soot Removal, Smoke Deodorization & Water Mitigation in Portland',
  },
  {
    dayNumber: 30,
    theme: 'Emergency Water Damage Demolition & Debris Cleanout',
    targetCity: 'Portland, OR',
    serviceCategory: 'Demolition Services',
    pageKeywords: [
      'Emergency Demolition Services',
      'Water Damage Demolition',
      'Emergency Property Cleanout and Strip-Out',
    ],
    blogKeyword: 'Emergency Water Damage Demolition Portland',
    blogTitle: 'Safe Non-Structural Demolition and Contaminated Building Material Removal in Portland Metro',
  },
]
