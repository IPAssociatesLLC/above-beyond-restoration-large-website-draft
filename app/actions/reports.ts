'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices, expenses, jobs, clients } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SERVICE_COLORS = ['#3B82F6', '#F97316', '#10B981', '#6B7280', '#EAB308', '#8B5CF6', '#EC4899', '#14B8A6']

export async function getReportsData() {
  const userId = await getUserId()
  const year = new Date().getFullYear()

  const [allInvoices, allExpenses, allJobs, allClients] = await Promise.all([
    db.select().from(invoices).where(eq(invoices.userId, userId)),
    db.select().from(expenses).where(eq(expenses.userId, userId)),
    db.select().from(jobs).where(eq(jobs.userId, userId)),
    db.select({ id: clients.id, createdAt: clients.createdAt }).from(clients).where(eq(clients.userId, userId)),
  ])

  // Monthly revenue / expenses / profit for the current year
  const monthlyRevenue = MONTHS.map((month, i) => {
    const revenue = allInvoices
      .filter(inv => inv.status === 'paid' && new Date(inv.createdAt).getFullYear() === year && new Date(inv.createdAt).getMonth() === i)
      .reduce((s, inv) => s + Number(inv.total ?? 0), 0)
    const exp = allExpenses
      .filter(e => new Date(e.date).getFullYear() === year && new Date(e.date).getMonth() === i)
      .reduce((s, e) => s + Number(e.amount ?? 0), 0)
    return { month, revenue, expenses: exp, profit: revenue - exp }
  })

  // Jobs per month by status
  const jobsData = MONTHS.map((month, i) => {
    const inMonth = allJobs.filter(j => new Date(j.createdAt).getFullYear() === year && new Date(j.createdAt).getMonth() === i)
    return {
      month,
      completed: inMonth.filter(j => j.status === 'completed').length,
      pending: inMonth.filter(j => ['active', 'lead', 'on-hold'].includes(j.status)).length,
      cancelled: inMonth.filter(j => j.status === 'cancelled').length,
    }
  })

  // Revenue by service (from job estimated/actual value)
  const serviceTotals = new Map<string, number>()
  for (const j of allJobs) {
    const key = j.service || 'Other'
    const val = Number(j.actualValue ?? j.estimatedValue ?? 0)
    serviceTotals.set(key, (serviceTotals.get(key) ?? 0) + val)
  }
  const totalServiceValue = Array.from(serviceTotals.values()).reduce((s, v) => s + v, 0)
  const serviceBreakdown = Array.from(serviceTotals.entries())
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([name, v], i) => ({
      name,
      value: totalServiceValue > 0 ? Math.round((v / totalServiceValue) * 100) : 0,
      color: SERVICE_COLORS[i % SERVICE_COLORS.length],
    }))

  // KPIs
  const ytdRevenue = allInvoices
    .filter(inv => inv.status === 'paid' && new Date(inv.createdAt).getFullYear() === year)
    .reduce((s, inv) => s + Number(inv.total ?? 0), 0)
  const totalJobs = allJobs.length
  const completedJobs = allJobs.filter(j => j.status === 'completed').length
  const newClients = allClients.filter(c => new Date(c.createdAt).getFullYear() === year).length

  return {
    year,
    monthlyRevenue,
    jobsData,
    serviceBreakdown,
    kpis: { ytdRevenue, totalJobs, completedJobs, newClients },
    hasData: allInvoices.length > 0 || allJobs.length > 0 || allExpenses.length > 0,
  }
}
