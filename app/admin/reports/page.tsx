'use client'

import { useEffect, useState } from 'react'
import { getReportsData } from '@/app/actions/reports'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, DollarSign, Briefcase, Users, CheckCircle, Loader2, BarChart3 } from 'lucide-react'

type ReportsData = Awaited<ReturnType<typeof getReportsData>>

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReportsData().then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    )
  }

  const kpis = [
    { label: `${data?.year ?? ''} Revenue`, value: `$${(data?.kpis.ytdRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Total Jobs', value: String(data?.kpis.totalJobs ?? 0), icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
    { label: 'New Clients', value: String(data?.kpis.newClients ?? 0), icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Completed Jobs', value: String(data?.kpis.completedJobs ?? 0), icon: CheckCircle, color: 'text-yellow-600 bg-yellow-50' },
  ]

  const hasData = data?.hasData ?? false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports &amp; Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Performance overview — {data?.year ?? new Date().getFullYear()}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500 font-medium">{kpi.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {!hasData ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">No report data yet</p>
          <p className="text-sm text-gray-400 mt-1">Charts will populate as you add jobs, invoices, and expenses.</p>
        </div>
      ) : (
        <>
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">Monthly Revenue, Expenses &amp; Profit</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.monthlyRevenue ?? []} barSize={14} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#1B2A4A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#F97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Jobs + Service Breakdown */}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Jobs per Month</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data?.jobsData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="#1B2A4A" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="pending" name="Pending" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Revenue by Service</h2>
              {(data?.serviceBreakdown.length ?? 0) === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No service revenue recorded yet.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={data?.serviceBreakdown ?? []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={false}>
                        {(data?.serviceBreakdown ?? []).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ul className="mt-3 space-y-1.5">
                    {(data?.serviceBreakdown ?? []).map((s) => (
                      <li key={s.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="text-gray-600">{s.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{s.value}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
