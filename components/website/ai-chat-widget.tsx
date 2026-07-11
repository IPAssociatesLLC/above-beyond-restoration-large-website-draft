'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Phone, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: number
  role: 'assistant' | 'user'
  text: string
  timestamp: Date
}

const quickReplies = [
  'I have water damage',
  'I need fire damage help',
  'I found mold in my home',
  'I need a free estimate',
]

const botResponses: Record<string, string> = {
  default: "Hi! I'm here to help with your property restoration needs. What type of damage are you dealing with — water, fire, mold, smoke, or something else?",
  water: "Water damage requires immediate action! The sooner we respond, the less damage and lower your costs. We're available 24/7 and can be there in 90 minutes. Can I get your name and address so we can dispatch a team?",
  fire: "I'm so sorry to hear that. Fire damage is devastating, but our IICRC certified team handles everything from stabilization to full reconstruction. We work directly with insurance companies too. What's the best number to reach you?",
  mold: "Mold can be a serious health hazard and needs professional remediation quickly. We use state-of-the-art equipment to safely remove and prevent mold. Can I get your name and location so we can arrange a free inspection?",
  estimate: "Absolutely — we offer free estimates with no obligation. A certified technician will come to your property, assess the damage, and provide a detailed written estimate. What's a good time and what's your address?",
  name: "Got it! And what's the best phone number to reach you? We'll have someone call you within 5 minutes during business hours.",
  phone: "Perfect! Our team will be in touch shortly. For immediate emergencies, please call us directly at **503-608-2930**. We're available 24/7!",
}

function getResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('water') || lower.includes('flood') || lower.includes('pipe') || lower.includes('leak')) {
    return botResponses.water
  }
  if (lower.includes('fire') || lower.includes('burn')) {
    return botResponses.fire
  }
  if (lower.includes('mold') || lower.includes('mould')) {
    return botResponses.mold
  }
  if (lower.includes('estimate') || lower.includes('quote') || lower.includes('price') || lower.includes('cost')) {
    return botResponses.estimate
  }
  if (/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(message)) {
    return botResponses.phone
  }
  if (message.length < 30 && /^[a-z\s]+$/i.test(message)) {
    return botResponses.name
  }
  return "Thank you for reaching out! For the fastest response, please call us at **503-608-2930** — we're available 24/7. Or I can have someone contact you. What's your name and best phone number?"
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: botResponses.default,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now(), role: 'user', text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const response = getResponse(text)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: response, timestamp: new Date() },
      ])
      setIsTyping(false)
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      sendMessage(input)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[520px]'
          }`}
        >
          {/* Header */}
          <div className="bg-brand-navy px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image src="/logo.png" alt="Above & Beyond" width={90} height={24} className="h-6 w-auto brightness-0 invert" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-brand-navy" />
              </div>
              {!isMinimized && (
                <div>
                  <p className="text-white text-xs font-semibold">Restoration Assistant</p>
                  <p className="text-green-400 text-xs">Online • Typically replies in seconds</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-white/60 hover:text-white rounded-lg transition-colors"
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/60 hover:text-white rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[340px]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-brand-orange text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      {msg.text.split('**').map((part, i) =>
                        i % 2 === 1 ? (
                          <a key={i} href="tel:5036082930" className="font-bold underline">
                            {part}
                          </a>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length === 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendMessage(reply)}
                      className="text-xs px-3 py-1.5 bg-orange-50 text-brand-orange border border-orange-200 rounded-full hover:bg-brand-orange hover:text-white transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="p-2.5 bg-brand-orange text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <a
                  href="tel:5036082930"
                  className="flex items-center justify-center gap-1.5 mt-2 text-xs text-brand-navy font-semibold hover:text-brand-orange transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Prefer to call? 503-608-2930
                </a>
              </div>
            </>
          )}
        </div>
      )}

      {/* Notification Badge */}
      {!isOpen && showNotification && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 max-w-[240px] text-sm text-gray-700 animate-bounce-once">
          <p className="font-semibold text-brand-navy text-xs">Need help with property damage?</p>
          <p className="text-xs text-gray-500 mt-0.5">Chat with our restoration expert now →</p>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowNotification(false) }}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-gray-600' : 'bg-brand-orange'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        {!isOpen && showNotification && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>
    </div>
  )
}
