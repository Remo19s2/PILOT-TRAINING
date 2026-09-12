import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ArrowLeft, TrendingUp, Clock, DollarSign, FileText, MessageSquare } from 'lucide-react'
import QuotationHistory from '../components/shared/QuotationHistory'

const RevisedQuotationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { quotations, suppliers } = useWorkflow()
  const [showNegotiation, setShowNegotiation] = useState(false)
  const [negotiationMessage, setNegotiationMessage] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [deliveryRequirement, setDeliveryRequirement] = useState('')

  const quotation = quotations.find(q => q.id === id)
  const supplier = suppliers.find(s => s.id === quotation?.supplierId)

  if (!quotation) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => navigate('/revised-quotations')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Revised Quotations
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-600">Quotation not found</p>
        </div>
      </div>
    )
  }

  const previousVersion = quotation.quotationHistory?.find(h => h.version === quotation.quotationHistory.length - 1) || quotation.quotationHistory?.[0]

  const handleStartNegotiation = () => {
    setShowNegotiation(true)
  }

  const handleSendNegotiation = () => {
    // In a real app, this would send to backend
    alert('Negotiation sent to supplier!')
    setShowNegotiation(false)
  }

  const handleCancelNegotiation = () => {
    setShowNegotiation(false)
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      'submitted': 'bg-blue-100 text-blue-700',
      'revised': 'bg-yellow-100 text-yellow-700',
      'viewed': 'bg-gray-100 text-gray-700',
      'under_review': 'bg-purple-100 text-purple-700',
      'negotiation_pending': 'bg-orange-100 text-orange-700',
      'negotiation_sent': 'bg-indigo-100 text-indigo-700',
      'supplier_viewed': 'bg-cyan-100 text-cyan-700',
      'accepted': 'bg-green-100 text-green-700',
      'declined': 'bg-red-100 text-red-700'
    }
    const style = statusStyles[status] || 'bg-gray-100 text-gray-700'
    return (
      <span className={`text-xs px-2 py-1 rounded ${style}`}>
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    )
  }

  const priceChange = previousVersion ? ((quotation.unitPrice - previousVersion.unitPrice) / previousVersion.unitPrice * 100).toFixed(1) : 0
  const isPriceDecrease = priceChange < 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => navigate('/revised-quotations')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Revised Quotations
        </Button>
        <div className="flex gap-2">
          {getStatusBadge(quotation.status)}
        </div>
      </div>

      {/* Supplier Information */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-600">Supplier Name</span>
              <p className="font-medium text-black">{quotation.supplierName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Supplier ID</span>
              <p className="font-medium">{quotation.supplierId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Location</span>
              <p className="font-medium">{supplier?.location || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFQ Information */}
      <Card>
        <CardHeader>
          <CardTitle>RFQ Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-600">RFQ ID</span>
              <p className="font-medium">{quotation.rfqId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Component</span>
              <p className="font-medium text-black">{quotation.requirementName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Quantity</span>
              <p className="font-medium">10,000</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Required Delivery</span>
              <p className="font-medium">2024-02-15</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotation Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Previous Quotation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Previous Quotation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unit Price</span>
              <span className="font-medium">₹{previousVersion?.unitPrice || '-'}/unit</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Price</span>
              <span className="font-medium">₹{previousVersion?.totalPrice?.toLocaleString() || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Delivery Time</span>
              <span className="font-medium">{previousVersion?.deliveryTime || '-'} Days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Terms</span>
              <span className="font-medium">{previousVersion?.paymentTerms || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Submitted Date</span>
              <span className="font-medium">{previousVersion?.submittedDate || '-'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Revised Quotation */}
        <Card className="border-2 border-primary-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Revised Quotation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unit Price</span>
              <span className="font-medium text-black">₹{quotation.unitPrice}/unit</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Price</span>
              <span className="font-medium text-black">₹{quotation.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Delivery Time</span>
              <span className="font-medium text-black">{quotation.deliveryTime} Days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Terms</span>
              <span className="font-medium text-black">{quotation.paymentTerms}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revision Date</span>
              <span className="font-medium">{quotation.revisionDate}</span>
            </div>
            {quotation.supplierNotes && (
              <div className="pt-2 border-t">
                <span className="text-sm text-gray-600">Supplier Notes</span>
                <p className="text-sm mt-1 text-gray-800">{quotation.supplierNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price Change Highlight */}
      <Card className={isPriceDecrease ? 'bg-success-50 border-success-200' : 'bg-warning-50 border-warning-200'}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <DollarSign className={`w-6 h-6 ${isPriceDecrease ? 'text-success-600' : 'text-warning-600'}`} />
            <div>
              <p className="font-medium">Price Change</p>
              <p className={`text-sm ${isPriceDecrease ? 'text-success-700' : 'text-warning-700'}`}>
                ₹{previousVersion?.unitPrice || 0} → ₹{quotation.unitPrice} ({isPriceDecrease ? '' : '+'}{priceChange}%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Negotiation Interface */}
      {showNegotiation && (
        <Card className="border-2 border-primary-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Start Negotiation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Current Supplier Price</label>
                <p className="font-medium">₹{quotation.unitPrice}/unit</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Current Total</label>
                <p className="font-medium">₹{quotation.totalPrice.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Target Price (₹/unit)</label>
                <Input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target price"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Required Delivery (Days)</label>
                <Input
                  type="number"
                  value={deliveryRequirement}
                  onChange={(e) => setDeliveryRequirement(e.target.value)}
                  placeholder="Enter delivery requirement"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Negotiation Message</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                value={negotiationMessage}
                onChange={(e) => setNegotiationMessage(e.target.value)}
                placeholder="Enter your negotiation message..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleSendNegotiation}>
                Send Negotiated Deal
              </Button>
              <Button variant="secondary" onClick={handleCancelNegotiation}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {!showNegotiation && quotation.status === 'revised' && (
        <Card>
          <CardContent className="p-4">
            <Button variant="primary" onClick={handleStartNegotiation}>
              Start Negotiation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quotation History */}
      <QuotationHistory history={quotation.quotationHistory || []} />
    </div>
  )
}

export default RevisedQuotationDetails
