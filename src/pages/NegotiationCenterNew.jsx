import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import WorkflowTracker from '../components/shared/WorkflowTracker'
import { postNegotiationMessage } from '../api/negotiations'
import { triggerNegotiationRequest } from '../api/events'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MessageSquare, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  X, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  User, 
  Building, 
  Calendar, 
  FileText,
  ShieldAlert,
  Percent,
  Sparkles,
  Brain,
  Lightbulb,
  Check,
  ChevronRight,
  Loader2
} from 'lucide-react'

const NegotiationCenterNew = () => {
  const navigate = useNavigate()
  const { negotiationId } = useParams()
  const { negotiations, setNegotiations, updateNegotiation, rfqs, quotations, suppliers } = useWorkflow()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedNegotiation, setSelectedNegotiation] = useState(null)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [notification, setNotification] = useState(null)
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [isApplyingAI, setIsApplyingAI] = useState(false)
  const [offerData, setOfferData] = useState({
    proposedPrice: '',
    quantity: '',
    delivery: '',
    terms: '',
    message: ''
  })

  /** Trigger 2 — Required Negotiation */
  const handleRequireNegotiation = async (neg, reason = 'Negotiation required by Procurement Manager') => {
    if (!neg) return
    setIsNegotiating(true)
    try {
      await triggerNegotiationRequest({
        rfq_id:               neg.rfqId || neg.rfq_id || null,
        quotation_id:         neg.quotationId || neg.quotation_id || null,
        supplier_id:          neg.supplierId || neg.supplier_id || null,
        component_id:         neg.componentId || neg.component_id || null,
        quoted_price:         neg.currentOffer?.price || neg.targetPrice || null,
        quoted_quantity:      neg.quantity || null,
        quoted_delivery_date: neg.targetDelivery || null,
        negotiation_reason:   reason,
        priority:             neg.priority === 'urgent' || neg.priority === 'critical' ? 'CRITICAL' : 'HIGH',
      })
      setNotification({ type: 'success', message: `✅ Negotiation request sent to n8n for ${neg.supplierName}` })
      setTimeout(() => setNotification(null), 5000)
    } catch (err) {
      setNotification({ type: 'error', message: `❌ Failed: ${err.message}` })
      setTimeout(() => setNotification(null), 5000)
    } finally {
      setIsNegotiating(false)
    }
  }


  // Normalize all available negotiations combining context negotiations and received quotations
  const allNegotiations = (() => {
    const list = [...negotiations]

    // Also build virtual negotiations for any RFQ with received quotes if not already present
    rfqs.forEach(rfq => {
      const alreadyInList = list.some(n => n.rfqId === rfq.id || n.rfq_id === rfq.id)
      if (!alreadyInList) {
        const rfqQuotes = quotations.filter(q => q.rfqId === rfq.id)
        if (rfqQuotes.length > 0) {
          const primaryQuote = [...rfqQuotes].sort((a, b) => (Number(a.unitPrice) || 0) - (Number(b.unitPrice) || 0))[0]
          const assignedSupplier = suppliers.find(s => s.id === primaryQuote.supplierId) || suppliers[0]
          const unitPrice = Number(primaryQuote.unitPrice || 100)
          const qty = Number(rfq.quantity || primaryQuote.quantity || 1000)
          const target = Math.round(unitPrice * 0.92)

          list.push({
            id: `NEG-${rfq.id.slice(0, 8)}`,
            rfqId: rfq.id,
            quotationId: primaryQuote.id,
            supplierId: assignedSupplier?.id || 'SUP-001',
            supplierName: assignedSupplier?.name || primaryQuote.supplierName || 'TechCorp Industries',
            component: rfq.component || 'Automotive Component',
            quantity: qty,
            originalPrice: unitPrice,
            revisedPrice: unitPrice,
            targetPrice: target,
            currentOffer: unitPrice,
            deliveryRequirement: primaryQuote.deliveryTime || 12,
            paymentTerms: primaryQuote.paymentTerms || 'Net 30',
            status: 'negotiation_active',
            dealStatus: 'under_negotiation',
            lastUpdated: new Date().toLocaleDateString(),
            negotiationHistory: [
              {
                id: 'NH-init-1',
                participant: 'system',
                message: `RFQ ${rfq.id} released to suppliers.`,
                price: null,
                timestamp: rfq.sentDate || '2 days ago'
              },
              {
                id: 'NH-init-2',
                participant: 'supplier',
                message: `Initial quotation submitted: ₹${unitPrice}/unit with ${primaryQuote.deliveryTime || 12}-day delivery.`,
                price: unitPrice,
                timestamp: primaryQuote.submittedDate || '1 day ago'
              }
            ]
          })
        }
      }
    })

    return list
  })()

  const formatNegotiation = (neg) => {
    const orig = Number(neg.originalPrice || neg.revisedPrice || 100)
    const current = Number(neg.currentOffer || neg.revisedPrice || orig)
    const target = Number(neg.targetPrice || Math.round(orig * 0.92))
    const qty = Number(neg.quantity || 1000)

    return {
      ...neg,
      originalPrice: orig,
      revisedPrice: Number(neg.revisedPrice || orig),
      targetPrice: target,
      currentOffer: current,
      quantity: qty,
      deliveryRequirement: neg.deliveryRequirement || 12,
      paymentTerms: neg.paymentTerms || 'Net 30',
      dealStatus: neg.status?.toLowerCase() === 'deal_agreed' ? 'agreed' : (neg.dealStatus || 'under_negotiation'),
      aiSuggestedPrice: Math.round(orig * 0.94),
      aiConfidence: 94,
      aiStrategy: `Leverage volume commitment (${qty.toLocaleString()} units) and prompt payment terms (${neg.paymentTerms || 'Net 30'}) to request an optimal ₹${Math.round(orig * 0.94)}/unit counter-offer.`,
      negotiationHistory: neg.negotiationHistory || [
        {
          id: 'NH-default-1',
          participant: 'supplier',
          message: `Quotation submitted for ${neg.component || 'Component'} at ₹${orig}/unit.`,
          price: orig,
          timestamp: '2 days ago'
        }
      ]
    }
  }

  // Sync route param negotiationId with state (support both negotiation ID and RFQ ID)
  useEffect(() => {
    if (!allNegotiations.length) return

    if (negotiationId) {
      // 1. Match direct ID or RFQ ID
      const match = allNegotiations.find(
        n => n.id === negotiationId || n.rfqId === negotiationId || n.rfq_id === negotiationId
      )
      if (match) {
        setSelectedNegotiation(formatNegotiation(match))
        return
      }

      // 2. Try matching from raw rfqs
      const targetRfq = rfqs.find(r => r.id === negotiationId)
      if (targetRfq) {
        const rfqQuotes = quotations.filter(q => q.rfqId === targetRfq.id)
        const primaryQuote = rfqQuotes[0]
        const assignedSupplier = suppliers.find(s => s.id === (primaryQuote?.supplierId || targetRfq.supplierIds?.[0])) || suppliers[0]
        const unitPrice = Number(primaryQuote?.unitPrice || 100)
        const qty = Number(targetRfq.quantity || 1000)
        const target = Math.round(unitPrice * 0.92)

        const dynamicNeg = {
          id: `NEG-${targetRfq.id.slice(0, 8)}`,
          rfqId: targetRfq.id,
          quotationId: primaryQuote?.id || `QT-${targetRfq.id.slice(0, 8)}`,
          supplierId: assignedSupplier?.id || 'SUP-001',
          supplierName: assignedSupplier?.name || primaryQuote?.supplierName || 'TechCorp Industries',
          component: targetRfq.component || 'Required Component',
          quantity: qty,
          originalPrice: unitPrice,
          revisedPrice: unitPrice,
          targetPrice: target,
          currentOffer: unitPrice,
          deliveryRequirement: primaryQuote?.deliveryTime || 12,
          paymentTerms: primaryQuote?.paymentTerms || 'Net 30',
          status: 'negotiation_active',
          dealStatus: 'under_negotiation',
          lastUpdated: new Date().toLocaleDateString(),
          negotiationHistory: [
            {
              id: 'NH-1',
              participant: 'system',
              message: `RFQ ${targetRfq.id} dispatched to suppliers`,
              price: null,
              timestamp: targetRfq.sentDate || new Date().toLocaleDateString()
            },
            ...(primaryQuote ? [{
              id: 'NH-2',
              participant: 'supplier',
              message: `Initial quotation submitted: ₹${primaryQuote.unitPrice}/unit with ${primaryQuote.deliveryTime || 12}-day delivery.`,
              price: primaryQuote.unitPrice,
              timestamp: primaryQuote.submittedAt || primaryQuote.submittedDate || new Date().toLocaleDateString()
            }] : [])
          ]
        }
        setSelectedNegotiation(formatNegotiation(dynamicNeg))
        return
      }
    }

    // Default to the first negotiation if available and none selected
    if (!selectedNegotiation && allNegotiations.length > 0) {
      setSelectedNegotiation(formatNegotiation(allNegotiations[0]))
    }
  }, [negotiationId, negotiations, rfqs, quotations, suppliers])

  const getStatusVariant = (status) => {
    const variants = {
      'negotiation_active': 'primary',
      'counter_offer_received': 'warning',
      'awaiting_supplier': 'accent',
      'deal_agreed': 'success',
      'deal_declined': 'danger',
      'negotiation_closed': 'default'
    }
    return variants[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'negotiation_active': 'Active Negotiation',
      'counter_offer_received': 'Counter Offer Received',
      'awaiting_supplier': 'Awaiting Supplier Response',
      'deal_agreed': 'Deal Finalized',
      'deal_declined': 'Declined',
      'negotiation_closed': 'Closed'
    }
    return labels[status] || status?.replace(/_/g, ' ') || 'Active'
  }

  const filteredNegotiations = allNegotiations.filter(neg => {
    const matchesSearch = (neg.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (neg.component || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (neg.rfqId || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || neg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectNegotiation = (neg) => {
    const formatted = formatNegotiation(neg)
    setSelectedNegotiation(formatted)
    setShowOfferForm(false)
    navigate(`/negotiation-center/${neg.id}`)
  }

  const applyDiscountPreset = (pct) => {
    if (!selectedNegotiation) return
    const orig = selectedNegotiation.originalPrice
    const discountPrice = Math.round(orig * (1 - pct / 100))
    setOfferData(prev => ({
      ...prev,
      proposedPrice: discountPrice.toString(),
      message: `We propose a revised price of ₹${discountPrice}/unit (${pct}% discount) for order confirmation.`
    }))
  }

  const applyAISuggestion = async () => {
    if (!selectedNegotiation) return
    setIsApplyingAI(true)

    const proposedPrice = (selectedNegotiation.aiSuggestedPrice || Math.round((selectedNegotiation.originalPrice || 100) * 0.94)).toString()
    const delivery = (selectedNegotiation.deliveryRequirement || 14).toString()
    const terms = selectedNegotiation.paymentTerms || 'Net 30'
    const rationale = `Based on volume assurance (${selectedNegotiation.quantity || 1000} units) and standard ${terms} terms, we propose an optimized rate of ₹${proposedPrice}/unit.`

    // 1. Populate the counter-offer form immediately
    setShowOfferForm(true)
    setOfferData({
      proposedPrice: proposedPrice,
      quantity: (selectedNegotiation.quantity || 1000).toString(),
      delivery: delivery,
      terms: terms,
      message: rationale
    })

    // 2. Trigger the workflow to deliver negotiation details to the webhook
    try {
      await triggerNegotiationRequest({
        rfq_id:               selectedNegotiation.rfqId || selectedNegotiation.rfq_id || null,
        quotation_id:         selectedNegotiation.quotationId || selectedNegotiation.quotation_id || null,
        supplier_id:          selectedNegotiation.supplierId || selectedNegotiation.supplier_id || null,
        component_id:         selectedNegotiation.component_id || selectedNegotiation.componentId || null,
        quoted_price:         selectedNegotiation.originalPrice || selectedNegotiation.currentOffer || selectedNegotiation.revisedPrice || null,
        quoted_quantity:      selectedNegotiation.quantity || 1000,
        quoted_delivery_date: selectedNegotiation.targetDelivery || `${delivery} days`,
        negotiation_reason:   selectedNegotiation.aiStrategy || `AI Proposal applied: target counter price ₹${proposedPrice}/unit with ${delivery} days lead time`,
        priority:             selectedNegotiation.priority === 'urgent' || selectedNegotiation.priority === 'critical' ? 'CRITICAL' : 'HIGH',
        proposed_counter_price: Number(proposedPrice),
        target_delivery_days: Number(delivery),
        payment_terms:        terms,
        ai_confidence:        selectedNegotiation.aiConfidence || 94,
        ai_strategy:          selectedNegotiation.aiStrategy
      })

      setNotification({
        type: 'success',
        message: `✅ AI Negotiation workflow triggered for ${selectedNegotiation.supplierName}! Details delivered to webhook.`
      })
      setTimeout(() => setNotification(null), 5000)
    } catch (err) {
      console.warn('AI negotiation workflow trigger:', err)
      setNotification({
        type: 'info',
        message: `AI Proposal applied to form (Workflow status: ${err.message || 'Queued'})`
      })
      setTimeout(() => setNotification(null), 5000)
    } finally {
      setIsApplyingAI(false)
    }
  }

  const handleSendOffer = async () => {
    if (!selectedNegotiation) return
    if (!offerData.proposedPrice && !offerData.message) {
      alert('Please enter a proposed price or negotiation message.')
      return
    }

    try {
      setIsSendingMessage(true)
      const newPrice = Number(offerData.proposedPrice) || selectedNegotiation.currentOffer
      const content = offerData.message || `Proposed target price of ₹${newPrice}/unit with ${offerData.delivery || selectedNegotiation.deliveryRequirement} days delivery.`

      // Post to backend if applicable
      if (selectedNegotiation.id && !selectedNegotiation.id.startsWith('NEG-')) {
        try {
          await postNegotiationMessage(selectedNegotiation.id, content)
        } catch (e) {
          console.warn('Backend message sync notification:', e)
        }
      }

      const newHistoryItem = {
        id: `NH-${Date.now()}`,
        participant: 'procurement',
        action: 'offer_sent',
        message: content,
        price: newPrice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today'
      }

      const updatedOffer = {
        ...selectedNegotiation,
        status: 'awaiting_supplier',
        currentOffer: newPrice,
        deliveryRequirement: offerData.delivery ? Number(offerData.delivery) : selectedNegotiation.deliveryRequirement,
        paymentTerms: offerData.terms || selectedNegotiation.paymentTerms,
        negotiationHistory: [...(selectedNegotiation.negotiationHistory || []), newHistoryItem]
      }

      setSelectedNegotiation(updatedOffer)
      if (updateNegotiation) {
        updateNegotiation(selectedNegotiation.id, updatedOffer)
      } else if (setNegotiations) {
        setNegotiations(prev => prev.map(n => n.id === selectedNegotiation.id ? updatedOffer : n))
      }

      setShowOfferForm(false)
      setOfferData({ proposedPrice: '', quantity: '', delivery: '', terms: '', message: '' })
      setNotification({
        type: 'success',
        message: `Counter-offer of ₹${newPrice}/unit dispatched to ${selectedNegotiation.supplierName}.`
      })
      setTimeout(() => setNotification(null), 5000)
    } catch (err) {
      console.error('Failed to send offer:', err)
      alert('Failed to send negotiation offer: ' + err.message)
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleAcceptOffer = () => {
    if (!selectedNegotiation) return
    
    const agreedPrice = Number(selectedNegotiation.currentOffer)
    const origPrice = Number(selectedNegotiation.originalPrice)
    const qty = Number(selectedNegotiation.quantity || 1000)
    const savings = Math.max(0, (origPrice - agreedPrice) * qty)

    const newHistory = {
      id: `NH-${Date.now()}`,
      participant: 'procurement',
      action: 'offer_accepted',
      message: `Accepted supplier offer of ₹${agreedPrice}/unit. Terms agreed & deal confirmed.`,
      price: agreedPrice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today'
    }

    const updatedNegotiation = {
      ...selectedNegotiation,
      status: 'deal_agreed',
      dealStatus: 'agreed',
      finalAgreedPrice: agreedPrice,
      finalDelivery: selectedNegotiation.deliveryRequirement,
      totalSavings: savings,
      lastUpdated: new Date().toLocaleDateString(),
      negotiationHistory: [...(selectedNegotiation.negotiationHistory || []), newHistory]
    }

    setSelectedNegotiation(updatedNegotiation)
    if (updateNegotiation) {
      updateNegotiation(selectedNegotiation.id, updatedNegotiation)
    } else if (setNegotiations) {
      setNegotiations(prev => prev.map(n => n.id === selectedNegotiation.id ? updatedNegotiation : n))
    }
    setShowConfirmDialog(false)
    setNotification({
      type: 'success',
      message: `Deal confirmed at ₹${agreedPrice}/unit! Total savings: ₹${savings.toLocaleString()}.`
    })
  }

  const handleCounterOffer = () => {
    if (!selectedNegotiation) return
    setShowOfferForm(true)
    setOfferData({
      proposedPrice: selectedNegotiation.targetPrice?.toString() || selectedNegotiation.currentOffer?.toString() || '',
      quantity: selectedNegotiation.quantity?.toString() || '',
      delivery: selectedNegotiation.deliveryRequirement?.toString() || '',
      terms: selectedNegotiation.paymentTerms || '',
      message: `We appreciate your quotation of ₹${selectedNegotiation.currentOffer}/unit. We propose ₹${selectedNegotiation.targetPrice}/unit for bulk order placement.`
    })
  }

  const handleProceedToApproval = () => {
    if (selectedNegotiation?.rfqId) {
      navigate(`/final-supplier-selection/${selectedNegotiation.rfqId}`)
    } else {
      navigate('/rfqs')
    }
  }

  const isAgreed = selectedNegotiation?.dealStatus === 'agreed' || selectedNegotiation?.status === 'deal_agreed'
  const origPrice = selectedNegotiation ? selectedNegotiation.originalPrice : 0
  const currentPrice = selectedNegotiation ? selectedNegotiation.currentOffer : 0
  const targetPrice = selectedNegotiation ? selectedNegotiation.targetPrice : 0
  const quantity = selectedNegotiation ? selectedNegotiation.quantity : 1000
  const totalOriginal = origPrice * quantity
  const totalCurrent = currentPrice * quantity
  const totalSavings = Math.max(0, totalOriginal - totalCurrent)
  const savingsPct = totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-blue-600" />
            AI Negotiation Center
          </h1>
          <p className="text-gray-600 mt-0.5">
            Intelligent supplier price negotiation, strategy recommendations, and counter-offer management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/rfqs')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to RFQs
          </Button>
          {selectedNegotiation && isAgreed && (
            <Button onClick={handleProceedToApproval} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              Proceed to Final Selection
            </Button>
          )}
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center justify-between border shadow-sm ${
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
            <span className="font-semibold text-sm">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs font-bold underline ml-4 hover:opacity-80">Dismiss</button>
        </div>
      )}

      {/* Main Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Negotiations List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-navy-900">
                  Negotiations ({filteredNegotiations.length})
                </CardTitle>
                <Badge variant="primary" className="text-xs">
                  {allNegotiations.filter(n => n.status !== 'deal_agreed').length} Active
                </Badge>
              </div>
              
              {/* Search & Filter */}
              <div className="mt-3 space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search supplier, component, RFQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 text-xs h-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs h-9"
                >
                  <option value="all">All Statuses</option>
                  <option value="negotiation_active">Active Negotiations</option>
                  <option value="counter_offer_received">Counter Offer Received</option>
                  <option value="awaiting_supplier">Awaiting Supplier</option>
                  <option value="deal_agreed">Deal Finalized</option>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredNegotiations.length > 0 ? (
                filteredNegotiations.map((neg) => {
                  const isSelected = selectedNegotiation?.id === neg.id || selectedNegotiation?.rfqId === neg.rfqId
                  const negOrig = Number(neg.originalPrice || neg.revisedPrice || 100)
                  const negCurrent = Number(neg.currentOffer || neg.revisedPrice || negOrig)
                  const negAgreed = neg.status === 'deal_agreed'

                  return (
                    <div
                      key={neg.id || neg.rfqId}
                      onClick={() => handleSelectNegotiation(neg)}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-1 ring-blue-500' 
                          : 'bg-white hover:bg-gray-50/80 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="font-bold text-sm text-navy-900 truncate">
                          {neg.supplierName}
                        </div>
                        <Badge variant={getStatusVariant(neg.status)} className="text-[10px] shrink-0">
                          {negAgreed ? 'Finalized' : getStatusLabel(neg.status)}
                        </Badge>
                      </div>

                      <p className="text-xs font-medium text-gray-700 truncate mb-2">
                        {neg.component || 'Component'} &bull; {neg.rfqId}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500 text-[11px]">Quote: ₹{negOrig}</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="font-bold text-blue-700">₹{negCurrent}/u</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-300'}`} />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No negotiations match your search.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Negotiation Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedNegotiation ? (
            <>
              {/* Workspace Header Card */}
              <Card className="border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-slate-900 via-navy-900 to-blue-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {selectedNegotiation.rfqId}
                      </span>
                      <h2 className="text-xl font-bold text-white">
                        {selectedNegotiation.component}
                      </h2>
                      <Badge variant={getStatusVariant(selectedNegotiation.status)}>
                        {getStatusLabel(selectedNegotiation.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-200 mt-1 flex items-center gap-2">
                      <Building className="w-3.5 h-3.5" />
                      Supplier: <strong className="text-white">{selectedNegotiation.supplierName}</strong>
                      <span>&bull;</span>
                      <Package className="w-3.5 h-3.5" />
                      Qty: <strong className="text-white">{quantity.toLocaleString()} Units</strong>
                    </p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isAgreed ? (
                      <Button onClick={handleProceedToApproval} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Proceed to Selection
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={handleCounterOffer}
                          className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                        >
                          <Send className="w-3.5 h-3.5 mr-1" />
                          Counter Offer
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => setShowConfirmDialog(true)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Accept Deal
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Workflow Tracker Strip */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <WorkflowTracker 
                    currentStatus={isAgreed ? 'supplier_selected' : 'quotation_submitted'} 
                    workflowType="procurement"
                  />
                </div>
              </Card>

              {/* 4 Financial & Pricing Dynamics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <Card className="bg-white border-gray-200 shadow-xs">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 font-medium">Original Quote</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">₹{origPrice}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Initial submission</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-emerald-200 shadow-xs">
                  <CardContent className="p-4">
                    <p className="text-xs text-emerald-700 font-semibold">Target Budget</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">₹{targetPrice}</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Target unit price</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-blue-300 shadow-xs">
                  <CardContent className="p-4">
                    <p className="text-xs text-blue-700 font-semibold">Current Offer</p>
                    <p className="text-xl font-bold text-blue-700 mt-1">₹{currentPrice}</p>
                    <p className="text-[11px] text-blue-600 mt-0.5">Active standing</p>
                  </CardContent>
                </Card>

                <Card className="bg-emerald-50/80 border-emerald-300 shadow-xs">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-emerald-800 font-bold">Total Savings</p>
                      {savingsPct > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">
                          {savingsPct}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-extrabold text-emerald-800 mt-1">
                      ₹{totalSavings.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      for {quantity.toLocaleString()} units
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* AI Negotiation Strategy Banner */}
              <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-blue-50/70 shadow-xs">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-600 text-white shrink-0 mt-0.5 shadow-sm">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                            AI Negotiation Intelligence
                          </h3>
                          <Badge variant="accent" className="text-[10px] bg-purple-100 text-purple-800 border-purple-200">
                            {selectedNegotiation.aiConfidence || 94}% Confidence
                          </Badge>
                        </div>
                        <p className="text-xs text-purple-900 mt-1 leading-relaxed">
                          {selectedNegotiation.aiStrategy}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px]">
                          <span className="font-semibold text-purple-950">AI Counter Target:</span>
                          <span className="font-bold text-purple-700 bg-white/90 px-2 py-0.5 rounded border border-purple-200">
                            ₹{selectedNegotiation.aiSuggestedPrice}/unit
                          </span>
                          <span className="text-purple-700">
                            (Est. ₹{((origPrice - selectedNegotiation.aiSuggestedPrice) * quantity).toLocaleString()} savings)
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isAgreed && (
                      <Button
                        size="sm"
                        onClick={applyAISuggestion}
                        disabled={isApplyingAI}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 shadow-sm disabled:opacity-75"
                      >
                        {isApplyingAI ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Triggering AI Workflow...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Apply AI Proposal
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Deal Agreed Celebration Banner */}
              {isAgreed && (
                <Card className="border-2 border-emerald-400 bg-emerald-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500 text-white rounded-xl">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-emerald-950">Negotiation Successfully Finalized!</h3>
                        <p className="text-sm text-emerald-800 mt-1">
                          Both parties agreed on <strong>₹{currentPrice}/unit</strong> with a total contract value of <strong>₹{totalCurrent.toLocaleString()}</strong>.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-emerald-200 text-xs">
                          <div>
                            <span className="text-emerald-700">Original Unit Price:</span>
                            <div className="font-bold text-emerald-900 text-sm">₹{origPrice}</div>
                          </div>
                          <div>
                            <span className="text-emerald-700">Final Agreed Price:</span>
                            <div className="font-bold text-emerald-900 text-sm">₹{currentPrice}</div>
                          </div>
                          <div>
                            <span className="text-emerald-700">Total Savings:</span>
                            <div className="font-bold text-emerald-900 text-sm">₹{totalSavings.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-emerald-700">Delivery Lead Time:</span>
                            <div className="font-bold text-emerald-900 text-sm">{selectedNegotiation.deliveryRequirement} Days</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button onClick={handleProceedToApproval} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                            Proceed to Final Supplier Selection &rarr;
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Counter Offer Form */}
              {showOfferForm && !isAgreed && (
                <Card className="border-2 border-blue-400 shadow-md">
                  <CardHeader className="bg-blue-50/80 border-b border-blue-100 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-950">
                        <Send className="w-4 h-4 text-blue-600" />
                        Send Counter-Offer Proposal
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setShowOfferForm(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    {/* Quick Discount Presets */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                        Quick Discount Presets
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[5, 10, 15].map(pct => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => applyDiscountPreset(pct)}
                            className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            {pct}% Discount (₹{Math.round(origPrice * (1 - pct / 100))})
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setOfferData(prev => ({ 
                            ...prev, 
                            proposedPrice: targetPrice.toString(), 
                            message: `We propose alignment with our target budget of ₹${targetPrice}/unit.` 
                          }))}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                          Match Target (₹{targetPrice})
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Proposed Unit Price (₹) *</label>
                        <Input
                          type="number"
                          value={offerData.proposedPrice}
                          onChange={(e) => setOfferData({ ...offerData, proposedPrice: e.target.value })}
                          placeholder={`e.g. ${targetPrice}`}
                          className="font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Lead Time (Days)</label>
                        <Input
                          type="number"
                          value={offerData.delivery}
                          onChange={(e) => setOfferData({ ...offerData, delivery: e.target.value })}
                          placeholder={`e.g. ${selectedNegotiation.deliveryRequirement || 12}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Negotiation Rationale / Terms</label>
                      <textarea
                        value={offerData.message}
                        onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                        rows={2}
                        placeholder="Enter justification or volume commitments..."
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button
                        onClick={handleSendOffer}
                        disabled={isSendingMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex-1 flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSendingMessage ? 'Dispatching Offer...' : 'Send Counter-Offer to Supplier'}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setShowOfferForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Action Bar (When offer form is closed) */}
              {!showOfferForm && !isAgreed && (
                <Card className="bg-gradient-to-r from-blue-50/90 via-white to-emerald-50/90 border-blue-200">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Current Offer Standing: ₹{currentPrice}/unit
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedNegotiation.status === 'counter_offer_received'
                          ? 'Supplier sent a revised counter-offer. You can accept or send another counter.'
                          : 'Propose a revised counter-offer or accept to finalize agreement.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={handleCounterOffer}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Counter-Offer
                      </Button>
                      <Button
                        onClick={() => setShowConfirmDialog(true)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Accept Deal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Negotiation Activity Log / Stream */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-navy-900">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Negotiation Conversation & Activity History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {selectedNegotiation.negotiationHistory?.map((item, idx) => {
                      const isProc = item.participant === 'procurement'
                      const isSup = item.participant === 'supplier'
                      const isSys = item.participant === 'system'

                      return (
                        <div key={item.id || idx} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                            isProc ? 'bg-blue-600' : isSup ? 'bg-indigo-600' : 'bg-gray-400'
                          }`}>
                            {isProc ? <User className="w-4 h-4" /> : isSup ? <Building className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <div className={`flex-1 p-3.5 rounded-xl border ${
                            isProc ? 'bg-blue-50/70 border-blue-200' :
                            isSup ? 'bg-indigo-50/70 border-indigo-200' :
                            'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-gray-900">
                                {isProc ? 'Procurement Manager' : isSup ? selectedNegotiation.supplierName : 'System Event'}
                              </span>
                              <span className="text-[11px] text-gray-500">{item.timestamp || 'Today'}</span>
                            </div>
                            <p className="text-xs text-gray-800 leading-relaxed">{item.message}</p>
                            {item.price && (
                              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px] font-bold text-gray-900">
                                <DollarSign className="w-3 h-3 text-emerald-600" />
                                Price Point: ₹{item.price}/unit
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center border-dashed border-2">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold text-base">Select a negotiation to open workspace</p>
              <p className="text-xs text-gray-500 mt-1">
                Choose an active supplier conversation from the list on the left.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Confirm Deal Modal */}
      {showConfirmDialog && selectedNegotiation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl border-0">
            <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-3">
              <CardTitle className="text-emerald-950 flex items-center gap-2 text-base">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Confirm Deal Finalization
              </CardTitle>
              <CardDescription className="text-emerald-800 text-xs">
                Finalize negotiated terms with {selectedNegotiation.supplierName}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Component:</span>
                  <span className="font-semibold text-gray-900">{selectedNegotiation.component}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Supplier:</span>
                  <span className="font-semibold text-gray-900">{selectedNegotiation.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Agreed Unit Price:</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{currentPrice}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Units:</span>
                  <span className="font-medium text-gray-900">{quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Lead Time:</span>
                  <span className="font-medium text-gray-900">{selectedNegotiation.deliveryRequirement} Days</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between">
                  <span className="font-bold text-gray-900">Total Contract Value:</span>
                  <span className="font-extrabold text-blue-700 text-sm">₹{totalCurrent.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="secondary" size="sm" onClick={() => setShowConfirmDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAcceptOffer} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex-1">
                  Confirm & Finalize
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default NegotiationCenterNew
