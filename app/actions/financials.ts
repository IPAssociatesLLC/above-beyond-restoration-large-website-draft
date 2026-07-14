'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices, expenses, payments, jobs, clients, leads } from '@/lib/db/schema'
import { and, desc, eq, sum, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// ----- Invoices -----

export type InvoiceRow = {
  id: number
  invoiceNumber: string
  clientName: string
  description: string | null
  amount: string
  dueDate: Date | null
  status: string
  createdAt: Date
}

export async function getInvoices(): Promise<InvoiceRow[]> {
  const userId = await getUserId()
  const rows = await db.select().from(invoices).where(eq(invoices.userId, userId)).orderBy(desc(invoices.createdAt))
  return rows.map(r => ({
    id: r.id,
    invoiceNumber: r.invoiceNumber,
    clientName: (r as any).clientName ?? '',
    description: r.notes,
    amount: String(r.total ?? r.subtotal ?? 0),
    dueDate: r.dueDate ? new Date(r.dueDate) : null,
    status: r.status,
    createdAt: r.createdAt,
  }))
}

export async function createInvoice(data: {
  invoiceNumber?: string
  clientName: string
  description?: string
  amount: string
  dueDate?: string
  status?: string
}) {
  const userId = await getUserId()
  const invoiceNumber = data.invoiceNumber || `INV-${Date.now()}`
  await db.insert(invoices).values({
    userId,
    invoiceNumber,
    status: data.status ?? 'pending',
    lineItems: [],
    subtotal: data.amount,
    total: data.amount,
    notes: data.description,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  })
  revalidatePath('/admin/financials')
}

export async function updateInvoiceStatus(id: number, status: string) {
  const userId = await getUserId()
  const patch: Record<string, unknown> = { status, updatedAt: new Date() }
  if (status === 'paid') patch.paidAt = new Date()
  await db.update(invoices).set(patch).where(and(eq(invoices.id, id), eq(invoices.userId, userId)))
  revalidatePath('/admin/financials')
}

// ----- Financial Summary -----

export async function getFinancialSummary() {
  const userId = await getUserId()
  const allInvoices = await db.select().from(invoices).where(eq(invoices.userId, userId))

  const totalRevenue = allInvoices.reduce((s, r) => s + Number(r.total ?? 0), 0)
  const paidRevenue = allInvoices.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.total ?? 0), 0)
  const outstandingRevenue = allInvoices.filter(r => ['pending', 'sent'].includes(r.status)).reduce((s, r) => s + Number(r.total ?? 0), 0)
  const overdueRevenue = allInvoices.filter(r => r.status === 'overdue').reduce((s, r) => s + Number(r.total ?? 0), 0)
  const invoiceCount = allInvoices.length
  const paidCount = allInvoices.filter(r => r.status === 'paid').length
  const outstandingCount = allInvoices.filter(r => ['pending', 'sent'].includes(r.status)).length
  const overdueCount = allInvoices.filter(r => r.status === 'overdue').length

  const monthlyMap = new Map<string, number>()
  for (const inv of allInvoices) {
    const key = inv.createdAt.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + Number(inv.total ?? 0))
  }
  const monthlyData = Array.from(monthlyMap.entries())
    .slice(-7)
    .map(([month, revenue]) => ({ month, revenue }))

  return {
    totalRevenue, paidRevenue, outstandingRevenue, overdueRevenue,
    invoiceCount, paidCount, outstandingCount, overdueCount,
    monthlyData,
  }
}

// ----- Expenses -----

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

// ----- Payments -----

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

// ----- Dashboard Stats -----

export async function getDashboardStats() {
  const userId = await getUserId()

  const [allJobs, allClients, allLeads, allInvoices] = await Promise.all([
    db.select().from(jobs).where(eq(jobs.userId, userId)),
    db.select({ id: clients.id }).from(clients).where(eq(clients.userId, userId)),
    db.select({ id: leads.id, status: leads.status }).from(leads).where(eq(leads.userId, userId)),
    db.select().from(invoices).where(eq(invoices.userId, userId)),
  ])

  const totalRevenue = allInvoices.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.total ?? 0), 0)
  const pendingRevenue = allInvoices.filter(r => ['pending', 'sent'].includes(r.status)).reduce((s, r) => s + Number(r.total ?? 0), 0)

  const activeJobs = allJobs.filter(j => j.status === 'active').length
  const completedJobs = allJobs.filter(j => j.status === 'completed').length
  const leadJobs = allJobs.filter(j => j.status === 'lead').length
  const hotLeads = allLeads.filter(l => l.status === 'hot').length

  const recentJobs = allJobs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const monthlyMap = new Map<string, number>()
  for (const inv of allInvoices) {
    const key = inv.createdAt.toLocaleString('en-US', { month: 'short' })
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + Number(inv.total ?? 0))
  }
  const monthlyRevenue = Array.from(monthlyMap.entries()).slice(-7).map(([month, revenue]) => ({ month, revenue }))

  return {
    totalRevenue,
    pendingRevenue,
    activeJobs,
    completedJobs,
    leadJobs,
    totalJobs: allJobs.length,
    totalClients: allClients.length,
    hotLeads,
    totalLeads: allLeads.length,
    recentJobs,
    monthlyRevenue,
  }
}
