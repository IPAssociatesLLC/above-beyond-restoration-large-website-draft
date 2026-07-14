'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { jobs } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getJobs() {
  const userId = await getUserId()
  return db.select().from(jobs).where(eq(jobs.userId, userId)).orderBy(desc(jobs.createdAt))
}

export async function createJob(data: {
  title: string; service: string; status?: string; priority?: string
  description?: string; address?: string; clientId?: number; estimatedValue?: string
  scheduledDate?: Date; notes?: string; insuranceClaim?: string; adjusterName?: string; adjusterPhone?: string
}) {
  const userId = await getUserId()
  await db.insert(jobs).values({ ...data, userId })
  revalidatePath('/admin/jobs')
}

export async function updateJob(id: number, data: Partial<typeof jobs.$inferInsert>) {
  const userId = await getUserId()
  await db.update(jobs).set({ ...data, updatedAt: new Date() }).where(and(eq(jobs.id, id), eq(jobs.userId, userId)))
  revalidatePath('/admin/jobs')
}

export async function deleteJob(id: number) {
  const userId = await getUserId()
  await db.delete(jobs).where(and(eq(jobs.id, id), eq(jobs.userId, userId)))
  revalidatePath('/admin/jobs')
}
