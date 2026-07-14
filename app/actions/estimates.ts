'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { estimates } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getEstimates() {
  const userId = await getUserId()
  const rows = await db.select().from(estimates).where(eq(estimates.userId, userId)).orderBy(desc(estimates.createdAt))
  return rows.map(r => ({
    id: r.id,
    estimateNumber: (r as any).estimateNumber ?? null,
    clientName: (r as any).clientName ?? r.title ?? '',
    service: (r as any).service ?? null,
    description: r.notes,
    amount: String(r.total ?? r.subtotal ?? 0),
    status: r.status,
    validUntil: (r as any).validUntil ?? null,
    notes: r.notes,
    createdAt: r.createdAt,
  }))
}

export async function createEstimate(data: {
  estimateNumber?: string
  clientName: string
  service?: string
  description?: string
  amount?: string
  status?: string
  validUntil?: string
  notes?: string
}) {
  const userId = await getUserId()
  const estimateNumber = data.estimateNumber || `EST-${Date.now()}`
  await db.insert(estimates).values({
    userId,
    title: `${data.service ?? 'Estimate'} — ${data.clientName}`,
    status: data.status ?? 'draft',
    lineItems: [],
    subtotal: data.amount ?? '0',
    total: data.amount ?? '0',
    notes: data.notes ?? data.description,
  })
  revalidatePath('/admin/estimates')
}

export async function updateEstimateStatus(id: number, status: string) {
  const userId = await getUserId()
  const patch: Record<string, unknown> = { status, updatedAt: new Date() }
  if (status === 'sent') patch.sentAt = new Date()
  if (status === 'approved') patch.acceptedAt = new Date()
  await db.update(estimates).set(patch).where(and(eq(estimates.id, id), eq(estimates.userId, userId)))
  revalidatePath('/admin/estimates')
}

export async function deleteEstimate(id: number) {
  const userId = await getUserId()
  await db.delete(estimates).where(and(eq(estimates.id, id), eq(estimates.userId, userId)))
  revalidatePath('/admin/estimates')
}
