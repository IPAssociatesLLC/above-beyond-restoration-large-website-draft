'use client'

import { useEffect, useState, useTransition } from 'react'
import { getClients, createClient, updateClient, deleteClient } from '@/app/actions/clients'
import { Plus, Pencil, Trash2, Search, Phone, Mail, MapPin, User, Loader2, X } from 'lucide-react'

type Client = Awaited<ReturnType<typeof getClients>>[0]
const empty = { name: '', email: '', phone: '', address: '', city: '', state: 'OR', zip: '', type: 'residential', notes: '' }

export function ClientsManager() {
  const [list, setList] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'residential' | 'commercial'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState(empty)
  const [isPending, startTransition] = useTransition()

  const load = async () => {
    setLoading(true)
    try { setList(await getClients()) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(empty); setShowModal(true) }
  const openEdit = (c: Client) => {
    setEditing(c)
    setForm({ name: c.name, email: c.email ?? '', phone: c.phone ?? '', address: c.address ?? '', city: c.city ?? '', state: c.state ?? 'OR', zip: c.zip ?? '', type: c.type ?? 'residential', notes: c.notes ?? '' })
    setShowModal(true)
  }
  const handleSave = () => startTransition(async () => {
    if (editing) await updateClient(editing.id, form); else await createClient(form)
    setShowModal(false); await load()
  })
  const handleDelete = (id: number) => {
    if (!confirm('Delete this client? This cannot be undone.')) return
    startTransition(async () => { await deleteClient(id); await load() })
  }

  const filtered = list.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.email ?? '').toLowerCase().includes(search.toLowerCase()) || (c.phone ?? '').includes(search)
    const matchType = typeFilter === 'all' || c.type === typeFilter
    return matchSearch && matchType
  })

  const residential = list.filter(c => c.type === 'residential').length
  const commercial = list.filter(c => c.type === 'commercial').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Clients</h1>
          <p className="text-gray-500 text-sm">{list.length} total &mdash; {residential} residential, {commercial} commercial</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or phone…" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white" />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1">
          {(['all', 'residential', 'commercial'] as const).map(f => (
            <button key={f} onClick={() => setTypeFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${typeFilter === f ? 'bg-brand-navy text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <User className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">{search ? 'No clients match your search' : 'No clients yet — add your first one'}</p>
            {!search && <button onClick={openNew} className="mt-4 text-sm text-brand-orange font-semibold hover:underline">Add a client</button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Name', 'Contact', 'Location', 'Type', 'Added', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-navy rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">{c.name[0].toUpperCase()}</span>
                        </div>
                        <span className="font-semibold text-brand-navy">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-gray-600 text-xs hover:text-brand-orange"><Mail className="w-3 h-3" />{c.email}</a>}
                        {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-gray-600 text-xs hover:text-brand-orange"><Phone className="w-3 h-3" />{c.phone}</a>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {(c.address || c.city) && <div className="flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate max-w-[160px]">{[c.address, c.city].filter(Boolean).join(', ')}</span></div>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.type === 'commercial' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {c.type === 'commercial' ? 'Commercial' : 'Residential'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-navy hover:bg-gray-100 transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-brand-navy">{editing ? 'Edit Client' : 'New Client'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { label: 'Full Name *', key: 'name', type: 'text', col: 2 },
                { label: 'Email', key: 'email', type: 'email', col: 1 },
                { label: 'Phone', key: 'phone', type: 'tel', col: 1 },
                { label: 'Street Address', key: 'address', type: 'text', col: 2 },
                { label: 'City', key: 'city', type: 'text', col: 1 },
                { label: 'ZIP', key: 'zip', type: 'text', col: 1 },
              ] as const).map(f => (
                <div key={f.key} className={f.col === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Client Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={isPending || !form.name} className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Save Changes' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
