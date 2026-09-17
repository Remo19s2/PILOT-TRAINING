import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import StatusBadge from '../components/shared/StatusBadge'
import WorkflowTracker from '../components/shared/WorkflowTracker'
import { 
  Package, 
  Calendar, 
  DollarSign, 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  Building, 
  Clock, 
  FileText, 
  Check, 
  MessageSquare 
} from 'lucide-react'

const RFQDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rfqs, quotations, negotiations, currentUser, suppliers, workflowStatuses, viewRFQ } = useWorkflow()
  const [isAccepted, setIsAccepted] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  
  const rfq = rfqs.find(r => r.id === id)
  const supplierId = currentUser?.supplier_id || currentUser?.id || 'SUP-001'
  const supplier = suppliers.find(s => s.id === supplierId) || suppliers[0]

  const existingQuote = quotations.find(q => q.rfqId === id && (q.supplierId === supplierId || q.supplierId === 'SUP-001'))
  const existingNeg = negotiations.find(n => (n.rfqId === id || n.rfq_id === id) && (n.supplierId === supplierId || n.supplierId === 'SUP-001'))

  if (!rfq) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">RFQ not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const handleAcceptRFQ = () => {
    setIsAccepted(true)
    viewRFQ(rfq.id, supplierId)
    setToastMessage(`RFQ ${rfq.id} accepted. You are ready to submit your quote.`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleSubmitQuotation = () => {
    viewRFQ(rfq.id, supplierId)
    navigate(`/submit-quotation/${rfq.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-navy-900">RFQ Details</h1>
              <Badge variant="primary" className="text-xs">{rfq.id}</Badge>
            </div>
            <p className="text-gray-600 text-sm mt-0.5">{rfq.component || rfq.requirementName || 'Automotive Component'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!existingQuote && !isAccepted && (
            <Button
              variant="secondary"
              onClick={handleAcceptRFQ}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold text-xs"
            >
              <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
              Accept RFQ
            </Button>
          )}

          {!existingQuote ? (
            <Button
              onClick={handleSubmitQuotation}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-sm"
            >
              <Send className="w-4 h-4 mr-1.5" />
              Submit Quotation
            </Button>
          ) : (
            <Button
              onClick={() => navigate(`/revise-quotation/${existingQuote.id || rfq.id}`)}
              className="bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs"
            >
              Revise Quotation
            </Button>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Status Tracker */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <WorkflowTracker 
          currentStatus={existingQuote ? 'quotation_submitted' : rfq.status || 'rfq_sent'} 
          workflowStatuses={workflowStatuses} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFQ Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-base font-bold text-navy-900">Procurement Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Component</label>
                  <p className="text-base font-bold text-navy-900 mt-1">{rfq.component || rfq.requirementName}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Category</label>
                  <p className="text-base font-bold text-navy-900 mt-1">{rfq.category || 'Standard Parts'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Required Quantity</label>
                  <p className="text-2xl font-black text-navy-900 mt-0.5">{(rfq.quantity || rfq.requiredQuantity || 1000).toLocaleString()} <span className="text-xs font-normal text-gray-500">units</span></p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 uppercase">Target Budget</label>
                  <p className="text-2xl font-black text-emerald-700 mt-0.5">₹{(rfq.expectedBudget || 100000).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Specifications & Scope</label>
                <div className="p-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed">
                  {rfq.specifications || 'Automotive-grade manufacturing standard compliance required. Full ISO-9001 certified components with standard quality verification.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-500 uppercase">Required Delivery Date</label>
                  <p className="text-gray-900 font-bold mt-1">{rfq.deliveryDeadline || rfq.requiredDeliveryDate || '14 Days from PO'}</p>
                </div>
                <div>
                  <label className="block font-semibold text-gray-500 uppercase">Quotation Deadline</label>
                  <p className="text-gray-900 font-bold mt-1">{rfq.quotationDeadline || 'Open for submissions'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Negotiation Card if present */}
          {existingNeg && (
            <Card className="border-2 border-blue-300 bg-blue-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Active Deal Negotiation
                </CardTitle>
                <CardDescription className="text-xs text-blue-800">
                  Procurement manager has an active negotiation open for this item.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-600">Current Standing Offer:</span>
                    <p className="text-base font-bold text-blue-700">₹{existingNeg.currentOffer}/unit</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/supplier-negotiations/${existingNeg.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    Open Negotiation Workspace &rarr;
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Actions & Supplier Profile (1 col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-bold text-navy-900">Quotation Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {existingQuote ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Quotation Submitted
                  </p>
                  <p className="text-emerald-800">
                    Quoted Unit Price: <strong>₹{existingQuote.unitPrice}</strong>
                  </p>
                  <p className="text-emerald-800">
                    Total Quoted: <strong>₹{existingQuote.totalPrice?.toLocaleString()}</strong>
                  </p>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/revise-quotation/${existingQuote.id || rfq.id}`)}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                    >
                      Revise Quotation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button 
                    onClick={handleSubmitQuotation} 
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs py-2.5 shadow-sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Quotation
                  </Button>
                  {!isAccepted && (
                    <Button 
                      variant="secondary"
                      onClick={handleAcceptRFQ} 
                      className="w-full text-xs"
                    >
                      <Check className="w-4 h-4 mr-2 text-emerald-600" />
                      Accept / Acknowledge RFQ
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-bold text-navy-900">Your Supplier Account</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div>
                <span className="text-gray-500 font-medium">Company Name</span>
                <p className="font-bold text-navy-900 text-sm mt-0.5">{supplier?.name || 'TechCorp Industries'}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Location</span>
                <p className="font-semibold text-gray-800 mt-0.5">{supplier?.location || 'Taiwan'}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Rating & Performance</span>
                <p className="font-bold text-emerald-600 mt-0.5">{supplier?.rating || '4.8'} / 5.0 (96% On-Time)</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Standard Payment Terms</span>
                <p className="font-semibold text-gray-800 mt-0.5">{supplier?.paymentTerms || 'Net 30'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RFQDetails
