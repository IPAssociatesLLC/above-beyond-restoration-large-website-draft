'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getClients() {
  const userId = await getUserId()
  return db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt))
}

export async function createClient(data: {
  name: string; email?: string; phone?: string; address?: string
  city?: string; state?: string; zip?: string; type?: string; notes?: string
}) {
  const userId = await getUserId()
  await db.insert(clients).values({ ...data, userId })
  revalidatePath('/admin/clients')
}

export async function updateClient(id: number, data: Partial<typeof clients.$inferInsert>) {
  const userId = await getUserId()
  await db.update(clients).set({ ...data, updatedAt: new Date() }).where(and(eq(clients.id, id), eq(clients.userId, userId)))
  revalidatePath('/admin/clients')
}

export async function deleteClient(id: number) {
  const userId = await getUserId()
  await db.delete(clients).where(and(eq(clients.id, id), eq(clients.userId, userId)))
  revalidatePath('/admin/clients')
}
