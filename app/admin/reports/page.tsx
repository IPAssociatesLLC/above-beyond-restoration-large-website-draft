'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, TrendingUp, TrendingDown, DollarSign, Briefcase, Users, Star } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Jan', revenue: 28400, expenses: 11200, profit: 17200 },
  { month: 'Feb', revenue: 34100, expenses: 13400, profit: 20700 },
  { month: 'Mar', revenue: 41800, expenses: 15600, profit: 26200 },
  { month: 'Apr', revenue: 38200, expenses: 14900, profit: 23300 },
  { month: 'May', revenue: 52600, expenses: 19800, profit: 32800 },
  { month: 'Jun', revenue: 47300, expenses: 17200, profit: 30100 },
  { month: 'Jul', revenue: 61200, expenses: 22100, profit: 39100 },
  { month: 'Aug', revenue: 58700, expenses: 20900, profit: 37800 },
  { month: 'Sep', revenue: 49400, expenses: 18300, profit: 31100 },
  { month: 'Oct', revenue: 55800, expenses: 20400, profit: 35400 },
  { month: 'Nov', revenue: 43200, expenses: 16100, profit: 27100 },
  { month: 'Dec', revenue: 39600, expenses: 14700, profit: 24900 },
]

const serviceBreakdown = [
  { name: 'Water Damage', value: 38, color: '#3B82F6' },
  { name: 'Fire Damage', value: 22, color: '#F97316' },
  { name: 'Mold Remediation', value: 18, color: '#10B981' },
  { name: 'Smoke Damage', value: 11, color: '#6B7280' },
  { name: 'Demolition', value: 7, color: '#EAB308' },
  { name: 'Clean Out', value: 4, color: '#8B5CF6' },
]

const jobsData = [
  { month: 'Jan', completed: 12, pending: 3, cancelled: 1 },
  { month: 'Feb', completed: 15, pending: 4, cancelled: 0 },
  { month: 'Mar', completed: 19, pending: 5, cancelled: 2 },
  { month: 'Apr', completed: 17, pending: 6, cancelled: 1 },
  { month: 'May', completed: 23, pending: 4, cancelled: 0 },
  { month: 'Jun', completed: 21, pending: 7, cancelled: 1 },
  { month: 'Jul', completed: 27, pending: 5, cancelled: 0 },
  { month: 'Aug', completed: 25, pending: 6, cancelled: 2 },
  { month: 'Sep', completed: 22, pending: 4, cancelled: 1 },
  { month: 'Oct', completed: 24, pending: 5, cancelled: 0 },
  { month: 'Nov', completed: 19, pending: 3, cancelled: 1 },
  { month: 'Dec', completed: 17, pending: 4, cancelled: 0 },
]

const kpis = [
  { label: 'YTD Revenue', value: '$550,300', change: '+23.4%', up: true, icon: DollarSign, color: 'text-green-600 bg-green-50' },
  { label: 'Total Jobs', value: '241', change: '+18.7%', up: true, icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
  { label: 'New Clients', value: '87', change: '+12.1%', up: true, icon: Users, color: 'text-purple-600 bg-purple-50' },
  { label: 'Avg. Rating', value: '4.9/5.0', change: '+0.2', up: true, icon: Star, color: 'text-yellow-600 bg-yellow-50' },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Full-year performance overview — Jan–Dec 2025</p>
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
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
              {kpi.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {kpi.change} vs last year
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5">Monthly Revenue, Expenses & Profit</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyRevenue} barSize={14} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
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
          <h2 className="text-base font-bold text-gray-900 mb-5">Jobs Completed per Month</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={jobsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#1B2A4A" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pending" name="Pending" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">Revenue by Service</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={serviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={false}>
                {serviceBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-3 space-y-1.5">
            {serviceBreakdown.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-600">{s.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
