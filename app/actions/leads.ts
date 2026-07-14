'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getLeads() {
  const userId = await getUserId()
  return db.select().from(leads).where(eq(leads.userId, userId)).orderBy(desc(leads.createdAt))
}

export async function createLead(data: {
  name: string; email?: string; phone?: string; address?: string
  service?: string; message?: string; source?: string; status?: string; priority?: string; notes?: string
}) {
  const userId = await getUserId()
  await db.insert(leads).values({ ...data, userId })
  revalidatePath('/admin/leads')
}

export async function updateLead(id: number, data: Partial<typeof leads.$inferInsert>) {
  const userId = await getUserId()
  await db.update(leads).set({ ...data, updatedAt: new Date() }).where(and(eq(leads.id, id), eq(leads.userId, userId)))
  revalidatePath('/admin/leads')
}

export async function deleteLead(id: number) {
  const userId = await getUserId()
  await db.delete(leads).where(and(eq(leads.id, id), eq(leads.userId, userId)))
  revalidatePath('/admin/leads')
}
