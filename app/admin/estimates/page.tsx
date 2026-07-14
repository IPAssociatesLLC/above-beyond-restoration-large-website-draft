'use client'

import { useEffect, useState, useTransition } from 'react'
import { getEstimates, createEstimate, updateEstimateStatus, deleteEstimate } from '@/app/actions/estimates'
import { Plus, Search, Send, FileText, CheckCircle, Clock, AlertCircle, DollarSign, Loader2, X, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

type Estimate = Awaited<ReturnType<typeof getEstimates>>[0]
const empty = { estimateNumber: '', clientName: '', service: '', description: '', amount: '', status: 'draft', validUntil: '', notes: '' }

const statusIcon: Record<string, React.ReactNode> = {
  approved: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  sent: <Send className="w-3.5 h-3.5 text-blue-500" />,
  pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  draft: <Clock className="w-3.5 h-3.5 text-gray-400" />,
  rejected: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
  expired: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
}

const statusColors: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  sent: 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
  draft: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-red-50 text-red-400',
}

export default function EstimatesPage() {
  const [list, setList] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [isPending, startTransition] = useTransition()

  const load = async () => { setLoading(true); try { setList(await getEstimates()) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const handleSave = () => startTransition(async () => {
    await createEstimate(form); setShowModal(false); await load()
  })
  const handleStatus = (id: number, status: string) => startTransition(async () => {
    await updateEstimateStatus(id, status); await load()
  })
  const handleDelete = (id: number) => {
    if (!confirm('Delete this estimate?')) return
    startTransition(async () => { await deleteEstimate(id); await load() })
  }

  const filtered = list.filter(d => {
    const matchSearch = d.clientName.toLowerCase().includes(search.toLowerCase()) || (d.service ?? '').toLowerCase().includes(search.toLowerCase()) || (d.estimateNumber ?? '').includes(search)
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const pending = list.filter(d => d.status === 'pending' || d.status === 'sent').length
  const totalOutstanding = list.filter(d => ['pending', 'sent', 'draft'].includes(d.status)).reduce((s, d) => s + Number(d.amount ?? 0), 0)
  const approved = list.filter(d => d.status === 'approved').length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Estimates', value: list.length, icon: FileText, color: 'text-brand-navy', bg: 'bg-gray-50' },
          { label: 'Pending/Sent', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approved', value: approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Outstanding', value: `$${totalOutstanding.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(stat => (
          <Card key={stat.label} className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-black text-brand-navy">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search estimates…" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['all', 'draft', 'sent', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${statusFilter === s ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{s}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Estimate
          </button>
        </div>
      </div>

      <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">{search ? 'No estimates match your search' : 'No estimates yet'}</p>
            {!search && <button onClick={() => setShowModal(true)} className="mt-4 text-sm text-brand-orange font-semibold hover:underline">Create your first estimate</button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Document', 'Client', 'Service', 'Date', 'Amount', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-navy">{doc.estimateNumber ?? `EST-${doc.id}`}</p>
                          <span className="text-xs text-gray-400">Estimate</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{doc.clientName}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{doc.service ?? '—'}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-sm font-black text-brand-navy">${Number(doc.amount ?? 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[doc.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {statusIcon[doc.status]}
                        {doc.status}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {doc.status === 'draft' && <button onClick={() => handleStatus(doc.id, 'sent')} disabled={isPending} className="px-2.5 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 disabled:opacity-60">Send</button>}
                        {doc.status === 'sent' && <button onClick={() => handleStatus(doc.id, 'approved')} disabled={isPending} className="px-2.5 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 disabled:opacity-60">Approve</button>}
                        <button onClick={() => handleDelete(doc.id)} disabled={isPending} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-brand-navy">New Estimate</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {([
                { label: 'Estimate #', key: 'estimateNumber', type: 'text', col: 1 },
                { label: 'Status', key: 'status', type: 'select', col: 1 },
                { label: 'Client Name *', key: 'clientName', type: 'text', col: 2 },
                { label: 'Service Type', key: 'service', type: 'text', col: 1 },
                { label: 'Amount ($)', key: 'amount', type: 'number', col: 1 },
                { label: 'Valid Until', key: 'validUntil', type: 'date', col: 1 },
                { label: 'Description', key: 'description', type: 'text', col: 1 },
              ] as const).map(f => (
                <div key={f.key} className={f.col === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  {f.key === 'status' ? (
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white">
                      {['draft', 'sent', 'pending', 'approved', 'rejected'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={isPending || !form.clientName} className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Estimate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
