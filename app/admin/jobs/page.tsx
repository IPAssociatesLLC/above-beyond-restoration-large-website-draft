'use client'

import { useState } from 'react'
import { Plus, Search, Wrench, MapPin, Calendar, DollarSign, Phone, ChevronRight, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'

const jobs = [
  { id: 'JOB-1042', client: 'Sarah Mitchell', phone: '503-555-0142', service: 'Water Damage', status: 'In Progress', amount: '$8,400', address: '1234 Oak St, Portland, OR', started: 'Jan 10', techsAssigned: 'Mike R., John T.', completion: 65, priority: 'High' },
  { id: 'JOB-1041', client: 'David Chen', phone: '503-555-0233', service: 'Mold Remediation', status: 'Pending Approval', amount: '$4,200', address: '901 Pine Ave, Beaverton, OR', started: 'Jan 9', techsAssigned: 'Sarah B.', completion: 0, priority: 'Medium' },
  { id: 'JOB-1040', client: 'Emily Torres', phone: '503-555-0177', service: 'Fire Damage', status: 'Completed', amount: '$18,700', address: '234 Elm Rd, Tigard, OR', started: 'Dec 20', techsAssigned: 'Mike R., Sarah B., John T.', completion: 100, priority: 'High' },
  { id: 'JOB-1039', client: 'Marcus Williams', phone: '503-555-0311', service: 'Smoke Damage', status: 'Completed', amount: '$3,100', address: '567 Maple Ln, Sherwood, OR', started: 'Jan 7', techsAssigned: 'John T.', completion: 100, priority: 'Low' },
  { id: 'JOB-1038', client: 'Jessica Park', phone: '503-555-0422', service: 'Water Damage', status: 'Estimate Sent', amount: '$6,800', address: '89 Lakeview Dr, Lake Oswego, OR', started: 'Jan 6', techsAssigned: 'Unassigned', completion: 0, priority: 'Medium' },
  { id: 'JOB-1037', client: 'Apex Property Mgmt', phone: '503-555-0198', service: 'Commercial Water', status: 'In Progress', amount: '$32,000', address: '5678 Broadway, Portland, OR', started: 'Jan 5', techsAssigned: 'Full crew', completion: 40, priority: 'Critical' },
]

const statusColors: Record<string, string> = {
  'In Progress': 'bg-blue-100 text-blue-700',
  'Pending Approval': 'bg-amber-100 text-amber-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'Estimate Sent': 'bg-purple-100 text-purple-700',
}

const priorityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-500',
}

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const statuses = ['All', 'In Progress', 'Pending Approval', 'Estimate Sent', 'Completed']

  const filtered = jobs.filter((j) => {
    const matchSearch = j.client.toLowerCase().includes(search.toLowerCase()) || j.service.toLowerCase().includes(search.toLowerCase()) || j.id.includes(search)
    const matchStatus = statusFilter === 'All' || j.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Active', value: '14', color: 'text-blue-600 bg-blue-50' },
          { label: 'Critical/High', value: '4', color: 'text-red-500 bg-red-50' },
          { label: 'This Month', value: '$62,000', color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Completed YTD', value: '142', color: 'text-brand-orange bg-orange-50' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 bg-white border border-gray-100 shadow-sm">
            <div className={`text-2xl font-black ${stat.color.split(' ')[0]}`} style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${statusFilter === s ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> New Job
        </button>
      </div>

      {/* Job Cards */}
      <div className="grid gap-4">
        {filtered.map((job) => (
          <Card key={job.id} className="bg-white border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-11 h-11 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                <Wrench className="w-5 h-5 text-brand-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-black text-brand-navy text-sm" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{job.client}</span>
                  <span className="text-xs text-gray-400">{job.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[job.status]}`}>{job.status}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[job.priority]}`}>{job.priority}</span>
                </div>
                <p className="text-sm text-gray-700 font-semibold mb-2">{job.service}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.address}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Started {job.started}</span>
                  <span className="flex items-center gap-1"><Wrench className="w-3 h-3" />{job.techsAssigned}</span>
                </div>
                {job.completion > 0 && job.completion < 100 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs font-bold text-brand-navy">{job.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-brand-orange rounded-full h-2 transition-all" style={{ width: `${job.completion}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-lg font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{job.amount}</span>
                <div className="flex gap-2">
                  <a href={`tel:${job.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy text-white rounded-lg text-xs font-semibold hover:bg-blue-900 transition-colors">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
                    View <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
