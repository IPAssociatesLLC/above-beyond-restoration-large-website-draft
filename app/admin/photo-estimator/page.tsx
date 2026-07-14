'use client'

import { useState, useRef } from 'react'
import { Upload, Camera, X, Loader2, FileText, Download, Send, CheckCircle, Sparkles, ImageIcon, Plus, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { generatePhotoEstimate, type GeneratedEstimate } from '@/app/actions/photo-estimate'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const mockEstimate: GeneratedEstimate = {
  summary: 'Category 2 water loss from supply line failure in kitchen. Affected areas include kitchen, adjacent hallway, and partial living room. Hardwood flooring, drywall, and insulation show significant moisture content requiring extraction and structural drying.',
  damageType: 'Water Damage - Category 2',
  affectedArea: 'Kitchen, Hallway, Living Room (~380 sq ft)',
  lines: [
    { code: 'WTR-101', description: 'Water extraction - truck mount extraction unit', unit: 'SF', qty: 380, unitPrice: 0.85, total: 323.00, category: 'Mitigation' },
    { code: 'WTR-102', description: 'Air mover rental - LGR (Low Grain Refrigerant)', unit: 'EA/DAY', qty: 12, unitPrice: 45.00, total: 540.00, category: 'Drying Equipment' },
    { code: 'WTR-103', description: 'Dehumidifier rental - commercial LGR', unit: 'EA/DAY', qty: 6, unitPrice: 85.00, total: 510.00, category: 'Drying Equipment' },
    { code: 'WTR-104', description: 'Antimicrobial application - Category 2 loss', unit: 'SF', qty: 380, unitPrice: 0.55, total: 209.00, category: 'Treatment' },
    { code: 'DEM-201', description: 'Drywall removal - water damaged', unit: 'SF', qty: 240, unitPrice: 1.85, total: 444.00, category: 'Demolition' },
    { code: 'DEM-202', description: 'Hardwood flooring removal - wet/buckled', unit: 'SF', qty: 180, unitPrice: 3.20, total: 576.00, category: 'Demolition' },
    { code: 'DEM-203', description: 'Baseboard removal and reset', unit: 'LF', qty: 85, unitPrice: 2.40, total: 204.00, category: 'Demolition' },
    { code: 'DEM-204', description: 'Insulation removal - wet/contaminated', unit: 'SF', qty: 240, unitPrice: 1.10, total: 264.00, category: 'Demolition' },
    { code: 'MON-301', description: 'Daily moisture monitoring and documentation', unit: 'DAY', qty: 4, unitPrice: 75.00, total: 300.00, category: 'Monitoring' },
    { code: 'HVY-401', description: 'Content manipulation - move and protect', unit: 'HR', qty: 4, unitPrice: 65.00, total: 260.00, category: 'Labor' },
    { code: 'LAB-501', description: 'Technician labor - mitigation/extraction', unit: 'HR', qty: 16, unitPrice: 75.00, total: 1200.00, category: 'Labor' },
    { code: 'MAT-601', description: 'Containment barrier - 6-mil poly sheeting', unit: 'SF', qty: 120, unitPrice: 0.75, total: 90.00, category: 'Materials' },
  ],
  subtotal: 4920.00,
  overhead: 738.00,
  profit: 492.00,
  total: 6150.00,
  notes: [
    'Estimate based on Xactimate 2025 pricing for Portland, OR area.',
    'Equipment rental assumes 3-day minimum drying cycle per IICRC S500 standards.',
    'Additional demolition may be required pending moisture mapping results.',
    'Rebuild costs not included in this scope — a separate rebuild estimate will be provided.',
  ],
}

export default function PhotoEstimatorPage() {
  const [images, setImages] = useState<{ url: string; name: string }[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [estimate, setEstimate] = useState<GeneratedEstimate | null>(null)
  const [step, setStep] = useState<'upload' | 'analyzing' | 'complete'>('upload')
  const [damageType, setDamageType] = useState('Water Damage')
  const [clientName, setClientName] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const newImages = await Promise.all(
      files.map(async (file) => ({ url: await fileToDataUrl(file), name: file.name })),
    )
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const analyzeImages = async () => {
    setError(null)
    setIsAnalyzing(true)
    setStep('analyzing')
    try {
      const result = await generatePhotoEstimate({
        images: images.map((img) => img.url),
        damageType,
        clientName,
        propertyAddress,
      })
      if (result.ok) {
        setEstimate(result.estimate)
        setStep('complete')
      } else {
        setError(result.error)
        setStep('upload')
      }
    } catch {
      setError('Something went wrong while analyzing the photos. Please try again.')
      setStep('upload')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const runDemo = async () => {
    setError(null)
    setIsAnalyzing(true)
    setStep('analyzing')
    await new Promise((res) => setTimeout(res, 2500))
    setEstimate(mockEstimate)
    setIsAnalyzing(false)
    setStep('complete')
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-navy" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
            AI-Powered Photo Estimator
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Upload damage photos — our AI analyzes the images and generates a professional Xactimate-aligned estimate with line-item pricing.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Upload & Config */}
        <div className="lg:col-span-2 space-y-5">
          {/* Job Info */}
          <Card className="bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-brand-navy mb-4">Job Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Client Name</label>
                <input type="text" placeholder="Sarah Mitchell" value={clientName} onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Property Address</label>
                <input type="text" placeholder="1234 Oak St, Portland, OR" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Damage Type</label>
                <select value={damageType} onChange={(e) => setDamageType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white">
                  <option>Water Damage</option>
                  <option>Fire Damage</option>
                  <option>Mold Remediation</option>
                  <option>Smoke Damage</option>
                  <option>Demolition</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Upload Zone */}
          <Card className="bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-brand-navy mb-4">Upload Damage Photos</h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand-orange hover:bg-orange-50/30 transition-all group"
            >
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-brand-orange/10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                <Upload className="w-6 h-6 text-gray-400 group-hover:text-brand-orange transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-600 group-hover:text-brand-navy">Click to upload or drag photos here</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, HEIC up to 20MB each</p>
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center hover:border-brand-orange hover:bg-orange-50/30 transition-all"
                >
                  <Plus className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}

            {/* Demo images notice */}
            {images.length === 0 && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">Upload real damage photos to get an accurate estimate. You can also click &quot;Demo Analysis&quot; to see a sample output.</p>
              </div>
            )}

            {error && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <button
                onClick={analyzeImages}
                disabled={isAnalyzing || images.length === 0}
                className="w-full py-3 bg-brand-orange text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Images...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate AI Estimate</>
                )}
              </button>
              {images.length === 0 && (
                <button onClick={runDemo} disabled={isAnalyzing}
                  className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Run Demo Analysis
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Estimate Output */}
        <div className="lg:col-span-3">
          {step === 'upload' && (
            <Card className="bg-white border border-gray-100 shadow-sm p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-black text-brand-navy mb-2">Your Estimate Will Appear Here</h3>
              <p className="text-gray-500 text-sm max-w-xs">Upload damage photos and click &quot;Generate AI Estimate&quot; to create a professional Xactimate-aligned estimate.</p>
            </Card>
          )}

          {step === 'analyzing' && (
            <Card className="bg-white border border-gray-100 shadow-sm p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
              </div>
              <h3 className="text-lg font-black text-brand-navy mb-2">AI Is Analyzing Your Photos</h3>
              <p className="text-gray-500 text-sm max-w-xs">Identifying damage type, affected areas, and generating Xactimate-aligned line items. This takes about 15–30 seconds.</p>
              <div className="mt-6 space-y-2 text-left w-full max-w-sm">
                {['Scanning images for damage patterns...', 'Identifying affected materials...', 'Calculating affected square footage...', 'Generating Xactimate line items...'].map((msg, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Loader2 className="w-4 h-4 text-brand-orange animate-spin flex-shrink-0" />
                    <span className="text-xs text-gray-600">{msg}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {step === 'complete' && estimate && (
            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
              {/* Estimate Header */}
              <div className="bg-brand-navy p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">AI Estimate Generated</span>
                    </div>
                    <h3 className="text-xl font-black" style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                      {clientName || 'Client'} — Estimate
                    </h3>
                    <p className="text-white/60 text-xs mt-1">{propertyAddress || 'Property address'} | {new Date().toLocaleDateString()}</p>
                    <p className="text-brand-orange text-sm font-semibold mt-1">{estimate.damageType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-brand-orange">${estimate.total.toLocaleString()}</p>
                    <p className="text-white/60 text-xs">Total Estimate</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/10 rounded-xl">
                  <p className="text-xs text-white/80 leading-relaxed">{estimate.summary}</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wide">Code</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wide">Description</th>
                      <th className="text-center px-4 py-3 font-bold text-gray-500 uppercase tracking-wide">Unit</th>
                      <th className="text-right px-4 py-3 font-bold text-gray-500 uppercase tracking-wide">Qty</th>
                      <th className="text-right px-4 py-3 font-bold text-gray-500 uppercase tracking-wide">Unit $</th>
                      <th className="text-right px-4 py-3 font-bold text-gray-500 uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {estimate.lines.map((line, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 font-mono text-gray-500">{line.code}</td>
                        <td className="px-4 py-2.5 text-gray-700">{line.description}
                          <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{line.category}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center text-gray-500">{line.unit}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700">{line.qty}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700">${line.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-brand-navy">${line.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 p-5">
                <div className="flex justify-end">
                  <div className="space-y-1.5 w-64">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">${estimate.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Overhead (15%)</span>
                      <span className="font-semibold">${estimate.overhead.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Profit (10%)</span>
                      <span className="font-semibold">${estimate.profit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-brand-navy border-t border-gray-200 pt-2 mt-2">
                      <span>Total Estimate</span>
                      <span className="text-brand-orange">${estimate.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Estimator Notes</p>
                  <ul className="space-y-1">
                    {estimate.notes.map((note, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="text-brand-orange mt-0.5">•</span> {note}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors">
                    <Send className="w-4 h-4" /> Email to Client
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                    <FileText className="w-4 h-4" /> Save to Client Account
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                    <Send className="w-4 h-4" /> Send to Insurance
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
