'use client'

import { useState } from 'react'
import { Plus, Search, Phone, Mail, MapPin, MoreVertical, Edit, Trash2, Eye, Filter, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const clients = [
  { id: 'CLT-001', name: 'Sarah Mitchell', phone: '503-555-0142', email: 'sarah.mitchell@email.com', address: '1234 Oak St, Portland, OR', type: 'Residential', jobs: 3, totalValue: '$21,400', status: 'Active', lastJob: 'Jan 10, 2025' },
  { id: 'CLT-002', name: 'Apex Property Management', phone: '503-555-0198', email: 'info@apexpm.com', address: '5678 Broadway, Portland, OR', type: 'Commercial', jobs: 7, totalValue: '$128,600', status: 'Active', lastJob: 'Jan 8, 2025' },
  { id: 'CLT-003', name: 'David Chen', phone: '503-555-0233', email: 'david.chen@gmail.com', address: '901 Pine Ave, Beaverton, OR', type: 'Residential', jobs: 1, totalValue: '$4,200', status: 'Pending', lastJob: 'Jan 9, 2025' },
  { id: 'CLT-004', name: 'Emily Torres', phone: '503-555-0177', email: 'etorres@business.com', address: '234 Elm Rd, Tigard, OR', type: 'Residential', jobs: 2, totalValue: '$22,800', status: 'Active', lastJob: 'Jan 8, 2025' },
  { id: 'CLT-005', name: 'Portland Housing Authority', phone: '503-555-0288', email: 'contact@pdxhousing.org', address: '100 SE Main, Portland, OR', type: 'Commercial', jobs: 12, totalValue: '$267,300', status: 'Active', lastJob: 'Dec 20, 2024' },
  { id: 'CLT-006', name: 'Marcus Williams', phone: '503-555-0311', email: 'm.williams@email.com', address: '567 Maple Ln, Sherwood, OR', type: 'Residential', jobs: 1, totalValue: '$3,100', status: 'Completed', lastJob: 'Jan 7, 2025' },
  { id: 'CLT-007', name: 'Jessica Park', phone: '503-555-0422', email: 'jpark@email.com', address: '89 Lakeview Dr, Lake Oswego, OR', type: 'Residential', jobs: 1, totalValue: '$6,800', status: 'Pending', lastJob: 'Jan 6, 2025' },
  { id: 'CLT-008', name: 'Hillsboro Retail Group', phone: '503-555-0533', email: 'ops@hillsbororetail.com', address: '2000 NW 185th, Hillsboro, OR', type: 'Commercial', jobs: 4, totalValue: '$89,400', status: 'Active', lastJob: 'Dec 15, 2024' },
]

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-gray-100 text-gray-600',
}

export function ClientsManager() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'Residential' | 'Commercial'>('All')
  const [showNewClient, setShowNewClient] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '', type: 'Residential', notes: '' })

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || c.type === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-5">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1">
            {(['All', 'Residential', 'Commercial'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? 'bg-brand-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setShowNewClient(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: '248' },
          { label: 'Active', value: '186' },
          { label: 'Commercial', value: '42' },
          { label: 'Avg Job Value', value: '$12,400' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 bg-white border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Clients Table */}
      <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Contact</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Jobs</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Total Value</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-navy rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{client.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {client.address.split(',')[1]?.trim() ?? client.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="space-y-1">
                      <a href={`tel:${client.phone}`} className="text-xs text-gray-600 flex items-center gap-1.5 hover:text-brand-orange transition-colors">
                        <Phone className="w-3 h-3" /> {client.phone}
                      </a>
                      <a href={`mailto:${client.email}`} className="text-xs text-gray-600 flex items-center gap-1.5 hover:text-brand-orange transition-colors">
                        <Mail className="w-3 h-3" /> {client.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${client.type === 'Commercial' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {client.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-sm font-bold text-brand-navy">{client.jobs}</span>
                    <p className="text-xs text-gray-400">Last: {client.lastJob}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm font-bold text-brand-navy">{client.totalValue}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-navy transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-orange transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Client Modal */}
      {showNewClient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-black text-brand-navy mb-5" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              Add New Client
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Full Name *</label>
                  <input type="text" placeholder="John Smith" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Phone *</label>
                  <input type="tel" placeholder="503-555-0000" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Email</label>
                <input type="email" placeholder="client@email.com" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Property Address</label>
                <input type="text" placeholder="123 Main St, Portland, OR" value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Client Type</label>
                <select value={newClient.type} onChange={(e) => setNewClient({ ...newClient, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white">
                  <option>Residential</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Notes</label>
                <textarea placeholder="Insurance company, claim number, additional notes..." value={newClient.notes} onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowNewClient(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setShowNewClient(false)}
                  className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                  Create Client
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
