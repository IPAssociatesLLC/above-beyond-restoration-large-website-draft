'use client'

import { useEffect, useState } from 'react'
import { Bell, Phone, DollarSign, FileText, AlertTriangle, CheckCircle, Trash2, Check, Loader2, Wrench } from 'lucide-react'
import { getNotifications, type NotificationType } from '@/app/actions/notifications'

type Notif = {
  id: string
  type: NotificationType
  title: string
  message: string
  timeLabel: string
  link: string
  read: boolean
}

const typeStyles: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  emergency: { icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  lead: { icon: Phone, color: 'text-blue-600 bg-blue-50' },
  payment: { icon: DollarSign, color: 'text-green-600 bg-green-50' },
  estimate: { icon: FileText, color: 'text-purple-600 bg-purple-50' },
  job: { icon: Wrench, color: 'text-brand-orange bg-orange-50' },
}

const filterOptions = ['All', 'Unread', 'Leads', 'Payments', 'Estimates', 'Jobs', 'Emergency']

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notif[]>([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications()
      .then((rows) => setNotifications(rows.map((r) => ({ ...r, read: false }))))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const dismiss = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id))

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Unread') return !n.read
    if (activeFilter === 'Emergency') return n.type === 'emergency'
    if (activeFilter === 'Leads') return n.type === 'lead'
    if (activeFilter === 'Payments') return n.type === 'payment'
    if (activeFilter === 'Estimates') return n.type === 'estimate'
    if (activeFilter === 'Jobs') return n.type === 'job'
    return true
  })

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-brand-orange text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 text-sm text-brand-navy font-semibold hover:text-brand-orange transition-colors"
        >
          <Check className="w-4 h-4" /> Mark all read
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-colors ${
              activeFilter === f
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-navy'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {loading ? (
          <div className="px-6 py-16 text-center">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {notifications.length === 0
                ? 'No activity yet. New leads, payments, and estimates will appear here.'
                : 'No notifications in this category.'}
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const style = typeStyles[n.type]
            const Icon = style.icon
            return (
              <div key={n.id} className={`px-6 py-4 flex gap-4 ${!n.read ? 'bg-orange-50/40' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${style.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-brand-orange flex-shrink-0" />}
                      <button onClick={() => dismiss(n.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{n.timeLabel}</span>
                    <div className="flex gap-2">
                      <a href={n.link} onClick={() => markRead(n.id)} className="text-xs text-brand-orange font-semibold hover:underline">
                        View
                      </a>
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-xs text-gray-400 font-semibold hover:text-gray-600 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
