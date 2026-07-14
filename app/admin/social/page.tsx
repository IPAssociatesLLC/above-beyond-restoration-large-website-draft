'use client'

import { useState } from 'react'
import { Image as ImageIcon, Send, ThumbsUp, MessageSquare, Share2, Clock, CheckCircle, MapPin, Star, Plus, ExternalLink } from 'lucide-react'

const scheduledPosts = [
  {
    id: 1,
    platform: 'Google Business',
    content: 'We just completed a major water damage restoration in SE Portland. Our team extracted over 200 gallons of standing water and had the home dry in 3 days. Call us 24/7 for emergency service! #Portland #WaterDamage',
    scheduledFor: '2025-07-15 9:00 AM',
    status: 'scheduled',
    image: true,
  },
  {
    id: 2,
    platform: 'Facebook',
    content: 'Did you know mold can begin growing within 24–48 hours of water damage? Don\'t wait — call Above & Beyond Restoration for emergency service in the Portland metro. IICRC certified. #MoldRemediation #Portland',
    scheduledFor: '2025-07-16 11:00 AM',
    status: 'scheduled',
    image: false,
  },
  {
    id: 3,
    platform: 'Google Business',
    content: 'Before & After: Fire damage cleanup in Lake Oswego. Our team removed all smoke-damaged materials and restored this kitchen completely in under two weeks.',
    scheduledFor: '2025-07-14 8:00 AM',
    status: 'published',
    image: true,
  },
]

const platforms = [
  { name: 'Google Business Profile', connected: true, color: 'bg-blue-500', icon: '🔵', posts: 47, reviews: '4.9', followers: '—' },
  { name: 'Facebook', connected: false, color: 'bg-blue-700', icon: '📘', posts: 0, reviews: '—', followers: '—' },
  { name: 'Instagram', connected: false, color: 'bg-pink-600', icon: '📸', posts: 0, reviews: '—', followers: '—' },
  { name: 'Nextdoor', connected: false, color: 'bg-green-600', icon: '🏘️', posts: 0, reviews: '—', followers: '—' },
]

const reviews = [
  { name: 'Jennifer M.', rating: 5, text: 'Tommy and his crew were at my house within an hour of my call. They saved my hardwood floors from complete water damage. Highly recommend!', date: '2 days ago', source: 'Google' },
  { name: 'Robert T.', rating: 5, text: 'Professional, thorough, and worked directly with my insurance company. I didn\'t have to deal with any of the paperwork headache.', date: '1 week ago', source: 'Google' },
  { name: 'Sarah K.', rating: 5, text: 'Mold remediation done right. They contained the area, removed everything affected, and tested the air quality after. Peace of mind restored.', date: '2 weeks ago', source: 'Google' },
]

export default function SocialMediaPage() {
  const [postContent, setPostContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Google Business Profile'])
  const [scheduleTime, setScheduleTime] = useState('')

  const togglePlatform = (name: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Media Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage posts, reviews, and local presence across all platforms</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((p) => (
          <div key={p.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{p.icon}</span>
              {p.connected ? (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Connected
                </span>
              ) : (
                <button className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full hover:bg-brand-orange hover:text-white transition-colors">
                  Connect
                </button>
              )}
            </div>
            <p className="text-sm font-bold text-gray-800 mb-2">{p.name}</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>{p.posts} posts</span>
              {p.reviews !== '—' && <span>★ {p.reviews}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Compose + Schedule */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">Create & Schedule Post</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Post to Platforms</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p.name}
                  onClick={() => p.connected && togglePlatform(p.name)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
                    selectedPlatforms.includes(p.name)
                      ? 'bg-brand-navy text-white border-brand-navy'
                      : p.connected
                      ? 'bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-navy'
                      : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                  }`}
                >
                  {p.name} {!p.connected && '(not connected)'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Post Content</label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange resize-none"
              placeholder="Write your post... or let AI generate one based on a recent job."
            />
            <div className="flex justify-between items-center mt-1.5">
              <span className="text-xs text-gray-400">{postContent.length}/500 characters</span>
              <button className="text-xs text-brand-orange font-semibold hover:underline">AI Generate Post</button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <ImageIcon className="w-4 h-4 inline mr-1" /> Attach Job Photos
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400 hover:border-brand-orange cursor-pointer transition-colors">
                Click to upload before/after images
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Clock className="w-4 h-4 inline mr-1" /> Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors">
              <Clock className="w-4 h-4" /> Schedule Post
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
              <Send className="w-4 h-4" /> Post Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scheduled Posts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Post Queue</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-navy bg-blue-50 px-2 py-0.5 rounded-full">{post.platform}</span>
                    {post.status === 'published' ? (
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="text-xs text-orange-600 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.scheduledFor}
                      </span>
                    )}
                  </div>
                  {post.image && <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Google Reviews */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Google Reviews</h2>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900 text-sm">4.9</span>
              <span className="text-gray-400 text-xs">(47 reviews)</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {reviews.map((review, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center">
                      {review.name[0]}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{review.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{review.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{review.date} · {review.source}</span>
                  <button className="text-xs text-brand-orange font-semibold hover:underline">Reply</button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100">
            <button className="text-sm text-brand-orange font-semibold hover:underline flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" /> View all on Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
