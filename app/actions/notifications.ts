'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { leads, payments, estimates, jobs } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export type NotificationType = 'emergency' | 'lead' | 'payment' | 'estimate' | 'job'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string // ISO
  link: string
}

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export async function getNotifications(): Promise<(AppNotification & { timeLabel: string })[]> {
  const userId = await getUserId()

  const [recentLeads, recentPayments, recentEstimates, recentJobs] = await Promise.all([
    db.select().from(leads).where(eq(leads.userId, userId)).orderBy(desc(leads.createdAt)).limit(15),
    db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt)).limit(15),
    db.select().from(estimates).where(eq(estimates.userId, userId)).orderBy(desc(estimates.createdAt)).limit(15),
    db.select().from(jobs).where(eq(jobs.userId, userId)).orderBy(desc(jobs.createdAt)).limit(15),
  ])

  const items: AppNotification[] = []

  for (const l of recentLeads) {
    const emergency = l.priority === 'high' || l.priority === 'urgent'
    items.push({
      id: `lead-${l.id}`,
      type: emergency ? 'emergency' : 'lead',
      title: emergency ? `Emergency Lead — ${l.service ?? 'Service Request'}` : `New Lead — ${l.service ?? 'Service Request'}`,
      message: `${l.name} submitted a request${l.address ? ` in ${l.address}` : ''}.${l.message ? ` "${l.message.slice(0, 120)}"` : ''}`,
      createdAt: l.createdAt.toISOString(),
      link: '/admin/leads',
    })
  }

  for (const p of recentPayments) {
    items.push({
      id: `payment-${p.id}`,
      type: 'payment',
      title: `Payment Received — $${Number(p.amount).toLocaleString()}`,
      message: `A payment of $${Number(p.amount).toLocaleString()} was recorded${p.method ? ` via ${p.method}` : ''}${p.reference ? ` (ref ${p.reference})` : ''}.`,
      createdAt: p.createdAt.toISOString(),
      link: '/admin/financials',
    })
  }

  for (const e of recentEstimates) {
    items.push({
      id: `estimate-${e.id}`,
      type: 'estimate',
      title: `Estimate ${e.status === 'accepted' ? 'Accepted' : 'Updated'} — ${e.title}`,
      message: `Estimate "${e.title}" ${e.status === 'accepted' ? 'was accepted by the client' : `is ${e.status}`}. Total $${Number(e.total ?? 0).toLocaleString()}.`,
      createdAt: e.createdAt.toISOString(),
      link: '/admin/estimates',
    })
  }

  for (const j of recentJobs) {
    if (j.status === 'completed') {
      items.push({
        id: `job-${j.id}`,
        type: 'job',
        title: `Job Completed — ${j.title}`,
        message: `${j.service} job "${j.title}" was marked completed.`,
        createdAt: (j.completedDate ?? j.createdAt).toISOString(),
        link: '/admin/jobs',
      })
    }
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return items.slice(0, 40).map((n) => ({ ...n, timeLabel: timeAgo(new Date(n.createdAt)) }))
}
