'use client'

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
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const revenueData = [
  { month: 'Jul', revenue: 32000, expenses: 18000 },
  { month: 'Aug', revenue: 41000, expenses: 22000 },
  { month: 'Sep', revenue: 38000, expenses: 20000 },
  { month: 'Oct', revenue: 55000, expenses: 28000 },
  { month: 'Nov', revenue: 48000, expenses: 24000 },
  { month: 'Dec', revenue: 62000, expenses: 30000 },
  { month: 'Jan', revenue: 44000, expenses: 23000 },
]

const serviceBreakdown = [
  { name: 'Water Damage', value: 38, color: '#3B82F6' },
  { name: 'Fire Damage', value: 22, color: '#F97316' },
  { name: 'Mold Remediation', value: 18, color: '#10B981' },
  { name: 'Smoke Damage', value: 12, color: '#8B5CF6' },
  { name: 'Demolition', value: 10, color: '#F59E0B' },
]

const recentJobs = [
  { id: 'JOB-1042', client: 'Sarah Mitchell', service: 'Water Damage', status: 'In Progress', amount: '$8,400', address: 'Portland, OR', date: 'Today' },
  { id: 'JOB-1041', client: 'David Chen', service: 'Mold Remediation', status: 'Pending Approval', amount: '$4,200', address: 'Beaverton, OR', date: 'Yesterday' },
  { id: 'JOB-1040', client: 'Emily Torres', service: 'Fire Damage', status: 'Completed', amount: '$18,700', address: 'Tigard, OR', date: 'Jan 8' },
  { id: 'JOB-1039', client: 'Marcus Williams', service: 'Smoke Damage', status: 'Completed', amount: '$3,100', address: 'Sherwood, OR', date: 'Jan 7' },
  { id: 'JOB-1038', client: 'Jessica Park', service: 'Water Damage', status: 'Estimate Sent', amount: '$6,800', address: 'Lake Oswego, OR', date: 'Jan 6' },
]

const recentLeads = [
  { name: 'Robert Klein', issue: 'Basement flooding', phone: '503-555-0142', time: '2 min ago', hot: true },
  { name: 'Angela Moore', issue: 'Kitchen fire damage', phone: '503-555-0198', time: '1 hr ago', hot: true },
  { name: 'Tom Bradley', issue: 'Mold in crawlspace', phone: '503-555-0233', time: '3 hrs ago', hot: false },
  { name: 'Lisa Nguyen', issue: 'Leaking pipe damage', phone: '503-555-0177', time: '5 hrs ago', hot: false },
]

const statusColors: Record<string, string> = {
  'In Progress': 'bg-blue-100 text-blue-700',
  'Pending Approval': 'bg-amber-100 text-amber-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'Estimate Sent': 'bg-purple-100 text-purple-700',
}

const kpiCards = [
  {
    label: 'Monthly Revenue',
    value: '$62,000',
    change: '+14.8%',
    up: true,
    icon: DollarSign,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    label: 'YTD Revenue',
    value: '$320,000',
    change: '+22.1%',
    up: true,
    icon: BarChart3,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Active Jobs',
    value: '14',
    change: '+3 this week',
    up: true,
    icon: Wrench,
    color: 'text-brand-orange',
    bg: 'bg-orange-50',
  },
  {
    label: 'Total Clients',
    value: '248',
    change: '+12 this month',
    up: true,
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Pending Invoices',
    value: '$28,400',
    change: '6 invoices',
    up: false,
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'Monthly Expenses',
    value: '$30,000',
    change: '-3.2%',
    up: false,
    icon: TrendingDown,
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
]

export function DashboardOverview() {
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
            <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${card.up ? 'text-emerald-600' : 'text-red-500'}`}>
              {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.change}
            </p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                Revenue vs Expenses
              </h3>
              <p className="text-gray-500 text-sm mt-0.5">Last 7 months</p>
            </div>
            <Link href="/admin/financials" className="text-brand-orange text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B2A4A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B2A4A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: number, name: string) => [`$${val.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Expenses']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '13px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#revGrad)" name="revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#1B2A4A" strokeWidth={2} fill="url(#expGrad)" name="expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Service Breakdown Pie */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <h3 className="font-black text-brand-navy mb-1" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Jobs by Service
          </h3>
          <p className="text-gray-500 text-sm mb-4">This year</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {serviceBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => [`${val}%`, '']} contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {serviceBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-brand-navy">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Recent Jobs
            </h3>
            <Link href="/admin/jobs" className="text-brand-orange text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4 text-brand-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-brand-navy">{job.client}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[job.status]}`}>{job.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.address}</span>
                    <span className="text-xs text-gray-400">{job.id}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-brand-navy">{job.amount}</p>
                  <p className="text-xs text-gray-400">{job.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Leads */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Incoming Leads
            </h3>
            <Link href="/admin/leads" className="text-brand-orange text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${lead.hot ? 'bg-brand-orange' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-navy">{lead.name}</span>
                    {lead.hot && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">Hot</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{lead.issue}</p>
                  <p className="text-xs text-gray-400">{lead.time}</p>
                </div>
                <a
                  href={`tel:${lead.phone.replace(/-/g, '')}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors flex-shrink-0"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </a>
              </div>
            ))}
          </div>

          {/* Quick Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xl font-black text-brand-navy">24</p>
                <p className="text-xs text-gray-500">Total Leads</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-brand-orange">8</p>
                <p className="text-xs text-gray-500">Hot Leads</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-emerald-600">68%</p>
                <p className="text-xs text-gray-500">Conv. Rate</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="p-5 bg-white border border-gray-100 shadow-sm">
        <h3 className="font-black text-brand-navy mb-4" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
          Action Required
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: AlertCircle, color: 'text-amber-500 bg-amber-50', text: '3 estimates awaiting approval', link: '/admin/estimates' },
            { icon: Clock, color: 'text-red-500 bg-red-50', text: '2 invoices overdue 30+ days', link: '/admin/financials' },
            { icon: CheckCircle, color: 'text-blue-500 bg-blue-50', text: '5 jobs need final inspection', link: '/admin/jobs' },
            { icon: Calendar, color: 'text-purple-500 bg-purple-50', text: '4 follow-ups scheduled today', link: '/admin/leads' },
          ].map((alert, i) => (
            <Link key={i} href={alert.link} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.color.split(' ')[1]}`}>
                <alert.icon className={`w-4 h-4 ${alert.color.split(' ')[0]}`} />
              </div>
              <p className="text-sm text-gray-700 font-medium leading-tight">{alert.text}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
