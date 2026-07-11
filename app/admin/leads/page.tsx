'use client'

import { useState } from 'react'
import { Phone, Mail, MessageSquare, Clock, CheckCircle, XCircle, ChevronRight, Flame, User, Calendar, MapPin, Tag, Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'

const leads = [
  { id: 1, name: 'Robert Klein', phone: '503-555-0142', email: 'rklein@email.com', issue: 'Basement flooding from heavy rain', source: 'Website Chat', status: 'Hot', time: '2 min ago', address: 'Portland, OR', notes: 'Wants immediate help, water still rising', followUp: 'Call now' },
  { id: 2, name: 'Angela Moore', phone: '503-555-0198', email: 'angela.m@email.com', issue: 'Kitchen fire damage, needs full assessment', source: 'Website Form', status: 'Hot', time: '1 hr ago', address: 'Tigard, OR', notes: 'Insurance: Allstate, claim not yet filed', followUp: 'Today' },
  { id: 3, name: 'Tom Bradley', phone: '503-555-0233', email: 'tbradley@email.com', issue: 'Mold discovered in crawlspace', source: 'Google', status: 'Warm', time: '3 hrs ago', address: 'Beaverton, OR', notes: 'Wants to understand remediation process first', followUp: 'Today' },
  { id: 4, name: 'Lisa Nguyen', phone: '503-555-0177', email: 'lnguyen@email.com', issue: 'Leaking pipe caused ceiling damage', source: 'Website Chat', status: 'Warm', time: '5 hrs ago', address: 'Lake Oswego, OR', notes: 'Has Farmers Insurance, looking for estimates', followUp: 'Tomorrow' },
  { id: 5, name: 'Kevin Park', phone: '503-555-0311', email: 'kpark@realestate.com', issue: 'Pre-purchase mold inspection needed', source: 'Referral', status: 'Cold', time: '1 day ago', address: 'Sherwood, OR', notes: 'Real estate agent, wants inspection report', followUp: 'This week' },
  { id: 6, name: 'Sandra Davis', phone: '503-555-0422', email: 'sdavis@email.com', issue: 'Smoke odor after neighbor fire', source: 'Google', status: 'Cold', time: '2 days ago', address: 'Hillsboro, OR', notes: 'No insurance, wants cash price', followUp: 'This week' },
]

const statusConfig: Record<string, { color: string; label: string; dotColor: string }> = {
  Hot: { color: 'bg-red-100 text-red-700', label: 'Hot Lead', dotColor: 'bg-red-500' },
  Warm: { color: 'bg-amber-100 text-amber-700', label: 'Warm Lead', dotColor: 'bg-amber-500' },
  Cold: { color: 'bg-blue-100 text-blue-600', label: 'Cold Lead', dotColor: 'bg-blue-400' },
  Converted: { color: 'bg-emerald-100 text-emerald-700', label: 'Converted', dotColor: 'bg-emerald-500' },
}

const sourceBadge: Record<string, string> = {
  'Website Chat': 'bg-purple-100 text-purple-700',
  'Website Form': 'bg-blue-100 text-blue-700',
  'Google': 'bg-red-100 text-red-600',
  'Referral': 'bg-emerald-100 text-emerald-700',
}

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null)
  const [note, setNote] = useState('')

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.issue.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: '24', color: 'text-brand-navy' },
          { label: 'Hot Leads', value: '8', color: 'text-red-500' },
          { label: 'Converted (30d)', value: '14', color: 'text-emerald-600' },
          { label: 'Conversion Rate', value: '68%', color: 'text-brand-orange' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 bg-white border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-black ${stat.color}`} style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1" />
        </div>
        <div className="flex gap-1.5">
          {['All', 'Hot', 'Warm', 'Cold'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${statusFilter === s ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Lead List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((lead) => (
            <Card
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`bg-white border shadow-sm p-5 cursor-pointer hover:shadow-md transition-all ${selectedLead?.id === lead.id ? 'border-brand-orange ring-2 ring-brand-orange/20' : 'border-gray-100'}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-brand-navy text-sm">{lead.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusConfig[lead.status].color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[lead.status].dotColor}`} />
                      {lead.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceBadge[lead.source] ?? 'bg-gray-100 text-gray-600'}`}>{lead.source}</span>
                  </div>
                  <p className="text-sm text-gray-700">{lead.issue}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.address}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lead.time}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Follow up: {lead.followUp}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
                    <MessageSquare className="w-3 h-3" /> SMS
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail Panel */}
        <div>
          {selectedLead ? (
            <Card className="bg-white border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {selectedLead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{selectedLead.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[selectedLead.status].color}`}>{selectedLead.status} Lead</span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group">
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-brand-orange" />
                  <span className="text-sm text-gray-700">{selectedLead.phone}</span>
                </a>
                <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group">
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-brand-orange" />
                  <span className="text-sm text-gray-700">{selectedLead.email}</span>
                </a>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedLead.address}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedLead.source}</span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Reported Issue</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedLead.issue}</p>
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Notes</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">{selectedLead.notes}</p>
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Add Note</p>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Call notes, insurance info, follow-up details..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none" />
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                  <CheckCircle className="w-4 h-4" /> Convert to Client
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-navy text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors">
                  <Calendar className="w-4 h-4" /> Schedule Estimate
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                  <XCircle className="w-4 h-4" /> Mark as Lost
                </button>
              </div>
            </Card>
          ) : (
            <Card className="bg-white border border-gray-100 shadow-sm p-10 text-center">
              <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Click a lead to view details and take action.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
