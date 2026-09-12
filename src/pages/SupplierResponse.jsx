import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, MessageSquare, Calendar } from 'lucide-react'

const SupplierResponse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { negotiations, quotations } = useWorkflow()

  const negotiation = negotiations.find(n => n.id === id)
  const quotation = quotations.find(q => q.id === negotiation?.quotationId)

  if (!negotiation) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => navigate('/revised-quotations')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-600">Negotiation not found</p>
        </div>
      </div>
    )
  }

  const getResponseStatusBadge = (response) => {
    if (!response) return null
    const statusStyles = {
      'accepted': 'bg-green-100 text-green-700',
      'declined': 'bg-red-100 text-red-700',
      'counter_offer': 'bg-orange-100 text-orange-700'
    }
    const style = statusStyles[response] || 'bg-gray-100 text-gray-700'
    return (
      <span className={`text-xs px-2 py-1 rounded ${style}`}>
        {response.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    )
  }

  const handleProceedToSelection = () => {
    alert('Proceeding to supplier selection...')
  }

  const handleSendForApproval = () => {
    alert('Sending for finance approval...')
  }

  const handleContinueNegotiation = () => {
    alert('Continuing negotiation...')
  }

  const handleReviewAlternatives = () => {
    alert('Reviewing alternative suppliers...')
  }

  const handleCloseNegotiation = () => {
    alert('Closing negotiation...')
  }

  const handleAcceptCounter = () => {
    alert('Accepting counter offer...')
  }

  const handleRejectCounter = () => {
    alert('Rejecting counter offer...')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => navigate('/revised-quotations')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Revised Quotations
        </Button>
      </div>

      {/* Supplier Response Header */}
      <Card className={negotiation.supplierResponse === 'accepted' ? 'bg-success-50 border-success-200' : 
                    negotiation.supplierResponse === 'declined' ? 'bg-danger-50 border-danger-200' : 
                    'bg-warning-50 border-warning-200'}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {negotiation.supplierResponse === 'accepted' && <CheckCircle className="w-8 h-8 text-success-600" />}
            {negotiation.supplierResponse === 'declined' && <XCircle className="w-8 h-8 text-danger-600" />}
            {negotiation.supplierResponse === 'counter_offer' && <TrendingUp className="w-8 h-8 text-warning-600" />}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">
                {negotiation.supplierResponse === 'accepted' && 'Deal Accepted by Supplier'}
                {negotiation.supplierResponse === 'declined' && 'Deal Declined by Supplier'}
                {negotiation.supplierResponse === 'counter_offer' && 'Counter Offer Received'}
              </h3>
              <p className="text-sm text-gray-600">
                Supplier: {negotiation.supplierName}
              </p>
              {negotiation.responseDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Response Date: {negotiation.responseDate}
                </p>
              )}
            </div>
            {getResponseStatusBadge(negotiation.supplierResponse)}
          </div>
        </CardContent>
      </Card>

      {/* Negotiated Deal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Negotiated Deal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Original Supplier Price</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Price:</span>
                  <span className="font-medium">₹{negotiation.originalPrice}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">₹{(negotiation.originalPrice * 10000).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Procurement Target</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Price:</span>
                  <span className="font-medium">₹{negotiation.targetPrice}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Required Delivery:</span>
                  <span className="font-medium">{negotiation.deliveryRequirement} Days</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Negotiated Price</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Price:</span>
                  <span className="font-medium text-primary-600">₹{negotiation.negotiatedPrice}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-primary-600">₹{(negotiation.negotiatedPrice * 10000).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Negotiation Message</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {negotiation.negotiationMessage}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Response */}
      {negotiation.supplierResponse && (
        <Card className="border-2 border-primary-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Supplier Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getResponseStatusBadge(negotiation.supplierResponse)}
                {negotiation.responseDate && (
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {negotiation.responseDate}
                  </span>
                )}
              </div>
              
              {negotiation.supplierMessage && (
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Supplier Message:</span>
                  <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">
                    {negotiation.supplierMessage}
                  </p>
                </div>
              )}

              {negotiation.supplierResponse === 'counter_offer' && (
                <div className="bg-warning-50 p-4 rounded">
                  <h4 className="font-medium mb-2">Counter Offer Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Counter Price:</span>
                      <span className="ml-2 font-medium">₹48/unit</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery:</span>
                      <span className="ml-2 font-medium">12 Days</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response-Based Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {negotiation.supplierResponse === 'accepted' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">The supplier has accepted your negotiated deal. You can now proceed with the next steps.</p>
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleProceedToSelection}>
                  Proceed to Supplier Selection
                </Button>
                <Button variant="secondary" onClick={handleSendForApproval}>
                  Send for Finance Approval
                </Button>
              </div>
            </div>
          )}

          {negotiation.supplierResponse === 'declined' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">The supplier has declined your negotiated deal. Choose your next action:</p>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary" onClick={handleContinueNegotiation}>
                  Continue Negotiation
                </Button>
                <Button variant="secondary" onClick={handleReviewAlternatives}>
                  Review Alternative Suppliers
                </Button>
                <Button variant="danger" onClick={handleCloseNegotiation}>
                  Close Negotiation
                </Button>
              </div>
            </div>
          )}

          {negotiation.supplierResponse === 'counter_offer' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">The supplier has sent a counter offer. Review and decide:</p>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary" onClick={handleAcceptCounter}>
                  Accept Counter Offer
                </Button>
                <Button variant="secondary" onClick={handleContinueNegotiation}>
                  Continue Negotiation
                </Button>
                <Button variant="danger" onClick={handleRejectCounter}>
                  Reject Counter Offer
                </Button>
              </div>
            </div>
          )}

          {!negotiation.supplierResponse && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">Waiting for supplier response to the negotiated deal.</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Sent: {negotiation.sentDate}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SupplierResponse
