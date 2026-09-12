import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import {
  Send, ArrowLeft, Clock, AlertTriangle, Star, Check, ChevronDown, ChevronUp,
  Shield, Truck, Award, BarChart2, Info, CheckCircle, XCircle, ArrowRight,
  Filter, SortAsc, TrendingUp, Zap, Eye, RefreshCw, Package
} from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────
const cx = (...args) => args.filter(Boolean).join(' ')

const riskColor = (level) => {
  if (!level) return 'text-gray-500'
  const l = level.toLowerCase()
  if (l === 'low') return 'text-emerald-600'
  if (l === 'medium') return 'text-amber-600'
  return 'text-red-600'
}
const riskBg = (level) => {
  if (!level) return 'bg-gray-100 text-gray-600'
  const l = level.toLowerCase()
  if (l === 'low') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (l === 'medium') return 'bg-amber-50 text-amber-700 border border-amber-200'
  return 'bg-red-50 text-red-700 border border-red-200'
}
const scoreColor = (s) => {
  if (s >= 85) return 'text-emerald-600'
  if (s >= 70) return 'text-amber-600'
  return 'text-red-600'
}
const barColor = (s) => {
  if (s >= 85) return 'bg-emerald-500'
  if (s >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

// Extended supplier intelligence data (mock)
const supplierIntelligence = {
  'SUP-001': {
    estimatedPrice: 98,
    deliveryDays: 12,
    capacity: 'High',
    capacityPct: 88,
    deliveryPerformance: 92,
    qualityScore: 90,
    riskScore: 25,
    overallScore: 88,
    strengths: ['Consistent on-time delivery', 'High quality components', 'Strong track record'],
    weaknesses: ['Slightly higher price point', 'Limited bulk discounts'],
    recommended: false,
  },
  'SUP-002': {
    estimatedPrice: 82,
    deliveryDays: 16,
    capacity: 'Medium',
    capacityPct: 65,
    deliveryPerformance: 75,
    qualityScore: 78,
    riskScore: 78,
    overallScore: 62,
    strengths: ['Competitive pricing', 'Large order capacity'],
    weaknesses: ['High delivery risk', 'Frequent delays', 'Inconsistent quality'],
    recommended: false,
  },
  'SUP-003': {
    estimatedPrice: 105,
    deliveryDays: 9,
    capacity: 'High',
    capacityPct: 92,
    deliveryPerformance: 95,
    qualityScore: 94,
    riskScore: 18,
    overallScore: 93,
    strengths: ['Best delivery performance', 'Premium quality', 'Low risk profile'],
    weaknesses: ['Premium price', 'Minimum order quantity applies'],
    recommended: true,
  },
  'SUP-004': {
    estimatedPrice: 91,
    deliveryDays: 14,
    capacity: 'Medium',
    capacityPct: 70,
    deliveryPerformance: 80,
    qualityScore: 85,
    riskScore: 52,
    overallScore: 76,
    strengths: ['Balanced price-quality', 'Good capacity'],
    weaknesses: ['Medium risk level', 'Occasional delays'],
    recommended: false,
  },
}

// Mini progress bar component
const Bar = ({ value, max = 100, className = '' }) => (
  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
    <div
      className={cx('h-full rounded-full transition-all', barColor(value), className)}
      style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
    />
  </div>
)

const MetricRow = ({ label, value, max = 100 }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
    <Bar value={value} max={max} />
    <span className={cx('text-xs font-semibold w-8 text-right', scoreColor(value))}>{value}</span>
  </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const CreateRFQ = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { suppliers, createRFQ, sendRFQ } = useWorkflow()
  const requirement = location.state?.requirement

  const [formData, setFormData] = useState({
    requirementId: requirement?.id || '',
    component: requirement?.componentName || '',
    category: requirement?.componentCategory || '',
    quantity: requirement?.shortageQuantity || '',
    specifications: requirement
      ? `Technical specifications for ${requirement.componentName}. Must meet OEM standards and automotive-grade quality requirements.`
      : '',
    deliveryDeadline: requirement?.requiredDeliveryDate || '',
    expectedBudget: '',
    quotationDeadlineDate: '',
    quotationDeadlineTime: '17:00',
    additionalRequirements:
      'ISO 9001 certified supplier required. Warranty: 12 months. Delivery with full documentation.',
    description: requirement
      ? `Procurement of ${requirement.componentName} to resolve inventory shortage of ${requirement.shortageQuantity?.toLocaleString() || ''} units.`
      : '',
  })

  const [selectedSuppliers, setSelectedSuppliers] = useState([])
  const [sortBy, setSortBy] = useState('overallScore')
  const [sortDir, setSortDir] = useState('desc')
  const [riskFilter, setRiskFilter] = useState('all')
  const [expandedSupplier, setExpandedSupplier] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [step, setStep] = useState(1) // 1 = RFQ Details, 2 = Supplier Selection, 3 = Review & Send

  const intel = (id) => supplierIntelligence[id] || {
    estimatedPrice: 100, deliveryDays: 14, capacity: 'Medium', capacityPct: 70,
    deliveryPerformance: 80, qualityScore: 80, riskScore: 50, overallScore: 75,
    strengths: [], weaknesses: [], recommended: false,
  }

  // Enrich suppliers with intelligence data
  const enrichedSuppliers = useMemo(() => {
    return suppliers.map(s => ({ ...s, ...intel(s.id) }))
  }, [suppliers])

  // Filter + sort
  const filteredSuppliers = useMemo(() => {
    let list = enrichedSuppliers.filter(s => {
      if (riskFilter === 'all') return true
      return (s.riskLevel || '').toLowerCase() === riskFilter
    })
    list = [...list].sort((a, b) => {
      const av = a[sortBy] ?? 0
      const bv = b[sortBy] ?? 0
      return sortDir === 'desc' ? bv - av : av - bv
    })
    return list
  }, [enrichedSuppliers, riskFilter, sortBy, sortDir])

  const recommendedSupplier = enrichedSuppliers.find(s => s.recommended)
  const selectedCount = selectedSuppliers.length

  const handleSupplierToggle = (id) => {
    setSelectedSuppliers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(field); setSortDir('desc') }
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.component || !formData.quantity || !formData.deliveryDeadline) {
        alert('Please fill in Component, Quantity, and Delivery Deadline.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (selectedCount === 0) {
        alert('Please select at least one supplier to send the RFQ.')
        return
      }
      setStep(3)
    }
  }

  const handleConfirmSend = () => {
    if (!formData.quotationDeadlineDate) {
      alert('Please set the Quotation Submission Deadline.')
      return
    }
    setIsCreating(true)
    const rfqData = {
      ...formData,
      quantity: parseInt(formData.quantity) || 0,
      expectedBudget: parseInt(formData.expectedBudget) || 0,
      quotationDeadline: `${formData.quotationDeadlineDate} ${formData.quotationDeadlineTime}`,
      selectedSuppliers,
    }
    const newRFQ = createRFQ(rfqData)
    sendRFQ(newRFQ.id, selectedSuppliers)
    setIsCreating(false)
    navigate('/rfqs', { state: { success: true, rfqId: newRFQ.id } })
  }

  // ── Compare table ──────────────────────────────────────────────────────────
  const compareSuppliers = enrichedSuppliers.filter(s => selectedSuppliers.includes(s.id))

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {step > 1 ? 'Back' : 'Planning & Inventory'}
            </button>
            <div className="w-px h-5 bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create RFQ</h1>
              {requirement && (
                <p className="text-xs text-gray-500 mt-0.5">
                  From: {requirement.id} — {requirement.componentName}
                </p>
              )}
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[
              { n: 1, label: 'RFQ Details' },
              { n: 2, label: 'Supplier Selection' },
              { n: 3, label: 'Review & Send' },
            ].map(({ n, label }, i) => (
              <div key={n} className="flex items-center gap-2">
                <div className={cx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  step === n ? 'bg-blue-600 text-white shadow-sm' :
                    step > n ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                )}>
                  {step > n
                    ? <CheckCircle className="w-3.5 h-3.5" />
                    : <span className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-current text-[10px]">{n}</span>
                  }
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 2 && <ArrowRight className="w-3 h-3 text-gray-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-6">

        {/* ════════════════════════════════════════════════
            STEP 1 — RFQ Details
        ════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: main form */}
            <div className="lg:col-span-2 space-y-5">
              {/* Requirement Summary Banner */}
              {requirement && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900">Procurement Need Identified</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {requirement.componentName} — Shortage of{' '}
                      <strong>{requirement.shortageQuantity?.toLocaleString()}</strong> units.
                      Priority: <strong className="capitalize">{requirement.priority}</strong>. Required by{' '}
                      <strong>{requirement.requiredDeliveryDate}</strong>.
                    </p>
                  </div>
                  <span className={cx(
                    'text-xs font-bold px-2 py-1 rounded-full',
                    requirement.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      requirement.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                  )}>
                    {requirement.priority?.toUpperCase()}
                  </span>
                </div>
              )}

              {/* RFQ Details Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">RFQ Details</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Fill in the procurement requirements</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Component *</label>
                      <input
                        name="component"
                        value={formData.component}
                        onChange={handleInputChange}
                        placeholder="e.g. Electronic Control Unit"
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                      <input
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g. Electronics"
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Required Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="e.g. 500"
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Expected Budget (₹)</label>
                      <input
                        type="number"
                        name="expectedBudget"
                        value={formData.expectedBudget}
                        onChange={handleInputChange}
                        placeholder="e.g. 1500000"
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">RFQ Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Brief description of this procurement..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Technical Specifications</label>
                    <textarea
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Enter detailed technical specifications..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Required Delivery Date *</label>
                      <input
                        type="date"
                        name="deliveryDeadline"
                        value={formData.deliveryDeadline}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        <Clock className="w-3.5 h-3.5 inline mr-1" />
                        Quotation Deadline Date
                      </label>
                      <input
                        type="date"
                        name="quotationDeadlineDate"
                        value={formData.quotationDeadlineDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Quotation Deadline Time</label>
                      <input
                        type="time"
                        name="quotationDeadlineTime"
                        value={formData.quotationDeadlineTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Terms & Requirements</label>
                    <textarea
                      name="additionalRequirements"
                      value={formData.additionalRequirements}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="ISO certification, warranty, documentation requirements..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Next: Select Suppliers
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Quick RFQ Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  RFQ Summary
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Component', value: formData.component || '—' },
                    { label: 'Category', value: formData.category || '—' },
                    { label: 'Quantity', value: formData.quantity ? Number(formData.quantity).toLocaleString() + ' units' : '—' },
                    { label: 'Budget', value: formData.expectedBudget ? '₹' + Number(formData.expectedBudget).toLocaleString() : '—' },
                    { label: 'Delivery By', value: formData.deliveryDeadline || '—' },
                    {
                      label: 'Quotation Deadline',
                      value: formData.quotationDeadlineDate
                        ? `${formData.quotationDeadlineDate} ${formData.quotationDeadlineTime}`
                        : '—'
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-2">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className="text-xs font-medium text-gray-800 text-right max-w-[55%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 mb-2">
                  <Zap className="w-3.5 h-3.5" />
                  Workflow Next Steps
                </p>
                <ol className="text-xs text-amber-700 space-y-1.5 list-none">
                  {[
                    'Fill in RFQ details (current)',
                    'Select suppliers using Supplier Intelligence',
                    'Review & send RFQ',
                    'Suppliers submit quotations',
                    'Compare & negotiate',
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={cx(
                        'w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5',
                        i === 0 ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-700'
                      )}>{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            STEP 2 — Supplier Selection with Intelligence
        ════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Supplier Intelligence & Selection</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Compare suppliers, review risk profiles, and select those to receive the RFQ.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCompareMode(m => !m)}
                  className={cx(
                    'flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-all',
                    compareMode
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  )}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  {compareMode ? 'Hide' : 'Show'} Side-by-Side Comparison
                </button>
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700">
                  {selectedCount} supplier{selectedCount !== 1 ? 's' : ''} selected
                </div>
              </div>
            </div>

            {/* Recommended Supplier Banner */}
            {recommendedSupplier && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-4">
                <div className="p-2.5 bg-emerald-500 rounded-xl">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-emerald-900">
                    AI Recommended Supplier: {recommendedSupplier.name}
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Best overall score ({recommendedSupplier.overallScore}/100) — Excellent delivery performance ({recommendedSupplier.deliveryPerformance}%),
                    premium quality ({recommendedSupplier.qualityScore}/100), and lowest risk profile.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-black text-emerald-600">{recommendedSupplier.overallScore}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Overall Score</div>
                </div>
                <button
                  onClick={() => {
                    if (!selectedSuppliers.includes(recommendedSupplier.id)) {
                      setSelectedSuppliers(prev => [...prev, recommendedSupplier.id])
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  Select
                </button>
              </div>
            )}

            {/* Filters & Sort Bar */}
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Risk Level:</span>
                {['all', 'low', 'medium', 'high'].map(r => (
                  <button
                    key={r}
                    onClick={() => setRiskFilter(r)}
                    className={cx(
                      'px-2.5 py-1 text-xs font-semibold rounded-full capitalize transition-all',
                      riskFilter === r
                        ? r === 'all' ? 'bg-gray-800 text-white' :
                          r === 'low' ? 'bg-emerald-600 text-white' :
                            r === 'medium' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >{r}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sort by:</span>
                {[
                  { key: 'overallScore', label: 'Overall Score' },
                  { key: 'estimatedPrice', label: 'Price' },
                  { key: 'deliveryPerformance', label: 'Delivery' },
                  { key: 'riskScore', label: 'Risk' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleSort(key)}
                    className={cx(
                      'flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full transition-all',
                      sortBy === key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {label}
                    {sortBy === key && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-Side Comparison Table (conditionally shown) */}
            {compareMode && selectedCount >= 2 && (
              <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-blue-50 border-b border-blue-200 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-blue-900">Side-by-Side Supplier Comparison</h3>
                  <span className="ml-auto text-xs text-blue-600">{compareSuppliers.length} suppliers selected</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3 w-36">Metric</th>
                        {compareSuppliers.map(s => (
                          <th key={s.id} className="text-center text-xs font-semibold text-gray-800 px-4 py-3">
                            <div>{s.name}</div>
                            {s.recommended && (
                              <div className="text-[10px] text-emerald-600 font-bold">★ RECOMMENDED</div>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Est. Price / Unit', key: 'estimatedPrice', format: v => `₹${v}`, higher: false },
                        { label: 'Delivery Days', key: 'deliveryDays', format: v => `${v} days`, higher: false },
                        { label: 'Delivery Perf.', key: 'deliveryPerformance', format: v => `${v}%`, higher: true },
                        { label: 'Quality Score', key: 'qualityScore', format: v => `${v}/100`, higher: true },
                        { label: 'Capacity', key: 'capacityPct', format: v => `${v}%`, higher: true },
                        { label: 'Risk Score', key: 'riskScore', format: v => `${v}/100`, higher: false },
                        { label: 'Overall Score', key: 'overallScore', format: v => `${v}/100`, higher: true },
                        { label: 'Risk Level', key: 'riskLevel', format: v => v || 'N/A', higher: null },
                      ].map(({ label, key, format, higher }) => {
                        const vals = compareSuppliers.map(s => s[key])
                        const best = higher === true ? Math.max(...vals) : higher === false ? Math.min(...vals) : null
                        return (
                          <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="text-xs text-gray-600 font-medium px-4 py-2.5">{label}</td>
                            {compareSuppliers.map(s => {
                              const v = s[key]
                              const isBest = best !== null && v === best
                              return (
                                <td key={s.id} className="text-center px-4 py-2.5">
                                  <span className={cx(
                                    'text-xs font-semibold px-2 py-0.5 rounded',
                                    key === 'riskLevel'
                                      ? riskBg(v)
                                      : isBest
                                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                                        : 'text-gray-700'
                                  )}>
                                    {format(v)}
                                    {isBest && key !== 'riskLevel' && ' ✓'}
                                  </span>
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                      <tr className="bg-gray-50">
                        <td className="text-xs text-gray-600 font-semibold px-4 py-3">Strengths</td>
                        {compareSuppliers.map(s => (
                          <td key={s.id} className="px-4 py-3">
                            <ul className="space-y-1">
                              {s.strengths.map((str, i) => (
                                <li key={i} className="flex items-center gap-1 text-xs text-emerald-700">
                                  <Check className="w-3 h-3 shrink-0" />{str}
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="text-xs text-gray-600 font-semibold px-4 py-3">Weaknesses</td>
                        {compareSuppliers.map(s => (
                          <td key={s.id} className="px-4 py-3">
                            <ul className="space-y-1">
                              {s.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-center gap-1 text-xs text-red-600">
                                  <XCircle className="w-3 h-3 shrink-0" />{w}
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {compareMode && selectedCount < 2 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 text-center">
                Select at least 2 suppliers to see the side-by-side comparison.
              </div>
            )}

            {/* Supplier Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
              {filteredSuppliers.map(supplier => {
                const isSelected = selectedSuppliers.includes(supplier.id)
                const isExpanded = expandedSupplier === supplier.id
                const isHighRisk = (supplier.riskLevel || '').toLowerCase() === 'high'
                const isRecommended = supplier.recommended

                return (
                  <div
                    key={supplier.id}
                    className={cx(
                      'bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden',
                      isSelected
                        ? 'border-blue-500 shadow-lg shadow-blue-100'
                        : isHighRisk
                          ? 'border-red-200 hover:border-red-300'
                          : isRecommended
                            ? 'border-emerald-200 hover:border-emerald-400'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    )}
                  >
                    {/* Card Top */}
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => handleSupplierToggle(supplier.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div className={cx(
                            'w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all',
                            isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          )}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-gray-900">{supplier.name}</span>
                              {isRecommended && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                                  <Star className="w-2.5 h-2.5" /> AI RECOMMENDED
                                </span>
                              )}
                              {isHighRisk && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                                  <AlertTriangle className="w-2.5 h-2.5" /> HIGH RISK
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {supplier.category} • {supplier.location}
                            </p>
                          </div>
                        </div>

                        {/* Overall Score Circle */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className={cx(
                            'w-12 h-12 rounded-full flex items-center justify-center text-base font-black border-2',
                            supplier.overallScore >= 85 ? 'border-emerald-400 bg-emerald-50 text-emerald-700' :
                              supplier.overallScore >= 70 ? 'border-amber-400 bg-amber-50 text-amber-700' :
                                'border-red-400 bg-red-50 text-red-700'
                          )}>
                            {supplier.overallScore}
                          </div>
                          <span className="text-[9px] text-gray-400 mt-0.5 font-medium">SCORE</span>
                        </div>
                      </div>

                      {/* Key Metrics Row */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[
                          { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Price', value: `₹${supplier.estimatedPrice}`, sub: '/unit' },
                          { icon: <Truck className="w-3.5 h-3.5" />, label: 'Delivery', value: supplier.deliveryDays, sub: ' days' },
                          { icon: <Award className="w-3.5 h-3.5" />, label: 'Quality', value: supplier.qualityScore, sub: '/100' },
                          { icon: <Shield className="w-3.5 h-3.5" />, label: 'Risk', value: supplier.riskLevel, sub: '' },
                        ].map(({ icon, label, value, sub }) => (
                          <div key={label} className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className={cx('flex justify-center mb-1', riskColor(label === 'Risk' ? value : null))}>{icon}</div>
                            <div className="text-[10px] text-gray-500 font-medium">{label}</div>
                            <div className={cx(
                              'text-xs font-bold',
                              label === 'Risk' ? riskColor(value) : 'text-gray-800'
                            )}>
                              {value}{sub}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Score Bars */}
                      <div className="space-y-2">
                        <MetricRow label="Delivery Perf." value={supplier.deliveryPerformance} />
                        <MetricRow label="Quality" value={supplier.qualityScore} />
                        <MetricRow label="Capacity" value={supplier.capacityPct} />
                        <MetricRow label="Risk Stability" value={100 - supplier.riskScore} />
                      </div>

                      {/* High Risk Warning */}
                      {isHighRisk && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-red-800">High Risk Warning</p>
                            <p className="text-[11px] text-red-600 mt-0.5">
                              This supplier has a high risk profile (score: {supplier.riskScore}/100). Consider alternative suppliers or implement additional risk mitigation measures.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand/Collapse Strengths & Weaknesses */}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedSupplier(isExpanded ? null : supplier.id) }}
                        className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          {isExpanded ? 'Hide' : 'View'} Strengths & Weaknesses
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Strengths
                            </p>
                            <ul className="space-y-1.5">
                              {supplier.strengths.map((s, i) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />{s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Weaknesses
                            </p>
                            <ul className="space-y-1.5">
                              {supplier.weaknesses.map((w, i) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />{w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Bottom — Select Button */}
                    <div
                      className={cx(
                        'px-5 py-3 border-t transition-colors',
                        isSelected ? 'bg-blue-50 border-blue-100' : 'border-gray-100'
                      )}
                    >
                      <button
                        onClick={() => handleSupplierToggle(supplier.id)}
                        className={cx(
                          'w-full flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all',
                          isSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {isSelected ? (
                          <><Check className="w-3.5 h-3.5" /> Selected — Click to Remove</>
                        ) : (
                          <>Select this Supplier</>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedCount} supplier{selectedCount !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedCount === 0
                    ? 'Select at least one supplier to proceed'
                    : `RFQ will be sent to: ${enrichedSuppliers.filter(s => selectedSuppliers.includes(s.id)).map(s => s.name).join(', ')}`}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit RFQ Details
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={selectedCount === 0}
                  className={cx(
                    'flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition-all',
                    selectedCount > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                >
                  Review & Send RFQ
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            STEP 3 — Review & Send
        ════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Full RFQ Review */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <h2 className="text-base font-bold">RFQ Review Summary</h2>
                  <p className="text-xs text-blue-100 mt-0.5">Review all details before sending</p>
                </div>
                <div className="p-6 space-y-5">
                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Component', value: formData.component },
                      { label: 'Category', value: formData.category },
                      { label: 'Required Quantity', value: `${Number(formData.quantity).toLocaleString()} units` },
                      { label: 'Expected Budget', value: formData.expectedBudget ? `₹${Number(formData.expectedBudget).toLocaleString()}` : 'Not specified' },
                      { label: 'Required Delivery Date', value: formData.deliveryDeadline },
                      { label: 'Quotation Deadline', value: `${formData.quotationDeadlineDate} ${formData.quotationDeadlineTime}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                        <p className="text-sm font-semibold text-gray-900">{value || '—'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                    <p className="text-sm text-gray-800">{formData.description || '—'}</p>
                  </div>

                  {/* Specifications */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Technical Specifications</p>
                    <p className="text-sm text-gray-800">{formData.specifications || '—'}</p>
                  </div>

                  {/* Terms */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Terms & Requirements</p>
                    <p className="text-sm text-gray-800">{formData.additionalRequirements || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Selected Suppliers Review */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">
                    Selected Suppliers ({selectedCount})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">These suppliers will receive the RFQ</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {enrichedSuppliers.filter(s => selectedSuppliers.includes(s.id)).map(s => (
                    <div key={s.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cx(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white',
                          s.recommended ? 'bg-emerald-500' : s.riskLevel?.toLowerCase() === 'high' ? 'bg-red-500' : 'bg-blue-500'
                        )}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            {s.name}
                            {s.recommended && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">RECOMMENDED</span>}
                            {(s.riskLevel || '').toLowerCase() === 'high' && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">HIGH RISK</span>}
                          </p>
                          <p className="text-xs text-gray-500">{s.category} • {s.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-gray-600">
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">₹{s.estimatedPrice}/unit</div>
                          <div className="text-gray-400">Est. Price</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">{s.overallScore}/100</div>
                          <div className="text-gray-400">Score</div>
                        </div>
                        <div className="text-center">
                          <div className={cx('font-semibold', riskColor(s.riskLevel))}>{s.riskLevel}</div>
                          <div className="text-gray-400">Risk</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar: Confirm and Send */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  Ready to Send
                </h3>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-gray-700">RFQ details filled in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-gray-700">{selectedCount} supplier{selectedCount !== 1 ? 's' : ''} selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.quotationDeadlineDate
                      ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                      : <AlertTriangle className="w-4 h-4 text-amber-500" />
                    }
                    <span className="text-xs text-gray-700">
                      {formData.quotationDeadlineDate
                        ? `Deadline: ${formData.quotationDeadlineDate} ${formData.quotationDeadlineTime}`
                        : 'Quotation deadline not set'}
                    </span>
                  </div>
                </div>

                {!formData.quotationDeadlineDate && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-amber-700 mb-1.5">
                      Set Quotation Deadline *
                    </label>
                    <input
                      type="date"
                      name="quotationDeadlineDate"
                      value={formData.quotationDeadlineDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <button
                  onClick={handleConfirmSend}
                  disabled={isCreating}
                  className={cx(
                    'w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all',
                    isCreating
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                  )}
                >
                  <Send className="w-4 h-4" />
                  {isCreating ? 'Creating RFQ...' : 'Create & Send RFQ'}
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Modify Supplier Selection
                </button>
              </div>

              {/* What happens next */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-800 mb-3">What happens after sending?</p>
                <ol className="space-y-2">
                  {[
                    'RFQ appears in Supplier Dashboard',
                    'Suppliers review and submit quotations',
                    'Deadline enforced — late submissions flagged',
                    'You compare and shortlist suppliers',
                    'Negotiation and final selection',
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                      <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateRFQ
