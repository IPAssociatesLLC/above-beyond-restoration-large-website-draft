'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/app/actions/financials'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Wrench,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  ArrowRight,
  Phone,
  MapPin,
  Calendar,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Stats = Awaited<ReturnType<typeof getDashboardStats>>

const statusColors: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700',
  lead: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  'on-hold': 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-600',
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    )
  }

  const kpiCards = [
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Revenue', value: `$${(stats?.pendingRevenue ?? 0).toLocaleString()}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Jobs', value: String(stats?.activeJobs ?? 0), icon: Wrench, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { label: 'Total Jobs', value: String(stats?.totalJobs ?? 0), icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Clients', value: String(stats?.totalClients ?? 0), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Hot Leads', value: String(stats?.hotLeads ?? 0), icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className="p-4 bg-white border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              {card.value}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">{card.label}</p>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      {(stats?.monthlyRevenue?.length ?? 0) > 0 && (
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Revenue by Month</h3>
              <p className="text-gray-500 text-sm mt-0.5">Paid invoices</p>
            </div>
            <Link href="/admin/financials" className="text-brand-orange text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats?.monthlyRevenue ?? []}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '13px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Recent Jobs</h3>
            <Link href="/admin/jobs" className="text-brand-orange text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {(stats?.recentJobs?.length ?? 0) === 0 ? (
            <div className="text-center py-10">
              <Wrench className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No jobs yet</p>
              <Link href="/admin/jobs" className="text-brand-orange text-sm font-semibold hover:underline mt-1 block">Add your first job</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(stats?.recentJobs ?? []).map((job) => (
                <div key={job.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-4 h-4 text-brand-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-brand-navy">{job.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[job.status] ?? 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">{job.service}</span>
                      {job.address && <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.address}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {job.estimatedValue && <p className="text-sm font-black text-brand-navy">${Number(job.estimatedValue).toLocaleString()}</p>}
                    <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Stats Summary */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <h3 className="font-black text-brand-navy mb-5" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Business Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Active Jobs', value: stats?.activeJobs ?? 0, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/jobs' },
              { label: 'Completed Jobs', value: stats?.completedJobs ?? 0, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/jobs' },
              { label: 'Job Leads', value: stats?.leadJobs ?? 0, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/jobs' },
              { label: 'Total Clients', value: stats?.totalClients ?? 0, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/clients' },
              { label: 'Total Leads', value: stats?.totalLeads ?? 0, color: 'text-gray-600', bg: 'bg-gray-50', link: '/admin/leads' },
              { label: 'Hot Leads', value: stats?.hotLeads ?? 0, color: 'text-red-500', bg: 'bg-red-50', link: '/admin/leads' },
            ].map(item => (
              <Link key={item.label} href={item.link} className={`${item.bg} rounded-xl p-4 hover:opacity-80 transition-opacity`}>
                <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            <Link href="/admin/jobs" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-brand-orange" /><span className="text-sm font-semibold text-brand-navy">Manage Jobs</span></div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/admin/leads" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-orange" /><span className="text-sm font-semibold text-brand-navy">View Leads</span></div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/admin/financials" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-brand-orange" /><span className="text-sm font-semibold text-brand-navy">Financials</span></div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
