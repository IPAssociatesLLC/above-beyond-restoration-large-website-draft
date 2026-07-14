'use client'

import { useEffect, useState } from 'react'
import { Save, CheckCircle, AlertCircle, ExternalLink, Mail, Building, Loader2, Send } from 'lucide-react'
import {
  getSettings,
  getIntegrationStatus,
  getEmailConfig,
  saveEmailConfig,
  saveCompanyInfo,
  saveNotificationPrefs,
  type CompanyInfo,
  type NotificationPrefs,
} from '@/app/actions/settings'

interface IntegrationMeta {
  key: string
  title: string
  icon: string
  color: string
  description: string
  envVar: string
  docsUrl: string
}

const INTEGRATIONS: IntegrationMeta[] = [
  {
    key: 'aiEstimator',
    title: 'AI Photo Estimator',
    icon: '✨',
    color: 'border-orange-200 bg-orange-50',
    description: 'Powers the photo-to-damage estimator. Uses the Vercel AI Gateway vision model.',
    envVar: 'AI_GATEWAY_API_KEY',
    docsUrl: 'https://vercel.com/docs/ai-gateway',
  },
  {
    key: 'xactimate',
    title: 'Xactimate',
    icon: '📋',
    color: 'border-blue-200 bg-blue-50',
    description: 'Insurance-ready line-item pricing data for estimates and invoices.',
    envVar: 'XACTIMATE_API_KEY',
    docsUrl: 'https://www.xactware.com/en-us/solutions/xactimate/',
  },
  {
    key: 'google',
    title: 'Google Business Profile',
    icon: '🔵',
    color: 'border-green-200 bg-green-50',
    description: 'Post job photos, respond to reviews, and sync business info with Google Maps.',
    envVar: 'GOOGLE_API_KEY',
    docsUrl: 'https://developers.google.com/my-business',
  },
  {
    key: 'quickbooks',
    title: 'QuickBooks Online',
    icon: '💼',
    color: 'border-yellow-200 bg-yellow-50',
    description: 'Sync invoices, expenses, and financial reports with QuickBooks Online.',
    envVar: 'QUICKBOOKS_CLIENT_ID',
    docsUrl: 'https://developer.intuit.com',
  },
]

