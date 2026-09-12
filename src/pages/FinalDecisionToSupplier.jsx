import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { ArrowLeft, Send, CheckCircle, Package, Truck, DollarSign, Building, FileText, AlertTriangle } from 'lucide-react'

const FinalDecisionToSupplier = () => {
  const navigate = useNavigate()
  const { approvalId } = useParams()
  const { approvals, suppliers, sendFinalDecisionToSupplier } = useWorkflow()
  
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [message, setMessage] = useState('')

  // Find the approval
  const approval = approvals.find(a => a.id === approvalId)
  
  if (approval && !selectedApproval) {
    setSelectedApproval(approval)
  }

  const handleSendDecision = () => {
    if (!selectedApproval) return
    
    sendFinalDecisionToSupplier(selectedApproval.id, selectedApproval.supplierId, message)
    setShowConfirmation(false)
    alert('Final decision sent to supplier successfully!')
    navigate('/procurement-dashboard')
  }

  const handleBack = () => {
    navigate(-1)
  }

  // Detail View
  if (selectedApproval) {
    const supplier = suppliers.find(s => s.id === selectedApproval.supplierId)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Final Decision to Supplier</h1>
            <p className="text-gray-600 mt-1">{selectedApproval.id} - Send final decision notification</p>
          </div>
        </div>

        {/* Approval Status */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Finance Approved</h3>
                <p className="text-sm text-green-700">Budget approved for procurement. Ready to send final decision to supplier.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Procurement Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Procurement Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Approval ID</span>
                <p className="font-medium">{selectedApproval.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">RFQ ID</span>
                <p className="font-medium">{selectedApproval.rfqId}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Component</span>
                <p className="font-medium">{selectedApproval.component}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Quantity</span>
                <p className="font-medium">{selectedApproval.quantity} Units</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Budget Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Expected Budget</span>
                  <p className="font-medium">₹{selectedApproval.expectedBudget?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Unit Price</span>
                  <p className="font-medium">₹{selectedApproval.unitPrice}/unit</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Cost</span>
                  <p className="font-bold text-xl text-navy-900">₹{selectedApproval.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Delivery & Terms</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Delivery Time</span>
                  <p className="font-medium flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    {selectedApproval.deliveryTime} Days
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Approved On</span>
                  <p className="font-medium">{new Date(selectedApproval.approvedAt || selectedApproval.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary-600" />
              Supplier Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Supplier Name</span>
                <p className="font-medium">{selectedApproval.supplierName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Supplier ID</span>
                <p className="font-medium">{selectedApproval.supplierId}</p>
              </div>
              {supplier && (
                <>
                  <div>
                    <span className="text-sm text-gray-600">Rating</span>
                    <p className="font-medium">{supplier.rating}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <Badge variant={supplier.riskLevel === 'Low' ? 'success' : supplier.riskLevel === 'Medium' ? 'warning' : 'danger'}>
                      {supplier.riskLevel} Risk
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message to Supplier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-600" />
              Message to Supplier
            </CardTitle>
            <CardDescription>Add a personal message to include with the final decision notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message to the supplier (optional)..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button onClick={() => setShowConfirmation(true)} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Final Decision to Supplier
            </Button>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <Card className="border-2 border-primary-200 bg-primary-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary-600" />
                Confirm Send Final Decision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You are about to send the final decision notification to <strong>{selectedApproval.supplierName}</strong>.
              </p>

              <div className="bg-white p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier:</span>
                  <span className="font-medium">{selectedApproval.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Component:</span>
                  <span className="font-medium">{selectedApproval.component}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{selectedApproval.quantity} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-bold text-navy-900">₹{selectedApproval.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium">{selectedApproval.deliveryTime} Days</span>
                </div>
              </div>

              {message && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <span className="text-sm font-medium text-blue-800">Your Message:</span>
                  <p className="text-sm text-blue-700 mt-1">{message}</p>
                </div>
              )}

              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>Next Step:</strong> The supplier will receive the notification and can acknowledge the order to proceed with procurement.
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSendDecision} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Confirm & Send
                </Button>
                <Button variant="secondary" onClick={() => setShowConfirmation(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // List View (if no approval selected)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Final Decisions to Suppliers</h1>
        <p className="text-gray-600 mt-1">Send final decision notifications to suppliers after finance approval</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Approved Requests Ready for Final Decision
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvals.filter(a => a.status === 'approved').length > 0 ? (
            <div className="space-y-4">
              {approvals.filter(a => a.status === 'approved').map((approval) => (
                <div
                  key={approval.id}
                  className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                  onClick={() => setSelectedApproval(approval)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-navy-900">{approval.component}</p>
                      <p className="text-sm text-gray-600">{approval.id} • {approval.supplierName}</p>
                    </div>
                    <Badge variant="success">Finance Approved</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Quantity</span>
                      <p className="font-medium">{approval.quantity} Units</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Cost</span>
                      <p className="font-bold">₹{approval.totalPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery</span>
                      <p className="font-medium">{approval.deliveryTime} Days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No approved requests ready for final decision</p>
              <p className="text-sm text-gray-500 mt-2">Approved requests will appear here after finance approval</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FinalDecisionToSupplier
