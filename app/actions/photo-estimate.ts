'use server'

import { auth } from '@/lib/auth'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { headers } from 'next/headers'

const lineSchema = z.object({
  code: z.string().describe('Xactimate-style line item code, e.g. WTR-101, DEM-201'),
  description: z.string().describe('Clear description of the work / material'),
  unit: z.string().describe('Unit of measure, e.g. SF, LF, EA/DAY, HR, DAY'),
  qty: z.number().describe('Quantity'),
  unitPrice: z.number().describe('Price per unit in USD'),
  total: z.number().describe('qty * unitPrice'),
  category: z.string().describe('One of: Mitigation, Drying Equipment, Treatment, Demolition, Monitoring, Labor, Materials'),
})

const estimateSchema = z.object({
  summary: z.string().describe('2-3 sentence professional summary of the loss and scope'),
  damageType: z.string().describe('e.g. "Water Damage - Category 2", "Fire Damage", "Mold Remediation"'),
  affectedArea: z.string().describe('Rooms affected and approximate total square footage'),
  lines: z.array(lineSchema).min(4).describe('Detailed line items for the mitigation/demolition scope'),
  subtotal: z.number(),
  overhead: z.number().describe('15% of subtotal'),
  profit: z.number().describe('10% of subtotal'),
  total: z.number().describe('subtotal + overhead + profit'),
  notes: z.array(z.string()).describe('Estimator notes, assumptions, IICRC standards, exclusions'),
})

export type GeneratedEstimate = z.infer<typeof estimateSchema>

const SYSTEM_PROMPT = `You are a senior property restoration estimator for Above & Beyond Restoration, a licensed water, fire, mold, and smoke damage restoration company serving the Portland, Oregon metro area (CCB #262371).

Your job is to analyze photographs of property damage and produce a professional, insurance-ready mitigation estimate that aligns with Xactimate 2025 pricing conventions for the Portland, OR region and follows IICRC S500 (water) and S520 (mold) standards.

Guidelines:
- Carefully examine each photo. Identify the damage type, category/class of loss, affected materials (drywall, flooring, insulation, cabinetry, framing), and estimate the affected square footage as accurately as the photos allow.
- Build a realistic line-item scope covering extraction/mitigation, drying equipment (air movers, dehumidifiers) with realistic multi-day rental durations, antimicrobial treatment where warranted, selective demolition of unsalvageable materials, moisture monitoring, labor, and materials.
- Use Xactimate-style codes (e.g. WTR-, DEM-, MON-, LAB-, MAT-) and Portland-area unit pricing. Quantities and prices must be realistic.
- Compute overhead at 15% of subtotal and profit at 10% of subtotal. total = subtotal + overhead + profit. Ensure each line total = qty * unitPrice and subtotal = sum of line totals.
- Rebuild/reconstruction costs are OUT OF SCOPE for this mitigation estimate; note that a separate rebuild estimate will follow.
- If the photos are unclear or insufficient, make conservative, defensible assumptions and state them in the notes.
- Always ground the estimate in what is actually visible in the provided photos and the stated damage type.`

export async function generatePhotoEstimate(input: {
  images: string[] // base64 data URLs
  damageType: string
  clientName?: string
  propertyAddress?: string
}): Promise<{ ok: true; estimate: GeneratedEstimate } | { ok: false; error: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { ok: false, error: 'You must be signed in to generate estimates.' }

  if (!input.images || input.images.length === 0) {
    return { ok: false, error: 'Please upload at least one damage photo.' }
  }

  try {
    const { output: estimate } = await generateText({
      model: 'openai/gpt-4o',
      output: Output.object({ schema: estimateSchema }),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze these ${input.images.length} damage photo(s) and generate a mitigation estimate.
Damage type indicated by the technician: ${input.damageType}.
${input.clientName ? `Client: ${input.clientName}.` : ''}
${input.propertyAddress ? `Property: ${input.propertyAddress}.` : ''}
Produce a complete, itemized, insurance-ready estimate.`,
            },
            ...input.images.map((data) => ({
              type: 'file' as const,
              mediaType: 'image/*',
              data,
            })),
          ],
        },
      ],
    })

    return { ok: true, estimate: estimate as GeneratedEstimate }
  } catch (err) {
    console.log('[v0] photo estimate error:', err instanceof Error ? err.message : String(err))
    return { ok: false, error: 'The AI estimator could not process these photos. Please try again with clearer images.' }
  }
}
