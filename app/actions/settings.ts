'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { appSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export interface CompanyInfo {
  name: string
  phone: string
  email: string
  address: string
  ccb: string
  website: string
}

export type NotificationPrefs = Record<string, boolean>

const DEFAULT_COMPANY: CompanyInfo = {
  name: 'Above & Beyond Restoration',
  phone: '503-608-2930',
  email: 'TommyBletcher@gmail.com',
  address: 'P.O. Box 542, Sherwood, OR 97140',
  ccb: '262371',
  website: 'https://aboveandbeyondrestoration.com',
}

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

/** Which integrations have their API keys configured as environment variables. */
export async function getIntegrationStatus() {
  await getUserId()
  return {
    xactimate: Boolean(process.env.XACTIMATE_API_KEY),
    google: Boolean(process.env.GOOGLE_API_KEY),
    quickbooks: Boolean(process.env.QUICKBOOKS_CLIENT_ID),
    resend: Boolean(process.env.RESEND_API_KEY),
    aiEstimator: Boolean(process.env.AI_GATEWAY_API_KEY),
  }
}

export async function getSettings(): Promise<{ companyInfo: CompanyInfo; notificationPrefs: NotificationPrefs }> {
  const userId = await getUserId()
  const rows = await db.select().from(appSettings).where(eq(appSettings.userId, userId)).limit(1)
  const row = rows[0]
  return {
    companyInfo: { ...DEFAULT_COMPANY, ...((row?.companyInfo as Partial<CompanyInfo>) ?? {}) },
    notificationPrefs: (row?.notificationPrefs as NotificationPrefs) ?? {},
  }
}

async function upsert(userId: string, patch: { companyInfo?: CompanyInfo; notificationPrefs?: NotificationPrefs }) {
  const existing = await db.select().from(appSettings).where(eq(appSettings.userId, userId)).limit(1)
  if (existing[0]) {
    await db
      .update(appSettings)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(appSettings.userId, userId))
  } else {
    await db.insert(appSettings).values({
      userId,
      companyInfo: patch.companyInfo ?? DEFAULT_COMPANY,
      notificationPrefs: patch.notificationPrefs ?? {},
    })
  }
}

export async function saveCompanyInfo(companyInfo: CompanyInfo): Promise<{ ok: boolean }> {
  const userId = await getUserId()
  await upsert(userId, { companyInfo })
  return { ok: true }
}

export async function saveNotificationPrefs(notificationPrefs: NotificationPrefs): Promise<{ ok: boolean }> {
  const userId = await getUserId()
  await upsert(userId, { notificationPrefs })
  return { ok: true }
}
