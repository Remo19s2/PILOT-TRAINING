import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { ArrowLeft, MessageSquare, CheckCircle, X, Send, Clock, AlertTriangle, User, Building } from 'lucide-react'

const SupplierNegotiations = () => {
  const navigate = useNavigate()
  const { negotiationId } = useParams()
  const { negotiations, currentUser } = useWorkflow()
  
  const [selectedNegotiation, setSelectedNegotiation] = useState(null)
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseData, setResponseData] = useState({
    response: '',
    proposedPrice: '',
    deliveryDays: '',
    message: ''
  })

  const supplierId = currentUser?.id || 'SUP-001'
  const myNegotiations = negotiations.filter(n => n.supplierId === supplierId)
  
  // If negotiationId is provided, select that negotiation
  if (negotiationId && !selectedNegotiation) {
    const negotiation = myNegotiations.find(n => n.id === negotiationId)
    if (negotiation) {
      setSelectedNegotiation(negotiation)
    }
  }

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
      'negotiation_active': 'Negotiation Active',
      'counter_offer_received': 'Counter Offer Received',
      'awaiting_supplier': 'Awaiting Your Response',
      'deal_agreed': 'Deal Agreed',
      'deal_declined': 'Deal Declined',
      'negotiation_closed': 'Negotiation Closed'
    }
    return labels[status] || status
  }

  const handleOpenNegotiation = (negotiation) => {
    setSelectedNegotiation(negotiation)
    navigate(`/supplier-negotiations/${negotiation.id}`)
  }

  const handleBackToList = () => {
    setSelectedNegotiation(null)
    navigate('/supplier-negotiations')
  }

  const handleAcceptOffer = () => {
    if (!selectedNegotiation) return
    
    // In a real app, this would update the negotiation state
    alert('Offer accepted successfully!')
    setSelectedNegotiation({
      ...selectedNegotiation,
      status: 'deal_agreed',
      dealStatus: 'agreed',
      finalAgreedPrice: selectedNegotiation.currentOffer,
      finalDelivery: selectedNegotiation.deliveryRequirement
    })
  }

  const handleDeclineOffer = () => {
    if (!selectedNegotiation) return
    
    if (confirm('Are you sure you want to decline this offer?')) {
      alert('Offer declined.')
      setSelectedNegotiation({
        ...selectedNegotiation,
        status: 'deal_declined',
        dealStatus: 'declined'
      })
    }
  }

  const handleSendCounterOffer = () => {
    if (!selectedNegotiation) return
    
    // In a real app, this would update the negotiation state
    alert('Counter-offer sent successfully!')
    setSelectedNegotiation({
      ...selectedNegotiation,
      status: 'negotiation_active',
      currentOffer: parseFloat(responseData.proposedPrice) || selectedNegotiation.currentOffer,
      deliveryRequirement: parseInt(responseData.deliveryDays) || selectedNegotiation.deliveryRequirement
    })
    setShowResponseForm(false)
    setResponseData({ response: '', proposedPrice: '', deliveryDays: '', message: '' })
  }

  // List View
  if (!selectedNegotiation) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Negotiations</h1>
          <p className="text-gray-600 mt-1">Review and respond to procurement manager offers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Negotiations</CardTitle>
          </CardHeader>
          <CardContent>
            {myNegotiations.length > 0 ? (
              <div className="space-y-4">
                {myNegotiations.map((neg) => (
                  <div
                    key={neg.id}
                    className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                    onClick={() => handleOpenNegotiation(neg)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-navy-900">{neg.component}</p>
                        <p className="text-sm text-gray-600">{neg.rfqId} • Qty: {neg.quantity}</p>
                      </div>
                      <Badge variant={getStatusVariant(neg.status)}>
                        {getStatusLabel(neg.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current Offer:</span>
                        <p className="font-medium">₹{neg.currentOffer}/unit</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Delivery:</span>
                        <p className="font-medium">{neg.deliveryRequirement} Days</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Updated:</span>
                        <p className="font-medium">{neg.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active negotiations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Negotiation Detail View
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={handleBackToList}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Negotiation Details</h1>
          <p className="text-gray-600 mt-1">{selectedNegotiation.rfqId} - {selectedNegotiation.component}</p>
        </div>
      </div>

      {/* Current Offer Summary */}
      <Card className={selectedNegotiation.status === 'counter_offer_received' ? 'border-2 border-warning-200 bg-warning-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {selectedNegotiation.status === 'counter_offer_received' ? (
              <AlertTriangle className="w-5 h-5 text-warning-600" />
            ) : (
              <MessageSquare className="w-5 h-5 text-primary-600" />
            )}
            {selectedNegotiation.status === 'counter_offer_received' ? 'Counter Offer Received' : 'Current Offer'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-600">Component</span>
              <p className="font-medium">{selectedNegotiation.component}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Quantity</span>
              <p className="font-medium">{selectedNegotiation.quantity} Units</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Current Offer</span>
              <p className="font-bold text-xl text-primary-600">₹{selectedNegotiation.currentOffer}/unit</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Delivery</span>
              <p className="font-medium">{selectedNegotiation.deliveryRequirement} Days</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Original Quote</span>
                <p className="font-medium">₹{selectedNegotiation.originalPrice}/unit</p>
              </div>
              <div>
                <span className="text-gray-600">Revised Quote</span>
                <p className="font-medium">₹{selectedNegotiation.revisedPrice}/unit</p>
              </div>
              <div>
                <span className="text-gray-600">Target Price</span>
                <p className="font-medium">₹{selectedNegotiation.targetPrice}/unit</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Terms</span>
                <p className="font-medium">{selectedNegotiation.paymentTerms}</p>
              </div>
            </div>
          </div>

          {selectedNegotiation.status === 'counter_offer_received' && selectedNegotiation.supplierMessage && (
            <div className="mt-4 p-3 bg-white border border-warning-300 rounded">
              <span className="text-sm font-medium text-warning-800">Procurement Manager Message:</span>
              <p className="text-sm text-warning-700 mt-1">{selectedNegotiation.supplierMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {selectedNegotiation.dealStatus !== 'agreed' && selectedNegotiation.dealStatus !== 'declined' && !showResponseForm && (
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button onClick={handleAcceptOffer} className="flex-1" variant="success">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Offer
              </Button>
              <Button onClick={() => setShowResponseForm(true)} className="flex-1" variant="warning">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Counter Offer
              </Button>
              <Button onClick={handleDeclineOffer} className="flex-1" variant="danger">
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Counter Offer Form */}
      {showResponseForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-600" />
              Send Counter Offer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Price (₹/unit)</label>
                <Input
                  type="number"
                  value={responseData.proposedPrice}
                  onChange={(e) => setResponseData({...responseData, proposedPrice: e.target.value})}
                  placeholder={selectedNegotiation.currentOffer?.toString()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Days</label>
                <Input
                  type="number"
                  value={responseData.deliveryDays}
                  onChange={(e) => setResponseData({...responseData, deliveryDays: e.target.value})}
                  placeholder={selectedNegotiation.deliveryRequirement?.toString()}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Response Message</label>
              <textarea
                value={responseData.message}
                onChange={(e) => setResponseData({...responseData, message: e.target.value})}
                placeholder="Enter your response message..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSendCounterOffer} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send Counter Offer
              </Button>
              <Button variant="secondary" onClick={() => setShowResponseForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Negotiation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Negotiation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedNegotiation.negotiationHistory?.map((history, index) => (
              <div key={history.id} className="flex gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  history.participant === 'procurement' ? 'bg-primary-100' :
                  history.participant === 'supplier' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  {history.participant === 'procurement' && <User className="w-5 h-5 text-primary-600" />}
                  {history.participant === 'supplier' && <Building className="w-5 h-5 text-blue-600" />}
                  {history.participant === 'system' && <Clock className="w-5 h-5 text-gray-600" />}
                </div>
                <div className={`flex-1 p-3 rounded-lg ${
                  history.participant === 'procurement' ? 'bg-primary-50 border border-primary-200' :
                  history.participant === 'supplier' ? 'bg-blue-50 border border-blue-200' :
                  'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      {history.participant === 'procurement' ? 'Procurement Manager' :
                       history.participant === 'supplier' ? 'You (Supplier)' :
                       'System'}
                    </span>
                    <span className="text-xs text-gray-500">{history.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{history.message}</p>
                  {history.price && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-semibold">₹{history.price}/unit</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deal Status */}
      {selectedNegotiation.dealStatus === 'agreed' && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Deal Agreed</h3>
                <p className="text-sm text-green-700">Final negotiated terms have been agreed</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700">Final Price:</span> ₹{selectedNegotiation.finalAgreedPrice}/unit
              </div>
              <div>
                <span className="text-green-700">Delivery:</span> {selectedNegotiation.finalDelivery} Days
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SupplierNegotiations