const PREF_KEYS = [
  'New lead from website contact form',
  'New estimate request submitted',
  'Job status updated',
  'Invoice paid / payment received',
  'New Google review posted',
  'Emergency lead flagged (high urgency)',
]

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [prefs, setPrefs] = useState<NotificationPrefs>({})
  const [status, setStatus] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [gmailUser, setGmailUser] = useState('')
  const [gmailPassword, setGmailPassword] = useState('')
  const [hasGmailPassword, setHasGmailPassword] = useState(false)

  useEffect(() => {
    Promise.all([getSettings(), getIntegrationStatus(), getEmailConfig()])
      .then(([settings, integrationStatus, emailCfg]) => {
        setCompanyInfo(settings.companyInfo)
        const initialPrefs = { ...settings.notificationPrefs }
        for (const p of PREF_KEYS) if (!(p in initialPrefs)) initialPrefs[p] = true
        setPrefs(initialPrefs)
        setStatus(integrationStatus)
        setGmailUser(emailCfg.gmailUser)
        setHasGmailPassword(emailCfg.hasPassword)
      })
      .catch(() => setCompanyInfo(null))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveEmail = async () => {
    setSaving((p) => ({ ...p, email: true }))
    try {
      await saveEmailConfig({ gmailUser, gmailAppPassword: gmailPassword })
      setGmailPassword('')
      if (gmailUser) setHasGmailPassword(true)
      flashSaved('email')
    } finally {
      setSaving((p) => ({ ...p, email: false }))
    }
  }

  const flashSaved = (section: string) => {
    setSaved((prev) => ({ ...prev, [section]: true }))
    setTimeout(() => setSaved((prev) => ({ ...prev, [section]: false })), 3000)
  }

  const handleSaveCompany = async () => {
    if (!companyInfo) return
    setSaving((p) => ({ ...p, company: true }))
    try {
      await saveCompanyInfo(companyInfo)
      flashSaved('company')
    } finally {
      setSaving((p) => ({ ...p, company: false }))
    }
  }

  const handleSavePrefs = async () => {
    setSaving((p) => ({ ...p, prefs: true }))
    try {
      await saveNotificationPrefs(prefs)
      flashSaved('prefs')
    } finally {
      setSaving((p) => ({ ...p, prefs: false }))
    }
  }

  if (loading || !companyInfo) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings & Integrations</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your business info, notification preferences, and connected services</p>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-navy/10 flex items-center justify-center">
            <Building className="w-4 h-4 text-brand-navy" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm">Company Information</h2>
            <p className="text-xs text-gray-500">Business details displayed across the website and documents</p>
          </div>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {(Object.keys(companyInfo) as (keyof CompanyInfo)[]).map((key) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {key === 'ccb' ? 'CCB License #' : key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type={key === 'email' ? 'email' : key === 'website' ? 'url' : 'text'}
                value={companyInfo[key]}
                onChange={(e) => setCompanyInfo((prev) => (prev ? { ...prev, [key]: e.target.value } : prev))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>
          ))}
        </div>
        <div className="px-6 pb-5">
          <button
            onClick={handleSaveCompany}
            disabled={saving.company}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors disabled:opacity-60"
          >
            {saving.company ? <Loader2 className="w-4 h-4 animate-spin" /> : saved.company ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved.company ? 'Saved!' : 'Save Company Info'}
          </button>
        </div>
      </div>

      {/* Contact Form Email (Gmail) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
            <Send className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 text-sm">Contact Form Email (Gmail)</h2>
            <p className="text-xs text-gray-500">
              Website contact form submissions are emailed to both admins from this Gmail account. Leads always appear under Leads even if email is not set.
            </p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Use a Google <strong>App Password</strong>, not your normal Gmail password. Turn on 2-Step Verification, then create one at{' '}
              <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                myaccount.google.com/apppasswords
              </a>{' '}
              and paste the 16-character code below.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gmail Address</label>
              <input
                type="email"
                value={gmailUser}
                onChange={(e) => setGmailUser(e.target.value)}
                placeholder="youremail@gmail.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                App Password {hasGmailPassword && <span className="text-green-600 normal-case">(saved)</span>}
              </label>
              <input
                type="password"
                value={gmailPassword}
                onChange={(e) => setGmailPassword(e.target.value)}
                placeholder={hasGmailPassword ? '•••••••• (leave blank to keep)' : '16-character app password'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>
        <div className="px-6 pb-5">
          <button
            onClick={handleSaveEmail}
            disabled={saving.email}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors disabled:opacity-60"
          >
            {saving.email ? <Loader2 className="w-4 h-4 animate-spin" /> : saved.email ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved.email ? 'Saved!' : 'Save Email Settings'}
          </button>
        </div>
      </div>

      {/* Connected Services */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-sm">Connected Services</h2>
          <p className="text-xs text-gray-500">
            API keys are stored securely as environment variables — never in the database. Add or update keys in your Vercel Project Settings → Environment Variables.
          </p>
        </div>
        <div className="divide-y divide-gray-50">
          {INTEGRATIONS.map((int) => {
            const connected = status[int.key]
            return (
              <div key={int.key} className="px-6 py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg flex-shrink-0 ${int.color}`}>
                    {int.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">{int.title}</h3>
                      {connected ? (
                        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Not configured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{int.description}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-1">{int.envVar}</p>
                  </div>
                </div>
                <a
                  href={int.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs text-brand-orange font-semibold flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Docs
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
            <Mail className="w-4 h-4 text-brand-orange" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm">Notification Preferences</h2>
            <p className="text-xs text-gray-500">Control which events trigger email and push notifications</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {PREF_KEYS.map((pref) => (
            <label key={pref} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer group">
              <span className="text-sm text-gray-700">{pref}</span>
              <input
                type="checkbox"
                checked={prefs[pref] ?? true}
                onChange={(e) => setPrefs((prev) => ({ ...prev, [pref]: e.target.checked }))}
                className="w-4 h-4 accent-brand-orange rounded"
              />
            </label>
          ))}
        </div>
        <div className="px-6 pb-5">
          <button
            onClick={handleSavePrefs}
            disabled={saving.prefs}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors disabled:opacity-60"
          >
            {saving.prefs ? <Loader2 className="w-4 h-4 animate-spin" /> : saved.prefs ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved.prefs ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}
