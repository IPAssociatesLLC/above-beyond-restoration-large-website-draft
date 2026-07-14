'use client'

import { useEffect, useState, useTransition } from 'react'
import { getLeads, createLead, updateLead, deleteLead } from '@/app/actions/leads'
import { Phone, Mail, MapPin, Tag, Plus, Search, User, Clock, Calendar, CheckCircle, XCircle, Loader2, X, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'

type Lead = Awaited<ReturnType<typeof getLeads>>[0]

const statusConfig: Record<string, { color: string; dot: string }> = {
  new:       { color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  hot:       { color: 'bg-red-100 text-red-700',      dot: 'bg-red-500' },
  warm:      { color: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500' },
  cold:      { color: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400' },
  contacted: { color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  converted: { color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  lost:      { color: 'bg-red-50 text-red-400',       dot: 'bg-red-300' },
}

const empty = { name: '', email: '', phone: '', address: '', service: '', message: '', source: 'website', status: 'new', priority: 'normal', notes: '' }

export default function LeadsPage() {
  const [list, setList] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [isPending, startTransition] = useTransition()

  const load = async () => { setLoading(true); try { const data = await getLeads(); setList(data); } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(empty); setShowModal(true) }
  const handleSave = () => startTransition(async () => {
    await createLead(form); setShowModal(false); await load()
  })
  const handleStatusChange = (id: number, status: string) => startTransition(async () => {
    await updateLead(id, { status }); await load()
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  })
  const handleDelete = (id: number) => {
    if (!confirm('Delete this lead?')) return
    startTransition(async () => { await deleteLead(id); setSelected(null); await load() })
  }

  const filtered = list.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || (l.message ?? '').toLowerCase().includes(search.toLowerCase()) || (l.phone ?? '').includes(search)
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  const hot = list.filter(l => l.status === 'hot').length
  const converted = list.filter(l => l.status === 'converted').length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: list.length, color: 'text-brand-navy' },
          { label: 'Hot Leads', value: hot, color: 'text-red-500' },
          { label: 'Converted', value: converted, color: 'text-emerald-600' },
          { label: 'New Today', value: list.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, color: 'text-brand-orange' },
        ].map(s => (
          <Card key={s.label} className="p-4 bg-white border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['all', 'new', 'hot', 'warm', 'cold', 'converted', 'lost'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${statusFilter === s ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{s}</button>
          ))}
        </div>
        <button onClick={openNew} className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <User className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-semibold">{search ? 'No leads match your search' : 'No leads yet'}</p>
                {!search && <button onClick={openNew} className="mt-4 text-sm text-brand-orange font-semibold hover:underline">Add a lead</button>}
              </div>
            ) : filtered.map(lead => (
              <Card key={lead.id} onClick={() => setSelected(lead)} className={`bg-white border shadow-sm p-5 cursor-pointer hover:shadow-md transition-all ${selected?.id === lead.id ? 'border-brand-orange ring-2 ring-brand-orange/20' : 'border-gray-100'}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-brand-navy text-sm">{lead.name}</span>
                      {lead.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${(statusConfig[lead.status] ?? statusConfig.new).color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${(statusConfig[lead.status] ?? statusConfig.new).dot}`} />
                          {lead.status}
                        </span>
                      )}
                      {lead.source && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 capitalize">{lead.source}</span>}
                    </div>
                    {lead.message && <p className="text-sm text-gray-700 line-clamp-2">{lead.message}</p>}
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-400">
                      {lead.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.address}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(lead.createdAt).toLocaleDateString()}</span>
                      {lead.service && <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{lead.service}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {lead.phone && <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors"><Phone className="w-3 h-3" />Call</a>}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            {selected ? (
              <Card className="bg-white border border-gray-100 shadow-sm p-5 sticky top-24">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-black text-brand-navy">{selected.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${(statusConfig[selected.status] ?? statusConfig.new).color}`}>{selected.status}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
                </div>

                <div className="space-y-2 mb-5">
                  {selected.phone && <a href={`tel:${selected.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"><Phone className="w-4 h-4 text-gray-400 group-hover:text-brand-orange" /><span className="text-sm text-gray-700">{selected.phone}</span></a>}
                  {selected.email && <a href={`mailto:${selected.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"><Mail className="w-4 h-4 text-gray-400 group-hover:text-brand-orange" /><span className="text-sm text-gray-700">{selected.email}</span></a>}
                  {selected.address && <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><MapPin className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-700">{selected.address}</span></div>}
                  {selected.service && <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Tag className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-700">{selected.service}</span></div>}
                </div>

                {selected.message && (
                  <div className="mb-5">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Message</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{selected.message}</p>
                  </div>
                )}
                {selected.notes && (
                  <div className="mb-5">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Notes</p>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">{selected.notes}</p>
                  </div>
                )}

                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['hot', 'warm', 'cold', 'contacted', 'converted', 'lost'].map(s => (
                    <button key={s} onClick={() => handleStatusChange(selected.id, s)} disabled={isPending} className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-colors ${selected.status === s ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{s}</button>
                  ))}
                </div>

                <button onClick={() => handleDelete(selected.id)} disabled={isPending} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors">
                  <XCircle className="w-4 h-4" /> Delete Lead
                </button>
              </Card>
            ) : (
              <Card className="bg-white border border-gray-100 shadow-sm p-10 text-center">
                <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Click a lead to view details and take action.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-brand-navy">New Lead</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {([
                { label: 'Full Name *', key: 'name', type: 'text', col: 2 },
                { label: 'Phone', key: 'phone', type: 'tel', col: 1 },
                { label: 'Email', key: 'email', type: 'email', col: 1 },
                { label: 'Address', key: 'address', type: 'text', col: 2 },
                { label: 'Service Needed', key: 'service', type: 'text', col: 1 },
                { label: 'Source', key: 'source', type: 'text', col: 1 },
              ] as const).map(f => (
                <div key={f.key} className={f.col === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message / Issue Description</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={isPending || !form.name} className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
