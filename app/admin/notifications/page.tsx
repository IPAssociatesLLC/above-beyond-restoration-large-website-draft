'use client'

import { useState } from 'react'
import { Bell, Phone, Mail, FileText, DollarSign, Star, AlertTriangle, CheckCircle, Trash2, Check } from 'lucide-react'

const initialNotifications = [
  {
    id: 1,
    type: 'emergency',
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50',
    title: 'Emergency Lead — Water Damage',
    message: 'Sarah Mitchell submitted an emergency estimate request. Burst pipe, standing water in basement. Portland, OR.',
    time: '3 minutes ago',
    read: false,
    actions: ['Call Now', 'View Lead'],
  },
  {
    id: 2,
    type: 'lead',
    icon: Phone,
    color: 'text-blue-600 bg-blue-50',
    title: 'New Lead — Mold Remediation',
    message: 'David Park submitted a non-emergency estimate request for mold remediation in Beaverton.',
    time: '47 minutes ago',
    read: false,
    actions: ['View Lead'],
  },
  {
    id: 3,
    type: 'payment',
    icon: DollarSign,
    color: 'text-green-600 bg-green-50',
    title: 'Payment Received — $4,850.00',
    message: 'Invoice #INV-2025-0041 for Jennifer Morales has been paid in full. Water damage restoration.',
    time: '2 hours ago',
    read: false,
    actions: ['View Invoice'],
  },
  {
    id: 4,
    type: 'review',
    icon: Star,
    color: 'text-yellow-600 bg-yellow-50',
    title: 'New 5-Star Google Review',
    message: '"Tommy and his crew saved my hardwood floors! Arrived within an hour and were incredibly professional." — Robert T.',
    time: '4 hours ago',
    read: true,
    actions: ['Reply', 'View on Google'],
  },
  {
    id: 5,
    type: 'estimate',
    icon: FileText,
    color: 'text-purple-600 bg-purple-50',
    title: 'Estimate Ready — Job #JOB-2025-0089',
    message: 'AI photo estimate for Mark Dunning (Fire Damage, $12,400) is ready for review and delivery.',
    time: '6 hours ago',
    read: true,
    actions: ['Review Estimate'],
  },
  {
    id: 6,
    type: 'lead',
    icon: Mail,
    color: 'text-blue-600 bg-blue-50',
    title: 'New Lead — Demolition Services',
    message: 'Construction LLC inquired about commercial demolition and cleanout for a 4,000 sq ft project in Tigard.',
    time: '1 day ago',
    read: true,
    actions: ['View Lead'],
  },
  {
    id: 7,
    type: 'payment',
    icon: DollarSign,
    color: 'text-green-600 bg-green-50',
    title: 'Insurance Payment — $8,200.00',
    message: 'Farmers Insurance issued payment for Invoice #INV-2025-0038. Mold remediation — Karen Stewart.',
    time: '2 days ago',
    read: true,
    actions: ['View Invoice'],
  },
  {
    id: 8,
    type: 'review',
    icon: Star,
    color: 'text-yellow-600 bg-yellow-50',
    title: 'New 5-Star Google Review',
    message: '"Handled our mold problem professionally and quickly. Air tests came back clean. Highly recommend!" — Sarah K.',
    time: '3 days ago',
    read: true,
    actions: ['Reply'],
  },
]

const filterOptions = ['All', 'Unread', 'Leads', 'Payments', 'Reviews', 'Estimates', 'Emergency']

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeFilter, setActiveFilter] = useState('All')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const dismiss = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id))

  const filtered = notifications.filter(n => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Unread') return !n.read
    if (activeFilter === 'Emergency') return n.type === 'emergency'
    return n.type === activeFilter.toLowerCase().slice(0, -1)
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
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No notifications in this category.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`px-6 py-4 flex gap-4 ${!n.read ? 'bg-orange-50/40' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${n.color}`}>
                <n.icon className="w-5 h-5" />
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
                  <span className="text-xs text-gray-400">{n.time}</span>
                  <div className="flex gap-2">
                    {n.actions.map((action) => (
                      <button
                        key={action}
                        onClick={() => markRead(n.id)}
                        className="text-xs text-brand-orange font-semibold hover:underline"
                      >
                        {action}
                      </button>
                    ))}
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
          ))
        )}
      </div>
    </div>
  )
}
