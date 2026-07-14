'use client'

import { useState } from 'react'
import { Save, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink, Key, Mail, Building, Globe } from 'lucide-react'

interface ApiField {
  id: string
  label: string
  description: string
  placeholder: string
  value: string
  connected: boolean
  docsUrl?: string
}

const INITIAL_INTEGRATIONS: Record<string, ApiField[]> = {
  xactimate: [
    {
      id: 'xact_api_key',
      label: 'Xactimate API Key',
      description: 'Required for photo-to-estimate and invoice generation via Xactimate.',
      placeholder: 'XA-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      value: '',
      connected: false,
      docsUrl: 'https://www.xactware.com/en-us/solutions/xactimate/',
    },
    {
      id: 'xact_org_id',
      label: 'Xactimate Organization ID',
      description: 'Your Xactimate account organization identifier.',
      placeholder: 'ORG-XXXXXXXXXX',
      value: '',
      connected: false,
    },
  ],
  google: [
    {
      id: 'google_business_id',
      label: 'Google Business Profile ID',
      description: 'Your Google Business Profile location ID for posting photos and updates.',
      placeholder: 'ChIJxxxxxxxxxxxxxxxxxxxxxxxx',
      value: '',
      connected: false,
      docsUrl: 'https://developers.google.com/my-business',
    },
    {
      id: 'google_api_key',
      label: 'Google API Key',
      description: 'API key with My Business API and Places API access enabled.',
      placeholder: 'AIzaSy-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      value: '',
      connected: false,
    },
  ],
  quickbooks: [
    {
      id: 'qb_client_id',
      label: 'QuickBooks Client ID',
      description: 'OAuth 2.0 client ID from your Intuit Developer account.',
      placeholder: 'ABxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      value: '',
      connected: false,
      docsUrl: 'https://developer.intuit.com',
    },
    {
      id: 'qb_client_secret',
      label: 'QuickBooks Client Secret',
      description: 'OAuth 2.0 client secret from your Intuit Developer account.',
      placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      value: '',
      connected: false,
    },
  ],
  resend: [
    {
      id: 'resend_api_key',
      label: 'Resend API Key',
      description: 'Powers the contact form emails sent to TommyBletcher@gmail.com.',
      placeholder: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      value: '',
      connected: false,
      docsUrl: 'https://resend.com/api-keys',
    },
  ],
}

const integrationMeta: Record<string, { title: string; icon: string; color: string; description: string }> = {
  xactimate: {
    title: 'Xactimate',
    icon: '📋',
    color: 'border-blue-200 bg-blue-50',
    description: 'AI-powered damage estimates and insurance-ready invoices using Xactimate pricing data.',
  },
  google: {
    title: 'Google Business Profile',
    icon: '🔵',
    color: 'border-green-200 bg-green-50',
    description: 'Post job photos, respond to reviews, and sync your business info with Google Maps.',
  },
  quickbooks: {
    title: 'QuickBooks Online',
    icon: '💼',
    color: 'border-yellow-200 bg-yellow-50',
    description: 'Sync invoices, expenses, payroll, and financial reports with QuickBooks Online.',
  },
  resend: {
    title: 'Resend Email',
    icon: '📧',
    color: 'border-purple-200 bg-purple-50',
    description: 'Transactional email delivery for contact form submissions and client communications.',
  },
}

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Above & Beyond Restoration',
    phone: '503-608-2930',
    email: 'TommyBletcher@gmail.com',
    address: 'P.O. Box 542, Sherwood, OR 97140',
    ccb: '262371',
    website: 'https://aboveandbeyondrestoration.com',
  })

  const updateField = (section: string, id: string, value: string) => {
    setIntegrations(prev => ({
      ...prev,
      [section]: prev[section].map(f => f.id === id ? { ...f, value } : f),
    }))
  }

  const handleSave = (section: string) => {
    setSaved(prev => ({ ...prev, [section]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [section]: false })), 3000)
  }

  const toggleShow = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings & Integrations</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure your API keys, business info, and connected services</p>
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
          {Object.entries(companyInfo).map(([key, val]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {key === 'ccb' ? 'CCB License #' : key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type={key === 'email' ? 'email' : key === 'website' ? 'url' : 'text'}
                value={val}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>
          ))}
        </div>
        <div className="px-6 pb-5">
          <button
            onClick={() => handleSave('company')}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors"
          >
            {saved.company ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved.company ? 'Saved!' : 'Save Company Info'}
          </button>
        </div>
      </div>

      {/* API Integrations */}
      {Object.entries(integrations).map(([sectionKey, fields]) => {
        const meta = integrationMeta[sectionKey]
        const allFilled = fields.every(f => f.value.trim() !== '')
        return (
          <div key={sectionKey} className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-lg ${meta.color}`}>
                  {meta.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900 text-sm">{meta.title}</h2>
                    {allFilled ? (
                      <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Connected
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Not configured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{meta.description}</p>
                </div>
              </div>
              {fields[0].docsUrl && (
                <a
                  href={fields[0].docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs text-brand-orange font-semibold flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Docs
                </a>
              )}
            </div>
            <div className="p-6 space-y-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                  <p className="text-xs text-gray-400 mb-2">{field.description}</p>
                  <div className="relative">
                    <input
                      type={showKeys[field.id] ? 'text' : 'password'}
                      value={field.value}
                      onChange={(e) => updateField(sectionKey, field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:border-brand-orange font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShow(field.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys[field.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5">
              <button
                onClick={() => handleSave(sectionKey)}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors"
              >
                {saved[sectionKey] ? <CheckCircle className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                {saved[sectionKey] ? 'Keys Saved!' : `Save ${meta.title} Keys`}
              </button>
            </div>
          </div>
        )
      })}

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
          {[
            'New lead from website contact form',
            'New estimate request submitted',
            'Job status updated',
            'Invoice paid / payment received',
            'New Google review posted',
            'Emergency lead flagged (high urgency)',
          ].map((pref) => (
            <label key={pref} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer group">
              <span className="text-sm text-gray-700">{pref}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-orange rounded" />
            </label>
          ))}
        </div>
        <div className="px-6 pb-5">
          <button
            onClick={() => handleSave('notifications')}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors"
          >
            {saved.notifications ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved.notifications ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}
