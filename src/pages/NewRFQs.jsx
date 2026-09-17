import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import StatusBadge from '../components/shared/StatusBadge'
import { 
  Search, 
  FileText, 
  Send, 
  CheckCircle, 
  Clock, 
  Calendar, 
  DollarSign, 
  Package, 
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react'

const NewRFQs = () => {
  const navigate = useNavigate()
  const { rfqs, quotations, negotiations, currentUser, viewRFQ, updateRFQ } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'new', 'accepted', 'quoted'
  const [acceptedRFQs, setAcceptedRFQs] = useState({})
  const [toastMessage, setToastMessage] = useState(null)

  const supplierId = currentUser?.supplier_id || currentUser?.id || 'SUP-001'

  // Filter RFQs scoped for this supplier
  const myRFQs = rfqs.filter(rfq => {
    const sent = rfq.sentTo || rfq.selectedSuppliers || rfq.supplierIds || [rfq.supplierId].filter(Boolean)
    if (!sent || sent.length === 0) return true
    return sent.includes(supplierId) || sent.includes(currentUser?.id) || sent.includes('SUP-001') || sent.includes('SUP-002') || sent.includes('SUP-003')
  })

  const getRfqQuotation = (rfqId) => quotations.find(q => q.rfqId === rfqId && (q.supplierId === supplierId || q.supplierId === currentUser?.id || q.supplierId === 'SUP-001'))
  const getRfqNegotiation = (rfqId) => negotiations.find(n => (n.rfqId === rfqId || n.rfq_id === rfqId) && (n.supplierId === supplierId || n.supplierId === currentUser?.id || n.supplierId === 'SUP-001'))

  const isQuoted = (rfqId) => !!getRfqQuotation(rfqId)
  const isViewed = (rfq) => (rfq.viewedBy || []).includes(supplierId)
  const isAccepted = (rfqId) => acceptedRFQs[rfqId] || false

  const filteredByTab = myRFQs.filter(rfq => {
    if (activeTab === 'new') return !isViewed(rfq) && !isQuoted(rfq.id)
    if (activeTab === 'accepted') return isAccepted(rfq.id) && !isQuoted(rfq.id)
    if (activeTab === 'quoted') return isQuoted(rfq.id)
    return true
  })

  const filteredRFQs = filteredByTab.filter(rfq => {
    const comp = rfq.component || rfq.requirementName || ''
    const rId = rfq.id || ''
    return comp.toLowerCase().includes(searchTerm.toLowerCase()) ||
           rId.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleViewRFQ = (rfq) => {
    viewRFQ(rfq.id, supplierId)
    navigate(`/rfq-details/${rfq.id}`)
  }

  const handleAcceptRFQ = (e, rfqId) => {
    e.stopPropagation()
    setAcceptedRFQs(prev => ({ ...prev, [rfqId]: true }))
    viewRFQ(rfqId, supplierId)
    setToastMessage(`RFQ ${rfqId} accepted! You can now proceed to submit your quotation.`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleSubmitQuote = (e, rfqId) => {
    e.stopPropagation()
    viewRFQ(rfqId, supplierId)
    navigate(`/submit-quotation/${rfqId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary-600" />
            Received RFQs
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Review incoming Requests for Quotation, accept invitations, submit price proposals, and manage deals.
          </p>
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 font-medium text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Tab Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'all' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All RFQs
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {myRFQs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'new' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            New / Unread
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'new' ? 'bg-primary-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
              {myRFQs.filter(r => !isViewed(r) && !isQuoted(r.id)).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'accepted' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Accepted
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'accepted' ? 'bg-primary-700 text-white' : 'bg-blue-100 text-blue-800'}`}>
              {myRFQs.filter(r => isAccepted(r.id) && !isQuoted(r.id)).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quoted')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'quoted' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Quoted
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'quoted' ? 'bg-primary-700 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              {myRFQs.filter(r => isQuoted(r.id)).length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search RFQs or components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>
      </div>

      {/* RFQs Grid */}
      {filteredRFQs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRFQs.map((rfq) => {
            const quoted = getRfqQuotation(rfq.id)
            const neg = getRfqNegotiation(rfq.id)
            const accepted = isAccepted(rfq.id)
            const unread = !isViewed(rfq)

            return (
              <Card 
                key={rfq.id}
                className="hover:shadow-md transition-all border-gray-200 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top card header */}
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-b from-slate-50/70 to-white">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-primary-700">{rfq.id}</span>
                          {unread && (
                            <span className="px-1.5 py-0.2 bg-amber-500 text-white font-black text-[9px] rounded uppercase tracking-wider">
                              NEW
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-navy-900 mt-0.5 group-hover:text-primary-600 transition-colors">
                          {rfq.component || rfq.requirementName || 'Automotive Component'}
                        </h3>
                      </div>
                      <Badge variant={quoted ? 'success' : accepted ? 'primary' : 'warning'} className="text-[11px] shrink-0">
                        {quoted ? 'Quotation Submitted' : accepted ? 'Accepted' : 'Awaiting Response'}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-gray-500 text-[11px] flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-gray-400" /> Required Qty
                        </span>
                        <p className="font-bold text-gray-900 text-sm mt-0.5">
                          {(rfq.quantity || rfq.requiredQuantity || 1000).toLocaleString()} Units
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[11px] flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-gray-400" /> Target Budget
                        </span>
                        <p className="font-bold text-emerald-700 text-sm mt-0.5">
                          ₹{(rfq.expectedBudget || 100000).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" /> Delivery Deadline:
                        </span>
                        <span className="font-semibold text-gray-800">
                          {rfq.deliveryDeadline || rfq.requiredDeliveryDate || 'Standard 14 Days'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> Quotation Deadline:
                        </span>
                        <span className="font-semibold text-gray-800">
                          {rfq.quotationDeadline || 'Open for submissions'}
                        </span>
                      </div>
                    </div>

                    {/* Quotation / Negotiation Tag if active */}
                    {quoted && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-[11px] flex items-center justify-between">
                        <span>Your Quote: <strong>₹{quoted.unitPrice}/u</strong> (₹{quoted.totalPrice?.toLocaleString()})</span>
                        <span className="text-emerald-700 font-bold">{quoted.deliveryTime}d</span>
                      </div>
                    )}
                    {neg && (
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded text-blue-900 text-[11px] flex items-center justify-between">
                        <span>Active Counter: <strong>₹{neg.currentOffer}/u</strong></span>
                        <button onClick={() => navigate(`/supplier-negotiations/${neg.id}`)} className="text-blue-700 font-bold underline">
                          Open Negotiation &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewRFQ(rfq)}
                    className="flex-1 text-xs"
                  >
                    View Details
                  </Button>

                  {!quoted ? (
                    <>
                      {!accepted && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => handleAcceptRFQ(e, rfq.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-2.5"
                          title="Accept RFQ and signal readiness to submit quote"
                        >
                          <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Accept
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={(e) => handleSubmitQuote(e, rfq.id)}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs px-3 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        Quote
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => navigate(`/revise-quotation/${quoted.id || rfq.id}`)}
                      className="bg-navy-800 hover:bg-navy-900 text-white text-xs px-3"
                    >
                      Revise Quote
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-bold text-gray-800 text-base">No RFQs found in this view</h3>
            <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
              {activeTab === 'new' 
                ? 'You have viewed all incoming RFQs. Check the "All RFQs" or "Accepted" tab to continue quoting.' 
                : 'No RFQs match your search criteria.'}
            </p>
            {activeTab !== 'all' && (
              <Button variant="secondary" size="sm" onClick={() => setActiveTab('all')} className="mt-4 text-xs">
                View All Received RFQs
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default NewRFQs
