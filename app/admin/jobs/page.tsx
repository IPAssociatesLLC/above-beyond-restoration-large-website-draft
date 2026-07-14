'use client'

import { useEffect, useState, useTransition } from 'react'
import { getJobs, createJob, updateJob, deleteJob } from '@/app/actions/jobs'
import { Plus, Search, Wrench, MapPin, Calendar, DollarSign, Pencil, Trash2, Loader2, X } from 'lucide-react'
import { Card } from '@/components/ui/card'

type Job = Awaited<ReturnType<typeof getJobs>>[0]

const statusColors: Record<string, string> = {
  lead: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
  'on-hold': 'bg-amber-100 text-amber-700',
}

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  normal: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-500',
}

const services = ['Water Damage', 'Fire Damage', 'Mold Remediation', 'Smoke Damage', 'Storm Damage', 'Biohazard Cleanup', 'Commercial Water', 'Demolition', 'Other']
const empty = { title: '', service: '', status: 'lead', priority: 'normal', address: '', description: '', notes: '', estimatedValue: '', insuranceClaim: '', adjusterName: '', adjusterPhone: '' }

export default function JobsPage() {
  const [list, setList] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Job | null>(null)
  const [form, setForm] = useState(empty)
  const [isPending, startTransition] = useTransition()

  const load = async () => { setLoading(true); try { setList(await getJobs()) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(empty); setShowModal(true) }
  const openEdit = (j: Job) => {
    setEditing(j)
    setForm({ title: j.title, service: j.service, status: j.status, priority: j.priority ?? 'normal', address: j.address ?? '', description: j.description ?? '', notes: j.notes ?? '', estimatedValue: j.estimatedValue ?? '', insuranceClaim: j.insuranceClaim ?? '', adjusterName: j.adjusterName ?? '', adjusterPhone: j.adjusterPhone ?? '' })
    setShowModal(true)
  }
  const handleSave = () => startTransition(async () => {
    if (editing) await updateJob(editing.id, form); else await createJob(form)
    setShowModal(false); await load()
  })
  const handleDelete = (id: number) => {
    if (!confirm('Delete this job? This cannot be undone.')) return
    startTransition(async () => { await deleteJob(id); await load() })
  }

  const filtered = list.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.service.toLowerCase().includes(search.toLowerCase()) || (j.address ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || j.status === statusFilter
    return matchSearch && matchStatus
  })

  const active = list.filter(j => j.status === 'active').length
  const completed = list.filter(j => j.status === 'completed').length
  const leads = list.filter(j => j.status === 'lead').length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Jobs', value: list.length, color: 'text-brand-navy' },
          { label: 'Active', value: active, color: 'text-blue-600' },
          { label: 'Leads', value: leads, color: 'text-amber-600' },
          { label: 'Completed', value: completed, color: 'text-emerald-600' },
        ].map(s => (
          <Card key={s.label} className="p-4 bg-white border border-gray-100 shadow-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs…" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['all', 'lead', 'active', 'completed', 'on-hold', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${statusFilter === s ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{s}</button>
          ))}
        </div>
        <button onClick={openNew} className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> New Job
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <Wrench className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">{search ? 'No jobs match your search' : 'No jobs yet — create your first one'}</p>
          {!search && <button onClick={openNew} className="mt-4 text-sm text-brand-orange font-semibold hover:underline">Add a job</button>}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(job => (
            <Card key={job.id} className="bg-white border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-11 h-11 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-5 h-5 text-brand-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-black text-brand-navy text-sm">{job.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[job.status] ?? 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${priorityColors[job.priority ?? 'normal'] ?? 'bg-gray-100 text-gray-500'}`}>{job.priority ?? 'normal'}</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-2">{job.service}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    {job.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.address}</span>}
                    {job.scheduledDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(job.scheduledDate).toLocaleDateString()}</span>}
                    {job.insuranceClaim && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />Claim: {job.insuranceClaim}</span>}
                  </div>
                  {job.notes && <p className="text-xs text-gray-500 mt-2 line-clamp-1">{job.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {job.estimatedValue && <span className="text-lg font-black text-brand-navy">${Number(job.estimatedValue).toLocaleString()}</span>}
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(job)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-navy hover:bg-gray-100 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-brand-navy">{editing ? 'Edit Job' : 'New Job'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Job Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Water damage — basement" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Service Type *</label>
                <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white">
                  <option value="">Select service…</option>
                  {services.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white">
                  {['lead', 'active', 'on-hold', 'completed', 'cancelled'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white">
                  {['low', 'normal', 'high', 'critical'].map(s => <option key={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Estimated Value ($)</label>
                <input type="number" value={form.estimatedValue} onChange={e => setForm(p => ({ ...p, estimatedValue: e.target.value }))} placeholder="0.00" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Property Address</label>
                <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St, Portland, OR" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Insurance Claim #</label>
                <input value={form.insuranceClaim} onChange={e => setForm(p => ({ ...p, insuranceClaim: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Adjuster Name</label>
                <input value={form.adjusterName} onChange={e => setForm(p => ({ ...p, adjusterName: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={isPending || !form.title || !form.service} className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Save Changes' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
