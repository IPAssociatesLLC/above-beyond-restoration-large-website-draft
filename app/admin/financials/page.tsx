'use client'

import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Download, CreditCard, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts'

const monthlyData = [
  { month: 'Jul', revenue: 32000, expenses: 18000, payroll: 12000 },
  { month: 'Aug', revenue: 41000, expenses: 22000, payroll: 14000 },
  { month: 'Sep', revenue: 38000, expenses: 20000, payroll: 13000 },
  { month: 'Oct', revenue: 55000, expenses: 28000, payroll: 16000 },
  { month: 'Nov', revenue: 48000, expenses: 24000, payroll: 15000 },
  { month: 'Dec', revenue: 62000, expenses: 30000, payroll: 18000 },
  { month: 'Jan', revenue: 44000, expenses: 23000, payroll: 15000 },
]

const expenses = [
  { category: 'Payroll', amount: '$15,200', pct: 50, color: 'bg-blue-500' },
  { category: 'Equipment & Rentals', amount: '$6,400', pct: 21, color: 'bg-orange-500' },
  { category: 'Materials & Supplies', amount: '$3,800', pct: 13, color: 'bg-emerald-500' },
  { category: 'Vehicle & Fuel', amount: '$2,100', pct: 7, color: 'bg-purple-500' },
  { category: 'Insurance & Licensing', amount: '$1,600', pct: 5, color: 'bg-amber-500' },
  { category: 'Marketing', amount: '$900', pct: 3, color: 'bg-red-400' },
  { category: 'Other', amount: '$200', pct: 1, color: 'bg-gray-400' },
]

const invoices = [
  { id: 'INV-037', client: 'Apex Property Mgmt', amount: '$32,000', due: 'Dec 28, 2024', status: 'Overdue', days: '14 days overdue' },
  { id: 'INV-036', client: 'Portland Housing Auth.', amount: '$28,400', due: 'Jan 15, 2025', status: 'Due Soon', days: 'Due in 4 days' },
  { id: 'INV-040', client: 'Emily Torres', amount: '$18,700', due: 'Jan 20, 2025', status: 'Paid', days: 'Paid Jan 10' },
  { id: 'INV-039', client: 'Marcus Williams', amount: '$3,100', due: 'Jan 17, 2025', status: 'Paid', days: 'Paid Jan 9' },
]

export default function FinancialsPage() {
  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'January Revenue', value: '$44,000', change: '+8.2%', up: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'YTD Revenue', value: '$320,000', change: '+22.1% YoY', up: true, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'January Expenses', value: '$23,000', change: '-3.2%', up: false, icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Net Profit (Jan)', value: '$21,000', change: '47.7% margin', up: true, icon: Briefcase, color: 'text-brand-orange', bg: 'bg-orange-50' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 bg-white border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{stat.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
            <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
              {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.change}
            </p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Revenue / Expenses Bar */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <h3 className="font-black text-brand-navy mb-1" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Revenue vs Expenses
          </h3>
          <p className="text-gray-500 text-sm mb-5">Last 7 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number, name: string) => [`$${v.toLocaleString()}`, name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Payroll']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="revenue" fill="#F97316" radius={[6, 6, 0, 0]} name="revenue" />
              <Bar dataKey="expenses" fill="#1B2A4A" radius={[6, 6, 0, 0]} name="expenses" />
              <Bar dataKey="payroll" fill="#93C5FD" radius={[6, 6, 0, 0]} name="payroll" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Expense Breakdown */}
        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <h3 className="font-black text-brand-navy mb-1" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Expense Breakdown
          </h3>
          <p className="text-gray-500 text-sm mb-5">January 2025 — $30,200 total</p>
          <div className="space-y-3">
            {expenses.map((exp) => (
              <div key={exp.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{exp.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-navy">{exp.amount}</span>
                    <span className="text-xs text-gray-400">{exp.pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${exp.color} rounded-full h-2 transition-all`} style={{ width: `${exp.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Outstanding Invoices */}
      <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            Invoices
          </h3>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Invoice</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Due Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 text-sm font-bold text-brand-navy">{inv.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{inv.client}</td>
                  <td className="px-5 py-4 text-right text-sm font-black text-brand-navy">{inv.amount}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 hidden sm:table-cell">{inv.due}</td>
                  <td className="px-5 py-4">
                    <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                      inv.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      inv.status === 'Due Soon' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {inv.status === 'Overdue' && <AlertCircle className="w-3 h-3" />}
                      {inv.days}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {inv.status !== 'Paid' && (
                      <button className="text-xs px-3 py-1.5 bg-brand-orange text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                        Send Reminder
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QuickBooks Integration Prompt */}
      <Card className="p-5 bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-brand-navy">QuickBooks Integration</h3>
            <p className="text-gray-500 text-sm mt-0.5">Connect QuickBooks to sync invoices, expenses, and payroll automatically. Configure in Settings.</p>
          </div>
          <a href="/admin/settings" className="px-4 py-2.5 bg-brand-navy text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors whitespace-nowrap">
            Connect Now
          </a>
        </div>
      </Card>
    </div>
  )
}
