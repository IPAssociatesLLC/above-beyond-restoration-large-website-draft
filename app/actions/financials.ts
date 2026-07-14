'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices, expenses, payments, jobs } from '@/lib/db/schema'
import { and, desc, eq, sum, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getInvoices() {
  const userId = await getUserId()
  return db.select().from(invoices).where(eq(invoices.userId, userId)).orderBy(desc(invoices.createdAt))
}

export async function createInvoice(data: {
  invoiceNumber: string; clientId?: number; jobId?: number; estimateId?: number
  lineItems: object[]; subtotal: string; tax: string; total: string; notes?: string; dueDate?: Date
}) {
  const userId = await getUserId()
  await db.insert(invoices).values({ ...data, userId, lineItems: data.lineItems })
  revalidatePath('/admin/financials')
  revalidatePath('/admin/estimates')
}

export async function updateInvoice(id: number, data: Partial<typeof invoices.$inferInsert>) {
  const userId = await getUserId()
  await db.update(invoices).set({ ...data, updatedAt: new Date() }).where(and(eq(invoices.id, id), eq(invoices.userId, userId)))
  revalidatePath('/admin/financials')
}

export async function getExpenses() {
  const userId = await getUserId()
  return db.select().from(expenses).where(eq(expenses.userId, userId)).orderBy(desc(expenses.createdAt))
}

export async function createExpense(data: {
  description: string; category: string; amount: string; vendor?: string; date?: string; notes?: string; jobId?: number
}) {
  const userId = await getUserId()
  await db.insert(expenses).values({ ...data, userId })
  revalidatePath('/admin/financials')
}

export async function deleteExpense(id: number) {
  const userId = await getUserId()
  await db.delete(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
  revalidatePath('/admin/financials')
}

export async function getPayments() {
  const userId = await getUserId()
  return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt))
}

export async function recordPayment(data: {
  invoiceId?: number; clientId?: number; amount: string; method?: string; reference?: string; notes?: string; date?: string
}) {
  const userId = await getUserId()
  await db.insert(payments).values({ ...data, userId })
  revalidatePath('/admin/financials')
}

export async function getDashboardStats() {
  const userId = await getUserId()

  const [totalRevenue] = await db
    .select({ value: sum(invoices.total) })
    .from(invoices)
    .where(and(eq(invoices.userId, userId), eq(invoices.status, 'paid')))

  const [totalExpensesResult] = await db
    .select({ value: sum(expenses.amount) })
    .from(expenses)
    .where(eq(expenses.userId, userId))

  const [pendingRevenue] = await db
    .select({ value: sum(invoices.total) })
    .from(invoices)
    .where(and(eq(invoices.userId, userId), eq(invoices.status, 'sent')))

  const [jobCounts] = await db
    .select({
      total: sql<number>`count(*)`,
      active: sql<number>`count(*) filter (where status = 'active')`,
      completed: sql<number>`count(*) filter (where status = 'completed')`,
      leads: sql<number>`count(*) filter (where status = 'lead')`,
    })
    .from(jobs)
    .where(eq(jobs.userId, userId))

  return {
    totalRevenue: Number(totalRevenue?.value ?? 0),
    totalExpenses: Number(totalExpensesResult?.value ?? 0),
    pendingRevenue: Number(pendingRevenue?.value ?? 0),
    jobCounts: jobCounts ?? { total: 0, active: 0, completed: 0, leads: 0 },
  }
}
