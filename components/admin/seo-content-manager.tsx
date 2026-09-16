'use client'

import { useState, useTransition } from 'react'
import { StrategyDayItem } from '@/lib/seo/default-strategy'
import {
  saveSchedule,
  resetScheduleToDefault,
  generateDayContent,
  deleteSeoPage,
  deleteBlogPost,
} from '@/app/actions/seo-content'
import {
  Sparkles,
  Calendar,
  Save,
  RotateCcw,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  FileText,
  Globe,
  MapPin,
  Layers,
  Search,
  Check,
  Plus,
  ArrowRight,
} from 'lucide-react'

interface SeoManagerProps {
  initialSchedule: StrategyDayItem[]
  initialPages: any[]
  initialBlogs: any[]
}

export function SeoContentManager({
  initialSchedule,
  initialPages,
  initialBlogs,
}: SeoManagerProps) {
  const [schedule, setSchedule] = useState<StrategyDayItem[]>(initialSchedule)
  const [pages, setPages] = useState<any[]>(initialPages)
  const [blogs, setBlogs] = useState<any[]>(initialBlogs)
  const [activeTab, setActiveTab] = useState<'planner' | 'pages' | 'blogs'>('planner')
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const currentDayConfig = schedule.find((s) => s.dayNumber === selectedDay) || schedule[0]

  // Update a specific field on the selected day
  const handleUpdateCurrentDay = (field: keyof StrategyDayItem, value: any) => {
    setSchedule((prev) =>
      prev.map((item) => (item.dayNumber === selectedDay ? { ...item, [field]: value } : item))
    )
  }

  const handleUpdateKeyword = (index: number, val: string) => {
    if (!currentDayConfig) return
    const newKws = [...currentDayConfig.pageKeywords] as [string, string, string]
    newKws[index] = val
    handleUpdateCurrentDay('pageKeywords', newKws)
  }

  // Save changes to DB
  const handleSaveSchedule = () => {
    startTransition(async () => {
      setFeedback(null)
      const res = await saveSchedule(schedule)
      if (res.ok) {
        setFeedback({ type: 'success', message: '30-Day Content Schedule saved successfully!' })
      } else {
        setFeedback({ type: 'error', message: res.message })
      }
    })
  }

  // Reset to default 30-day restoration cluster
  const handleResetSchedule = () => {
    if (confirm('Are you sure you want to reset all 30 days to the default high-intent keyword clusters?')) {
      startTransition(async () => {
        const res = await resetScheduleToDefault()
        if (res.ok) {
          window.location.reload()
        }
      })
    }
  }

  // Helper to check if a day is generated
  const isDayGenerated = (dayNum: number) => {
    const hasPages = pages.some((p) => p.dayNumber === dayNum)
    const hasBlog = blogs.some((b) => b.dayNumber === dayNum)
    return hasPages || hasBlog
  }

  const generatedDaysCount = schedule.filter((s) => isDayGenerated(s.dayNumber)).length

  // Trigger generation for selected day
  const handleGenerateDay = async (dayNum: number) => {
    if (isDayGenerated(dayNum)) {
      if (!confirm(`Day ${dayNum} has already been generated. Are you sure you want to re-generate and update its 3 service pages and 1 blog post?`)) {
        return
      }
    }

    setIsGenerating(true)
    setFeedback(null)
    try {
      const res = await generateDayContent(dayNum)
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `Success! Created 3 Service Pages and 1 Blog Article for Day ${dayNum}.`,
        })
        window.location.reload()
      } else {
        setFeedback({ type: 'error', message: res.message || 'Generation failed.' })
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Generation error occurred.' })
    } finally {
      setIsGenerating(false)
    }
  }

  // Delete page
  const handleDeletePage = async (slug: string) => {
    if (confirm(`Delete service page "${slug}"?`)) {
      startTransition(async () => {
        await deleteSeoPage(slug)
        setPages((prev) => prev.filter((p) => p.slug !== slug))
      })
    }
  }

  // Delete blog
  const handleDeleteBlog = async (slug: string) => {
    if (confirm(`Delete blog article "${slug}"?`)) {
      startTransition(async () => {
        await deleteBlogPost(slug)
        setBlogs((prev) => prev.filter((b) => b.slug !== slug))
      })
    }
  }

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.keyword?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
              SEO &amp; Content Creator Engine
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Programmatic AI page creator &amp; blog publisher powered by 30-day keyword clustering and local search schema.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleResetSchedule}
            disabled={isPending || isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset Default Strategy
          </button>

          <button
            onClick={handleSaveSchedule}
            disabled={isPending || isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Schedule
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Strategy Days</span>
          <p className="text-2xl font-black text-brand-navy mt-1">30 Days</p>
          <span className="text-xs text-brand-orange font-semibold">{generatedDaysCount} of 30 Generated ({Math.round((generatedDaysCount / 30) * 100)}%)</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Generated Landing Pages</span>
          <p className="text-2xl font-black text-brand-navy mt-1">{pages.length}</p>
          <span className="text-xs text-green-600 font-semibold">Live in /services/[slug]</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Published Blog Articles</span>
          <p className="text-2xl font-black text-brand-navy mt-1">{blogs.length}</p>
          <span className="text-xs text-green-600 font-semibold">Live in /blog/[slug]</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Dynamic Sitemap</span>
          <p className="text-2xl font-black text-brand-navy mt-1">Active</p>
          <a
            href="/sitemap.xml"
            target="_blank"
            className="text-xs text-brand-orange font-semibold flex items-center gap-1 hover:underline mt-1"
          >
            View /sitemap.xml <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('planner')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'planner'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> 30-Day Keyword Planner
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'pages'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Globe className="w-4 h-4" /> Generated Landing Pages ({pages.length})
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'blogs'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Published Blog Articles ({blogs.length})
        </button>
      </div>

      {/* TAB 1: 30-DAY PLANNER */}
      {activeTab === 'planner' && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Day Selector Sidebar List */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm max-h-[750px] overflow-y-auto">
            <h3 className="font-black text-brand-navy mb-2 px-2 text-sm uppercase tracking-wider">
              30-Day Content Roadmap
            </h3>

            {/* Progress Bar */}
            <div className="mb-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-brand-navy">Plan Progress</span>
                <span className="text-green-600">{generatedDaysCount} of 30 Days Live</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(generatedDaysCount / 30) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              {schedule.map((item) => {
                const isGen = isDayGenerated(item.dayNumber)
                const isSel = selectedDay === item.dayNumber
                return (
                  <button
                    key={item.dayNumber}
                    onClick={() => setSelectedDay(item.dayNumber)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center justify-between ${
                      isSel
                        ? 'bg-brand-orange text-white font-bold shadow-md shadow-orange-500/20'
                        : isGen
                        ? 'bg-green-50/70 border border-green-200 text-gray-800 hover:bg-green-100/70'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs uppercase opacity-80 block">Day {item.dayNumber}</span>
                        {isGen && (
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isSel ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                          }`}>
                            <Check className="w-2.5 h-2.5" /> Generated
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm font-medium">{item.theme}</p>
                    </div>
                    <span className="text-xs opacity-75 whitespace-nowrap">{item.targetCity.split(',')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected Day Editor & Generator */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-xs font-bold">
                      Day {selectedDay} Configuration
                    </div>
                    {isDayGenerated(selectedDay) ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Generated &amp; Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                        ○ Pending Generation
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                    {currentDayConfig.theme}
                  </h2>
                </div>

                <button
                  onClick={() => handleGenerateDay(selectedDay)}
                  disabled={isGenerating || isPending}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50 whitespace-nowrap ${
                    isDayGenerated(selectedDay)
                      ? 'bg-gray-800 text-white hover:bg-black shadow-gray-900/20'
                      : 'bg-brand-orange text-white hover:bg-orange-600 shadow-orange-900/20'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" /> Generating Content...
                    </>
                  ) : isDayGenerated(selectedDay) ? (
                    <>
                      <RotateCcw className="w-4 h-4" /> Re-generate Day {selectedDay} (3 Pages + 1 Blog)
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" /> Generate Day {selectedDay} (3 Pages + 1 Blog)
                    </>
                  )}
                </button>
              </div>

              {/* Day Theme & City */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                    Theme / Cluster Name
                  </label>
                  <input
                    type="text"
                    value={currentDayConfig.theme}
                    onChange={(e) => handleUpdateCurrentDay('theme', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                    Target City / Area
                  </label>
                  <input
                    type="text"
                    value={currentDayConfig.targetCity}
                    onChange={(e) => handleUpdateCurrentDay('targetCity', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* 3 Landing Page Keywords */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-orange" />
                  <h3 className="font-black text-brand-navy text-sm uppercase tracking-wide">
                    3 Landing Page Target Keywords (1 Page per Keyword)
                  </h3>
                </div>

                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={currentDayConfig.pageKeywords[idx] || ''}
                      onChange={(e) => handleUpdateKeyword(idx, e.target.value)}
                      placeholder={`Target keyword #${idx + 1} for Day ${selectedDay}`}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* 1 Blog Article Keyword & Title */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-orange" />
                  <h3 className="font-black text-brand-navy text-sm uppercase tracking-wide">
                    Daily Matching Blog Article
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                      Blog Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={currentDayConfig.blogKeyword}
                      onChange={(e) => handleUpdateCurrentDay('blogKeyword', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                      Blog Post Title
                    </label>
                    <input
                      type="text"
                      value={currentDayConfig.blogTitle}
                      onChange={(e) => handleUpdateCurrentDay('blogTitle', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LANDING PAGES */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-black text-brand-navy">
              Generated Landing Pages ({filteredPages.length})
            </h3>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, city, or slug..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>

          {filteredPages.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
              No landing pages generated yet. Select a day in the 30-Day Planner and click "Generate Day".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Page Title &amp; Target Keyword</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">URL Slug</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPages.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-brand-navy">
                        {p.title}
                        <span className="block text-xs font-normal text-gray-500">{p.keyword}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{p.city}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-brand-orange truncate max-w-xs">
                        /services/{p.slug}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Live &amp; Indexed
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/services/${p.slug}`}
                            target="_blank"
                            className="p-2 text-gray-500 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
                            title="Preview live page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeletePage(p.slug)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete page"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BLOG POSTS */}
      {activeTab === 'blogs' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-black text-brand-navy">
              Published Blog Articles ({filteredBlogs.length})
            </h3>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blog articles..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
              No blog articles published yet. Select a day in the 30-Day Planner and click "Generate Day".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Article Title</th>
                    <th className="py-3 px-4">Focus Keyword</th>
                    <th className="py-3 px-4">Read Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBlogs.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-brand-navy max-w-sm">
                        {b.title}
                        <span className="block text-xs font-mono text-brand-orange">/blog/{b.slug}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{b.keyword}</td>
                      <td className="py-3.5 px-4 text-gray-500 text-xs">{b.readTime}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Published
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/blog/${b.slug}`}
                            target="_blank"
                            className="p-2 text-gray-500 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
                            title="Preview article"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteBlog(b.slug)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
