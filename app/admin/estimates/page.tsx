'use client'

import { useState } from 'react'
import { Plus, Search, Download, Send, Eye, FileText, CheckCircle, Clock, AlertCircle, DollarSign, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const documents = [
  { id: 'EST-2025-042', type: 'Estimate', client: 'Sarah Mitchell', service: 'Water Damage', amount: '$8,400', status: 'Approved', date: 'Jan 10, 2025', jobId: 'JOB-1042' },
  { id: 'EST-2025-041', type: 'Estimate', client: 'David Chen', service: 'Mold Remediation', amount: '$4,200', status: 'Pending', date: 'Jan 9, 2025', jobId: 'JOB-1041' },
  { id: 'INV-2025-040', type: 'Invoice', client: 'Emily Torres', service: 'Fire Damage', amount: '$18,700', status: 'Paid', date: 'Jan 8, 2025', jobId: 'JOB-1040' },
  { id: 'INV-2025-039', type: 'Invoice', client: 'Marcus Williams', service: 'Smoke Damage', amount: '$3,100', status: 'Paid', date: 'Jan 7, 2025', jobId: 'JOB-1039' },
  { id: 'EST-2025-038', type: 'Estimate', client: 'Jessica Park', service: 'Water Damage', amount: '$6,800', status: 'Sent', date: 'Jan 6, 2025', jobId: 'JOB-1038' },
  { id: 'INV-2025-037', type: 'Invoice', client: 'Apex Property Mgmt', service: 'Commercial Water', amount: '$32,000', status: 'Overdue', date: 'Dec 28, 2024', jobId: 'JOB-1037' },
  { id: 'INV-INS-036', type: 'Insurance Invoice', client: 'Emily Torres / State Farm', service: 'Fire Damage', amount: '$18,700', status: 'Submitted', date: 'Jan 8, 2025', jobId: 'JOB-1040' },
  { id: 'EST-2025-035', type: 'Estimate', client: 'Hillsboro Retail Group', service: 'Demolition', amount: '$12,400', status: 'Approved', date: 'Dec 15, 2024', jobId: 'JOB-1035' },
]

const statusIcons: Record<string, React.ReactNode> = {
  Approved: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  Paid: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  Pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  Sent: <Send className="w-3.5 h-3.5 text-blue-500" />,
  Submitted: <Send className="w-3.5 h-3.5 text-purple-500" />,
  Overdue: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
}

const statusColors: Record<string, string> = {
  Approved: 'bg-emerald-100 text-emerald-700',
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Sent: 'bg-blue-100 text-blue-700',
  Submitted: 'bg-purple-100 text-purple-700',
  Overdue: 'bg-red-100 text-red-700',
}

const typeColors: Record<string, string> = {
  Estimate: 'bg-gray-100 text-gray-600',
  Invoice: 'bg-brand-navy/10 text-brand-navy',
  'Insurance Invoice': 'bg-orange-100 text-orange-700',
}

export default function EstimatesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = documents.filter((d) => {
    const matchSearch = d.client.toLowerCase().includes(search.toLowerCase()) || d.id.includes(search) || d.service.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || d.type === typeFilter
    const matchStatus = statusFilter === 'All' || d.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const totalOutstanding = documents.filter(d => d.status === 'Pending' || d.status === 'Sent' || d.status === 'Overdue')
    .reduce((sum, d) => sum + parseFloat(d.amount.replace(/[$,]/g, '')), 0)

  return (
    <div className="space-y-5">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Outstanding', value: `$${totalOutstanding.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Overdue Invoices', value: '2', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Approved This Month', value: '8', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Insurance Submitted', value: '$48,700', icon: Send, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 bg-white border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Search estimates..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Estimate', 'Invoice', 'Insurance Invoice'].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${typeFilter === t ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>
        <Link href="/admin/photo-estimator"
          className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" /> New Estimate
        </Link>
      </div>

      {/* Documents Table */}
      <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Document</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Client</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Service</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{doc.id}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[doc.type]}`}>{doc.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-700">{doc.client}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">{doc.service}</span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-xs text-gray-500">{doc.date}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-black text-brand-navy">{doc.amount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[doc.status]}`}>
                      {statusIcons[doc.status]}
                      {doc.status}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-navy transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-orange transition-colors" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors" title="Send">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
