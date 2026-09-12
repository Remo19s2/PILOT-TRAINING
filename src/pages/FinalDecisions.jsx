import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { CheckCircle, Clock, Package, Truck, DollarSign, FileText, AlertTriangle, Check, X } from 'lucide-react'

const FinalDecisions = () => {
  const navigate = useNavigate()
  const { negotiations, approvals, currentUser } = useWorkflow()
  
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [showAcknowledgment, setShowAcknowledgment] = useState(false)

  const supplierId = currentUser?.id || 'SUP-001'
  
  // Get final decisions for this supplier (negotiations that are agreed and have finance approval)
  const myNegotiations = negotiations.filter(n => n.supplierId === supplierId)
  const finalDecisions = myNegotiations.filter(n => 
    n.dealStatus === 'agreed' && 
    (n.financeStatus === 'approved' || n.financeStatus === 'pending_approval')
  )

  const getStatusVariant = (status) => {
    const variants = {
      'pending_approval': 'warning',
      'approved': 'success',
      'rejected': 'danger',
      'acknowledged': 'success'
    }
    return variants[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending_approval': 'Pending Finance Approval',
      'approved': 'Finance Approved',
      'rejected': 'Finance Rejected',
      'acknowledged': 'Acknowledged'
    }
    return labels[status] || status
  }

  const handleViewDetails = (decision) => {
    setSelectedDecision(decision)
  }

  const handleAcknowledge = () => {
    if (!selectedDecision) return
    
    // In a real app, this would update the decision status
    alert('Final decision acknowledged successfully!')
    setSelectedDecision({
      ...selectedDecision,
      financeStatus: 'acknowledged'
    })
    setShowAcknowledgment(false)
  }

  // Detail View
  if (selectedDecision) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => setSelectedDecision(null)}>
            <X className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Final Decision Details</h1>
            <p className="text-gray-600 mt-1">{selectedDecision.rfqId} - {selectedDecision.component}</p>
          </div>
        </div>

        {/* Decision Status */}
        <Card className={selectedDecision.financeStatus === 'approved' ? 'border-2 border-green-200 bg-green-50' : 'border-2 border-warning-200 bg-warning-50'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {selectedDecision.financeStatus === 'approved' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-warning-600" />
              )}
              <div>
                <h3 className="font-semibold text-navy-900">Finance Decision</h3>
                <p className="text-sm text-gray-600">{getStatusLabel(selectedDecision.financeStatus)}</p>
              </div>
            </div>
            {selectedDecision.financeStatus === 'approved' && !showAcknowledgment && selectedDecision.financeStatus !== 'acknowledged' && (
              <Button onClick={() => setShowAcknowledgment(true)} className="w-full">
                <Check className="w-4 h-4 mr-2" />
                Acknowledge & Accept Order
              </Button>
            )}
            {selectedDecision.financeStatus === 'acknowledged' && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
                <p className="text-sm font-medium text-green-800">Order Acknowledged</p>
                <p className="text-xs text-green-700">You have accepted this final decision. Order confirmation will be sent.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Final Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Final Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">RFQ ID</span>
                <p className="font-medium">{selectedDecision.rfqId}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Component</span>
                <p className="font-medium">{selectedDecision.component}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Quantity</span>
                <p className="font-medium">{selectedDecision.quantity} Units</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={getStatusVariant(selectedDecision.financeStatus)}>
                  {getStatusLabel(selectedDecision.financeStatus)}
                </Badge>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Pricing</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Original Quote</span>
                  <p className="font-medium">₹{selectedDecision.originalPrice}/unit</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Final Agreed Price</span>
                  <p className="font-bold text-xl text-green-600">₹{selectedDecision.finalAgreedPrice}/unit</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Value</span>
                  <p className="font-bold text-xl text-navy-900">
                    ₹{(selectedDecision.finalAgreedPrice * selectedDecision.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Delivery & Terms</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Delivery Commitment</span>
                  <p className="font-medium flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    {selectedDecision.finalDelivery} Days
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Terms</span>
                  <p className="font-medium">{selectedDecision.paymentTerms}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Procurement Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Requirement ID</span>
                  <p className="font-medium">{selectedDecision.requirementId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Procurement Manager</span>
                  <p className="font-medium">Procurement Manager</p>
                </div>
              </div>
            </div>

            {selectedDecision.totalSavings > 0 && (
              <div className="border-t pt-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Negotiation Savings</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">₹{selectedDecision.totalSavings.toLocaleString()}</p>
                  <p className="text-sm text-green-700 mt-1">Total savings from negotiated price</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acknowledgment Confirmation */}
        {showAcknowledgment && (
          <Card className="border-2 border-primary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-600" />
                Acknowledge Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                By acknowledging this final decision, you confirm that you will supply the following:
              </p>
              <div className="bg-gray-50 p-4 rounded space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Component:</span>
                  <span className="font-medium">{selectedDecision.component}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{selectedDecision.quantity} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₹{selectedDecision.finalAgreedPrice}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium">{selectedDecision.finalDelivery} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-bold">₹{(selectedDecision.finalAgreedPrice * selectedDecision.quantity).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAcknowledge} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Acknowledgment
                </Button>
                <Button variant="secondary" onClick={() => setShowAcknowledgment(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // List View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Final Decisions</h1>
        <p className="text-gray-600 mt-1">View finance-approved procurement decisions and acknowledge orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Final Procurement Decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {finalDecisions.length > 0 ? (
            <div className="space-y-4">
              {finalDecisions.map((decision) => (
                <div
                  key={decision.id}
                  className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                  onClick={() => handleViewDetails(decision)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-navy-900">{decision.component}</p>
                      <p className="text-sm text-gray-600">{decision.rfqId} • Qty: {decision.quantity}</p>
                    </div>
                    <Badge variant={getStatusVariant(decision.financeStatus)}>
                      {getStatusLabel(decision.financeStatus)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Final Price:</span>
                      <p className="font-medium">₹{decision.finalAgreedPrice}/unit</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery:</span>
                      <p className="font-medium">{decision.finalDelivery} Days</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Value:</span>
                      <p className="font-bold">₹{(decision.finalAgreedPrice * decision.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                  {decision.totalSavings > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <span className="text-xs text-green-600 font-medium">
                        Savings: ₹{decision.totalSavings.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No final decisions received yet</p>
              <p className="text-sm text-gray-500 mt-2">Final decisions will appear here after finance approval</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FinalDecisions
