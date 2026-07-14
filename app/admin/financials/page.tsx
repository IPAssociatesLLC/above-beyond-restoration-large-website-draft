'use client'

import { useEffect, useState, useTransition } from 'react'
import { getFinancialSummary, getInvoices, createInvoice, updateInvoiceStatus } from '@/app/actions/financials'
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Download, CreditCard, Briefcase, Plus, Loader2, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type Invoice = Awaited<ReturnType<typeof getInvoices>>[0]
const emptyInv = { invoiceNumber: '', clientName: '', description: '', amount: '', dueDate: '', status: 'pending' }

export default function FinancialsPage() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof getFinancialSummary>> | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyInv)
  const [isPending, startTransition] = useTransition()

  const load = async () => {
    setLoading(true)
    try {
      const [s, inv] = await Promise.all([getFinancialSummary(), getInvoices()])
      setSummary(s); setInvoices(inv)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleCreate = () => startTransition(async () => {
    await createInvoice(form); setShowModal(false); await load()
  })
  const handleStatusChange = (id: number, status: string) => startTransition(async () => {
    await updateInvoiceStatus(id, status); await load()
  })

  const kpis = summary ? [
    { label: 'Total Revenue', value: `$${Number(summary.totalRevenue).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', change: `${summary.invoiceCount} invoices` },
    { label: 'Paid', value: `$${Number(summary.paidRevenue).toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', change: `${summary.paidCount} paid` },
    { label: 'Outstanding', value: `$${Number(summary.outstandingRevenue).toLocaleString()}`, icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50', change: `${summary.outstandingCount} invoices` },
    { label: 'Overdue', value: `$${Number(summary.overdueRevenue).toLocaleString()}`, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', change: `${summary.overdueCount} overdue` },
  ] : []

  const statusColors: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    sent: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="space-y-5">
      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {kpis.map(stat => (
              <Card key={stat.label} className="p-4 bg-white border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-black text-brand-navy">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                <p className="text-xs font-semibold mt-1 text-gray-400">{stat.change}</p>
              </Card>
            ))}
          </div>

          {/* Monthly chart if we have enough data */}
          {(summary?.monthlyData ?? []).length > 1 && (
            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
              <h3 className="font-black text-brand-navy mb-1">Monthly Revenue</h3>
              <p className="text-gray-500 text-sm mb-5">Invoices by month</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={summary!.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                  <Bar dataKey="revenue" fill="#F97316" radius={[6, 6, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Invoices Table */}
          <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-brand-navy">Invoices</h3>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                <Plus className="w-4 h-4" /> New Invoice
              </button>
            </div>
            {invoices.length === 0 ? (
              <div className="text-center py-16">
                <DollarSign className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">No invoices yet</p>
                <button onClick={() => setShowModal(true)} className="mt-4 text-sm text-brand-orange font-semibold hover:underline">Create your first invoice</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Invoice', 'Client', 'Amount', 'Due Date', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-4 text-sm font-bold text-brand-navy">{inv.invoiceNumber}</td>
                        <td className="px-5 py-4 text-sm text-gray-700">{inv.clientName}</td>
                        <td className="px-5 py-4 text-sm font-black text-brand-navy">${Number(inv.amount).toLocaleString()}</td>
                        <td className="px-5 py-4 text-xs text-gray-500">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[inv.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {inv.status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {inv.status !== 'paid' && (
                            <button onClick={() => handleStatusChange(inv.id, 'paid')} disabled={isPending} className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60">
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* QuickBooks integration prompt */}
          <Card className="p-5 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-navy">QuickBooks Integration</h3>
                <p className="text-gray-500 text-sm mt-0.5">Connect QuickBooks to sync invoices, expenses, and payroll automatically.</p>
              </div>
              <a href="/admin/settings" className="px-4 py-2.5 bg-brand-navy text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors whitespace-nowrap">Connect Now</a>
            </div>
          </Card>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-brand-navy">New Invoice</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {([
                { label: 'Invoice #', key: 'invoiceNumber', type: 'text', col: 1 },
                { label: 'Status', key: 'status', type: 'text', col: 1 },
                { label: 'Client Name *', key: 'clientName', type: 'text', col: 2 },
                { label: 'Description', key: 'description', type: 'text', col: 2 },
                { label: 'Amount ($) *', key: 'amount', type: 'number', col: 1 },
                { label: 'Due Date', key: 'dueDate', type: 'date', col: 1 },
              ] as const).map(f => (
                <div key={f.key} className={f.col === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  {f.key === 'status' ? (
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white">
                      {['pending', 'sent', 'paid', 'overdue', 'cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={isPending || !form.clientName || !form.amount} className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
