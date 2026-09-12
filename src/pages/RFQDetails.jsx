import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import StatusBadge from '../components/shared/StatusBadge'
import WorkflowTracker from '../components/shared/WorkflowTracker'
import { Package, Calendar, DollarSign, ArrowLeft, Send } from 'lucide-react'

const RFQDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rfqs, currentUser, suppliers, workflowStatuses } = useWorkflow()
  
  const rfq = rfqs.find(r => r.id === id)
  const supplierId = currentUser?.id || 'SUP-001'
  const supplier = suppliers.find(s => s.id === supplierId)

  if (!rfq) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">RFQ not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const handleSubmitQuotation = () => {
    navigate(`/submit-quotation/${rfq.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">RFQ Details</h1>
          <p className="text-gray-600 mt-1">{rfq.id}</p>
        </div>
      </div>

      <WorkflowTracker currentStatus={rfq.status} workflowStatuses={workflowStatuses} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFQ Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Component</label>
                  <p className="text-lg font-semibold text-navy-900">{rfq.component}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <p className="text-lg font-semibold text-navy-900">{rfq.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Quantity</label>
                  <p className="text-2xl font-bold text-navy-900">{rfq.quantity?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Budget</label>
                  <p className="text-2xl font-bold text-navy-900">₹{rfq.expectedBudget?.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                <p className="text-gray-900">{rfq.specifications || 'No specifications provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Deadline</label>
                  <p className="text-gray-900">{rfq.deliveryDeadline}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RFQ Closing Date</label>
                  <p className="text-gray-900">{rfq.closingDate}</p>
                </div>
              </div>

              {rfq.additionalRequirements && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
                  <p className="text-gray-900">{rfq.additionalRequirements}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={rfq.status} />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rfq.status === 'rfq_sent' || rfq.status === 'rfq_viewed' ? (
                <Button onClick={handleSubmitQuotation} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Quotation
                </Button>
              ) : rfq.status === 'quotation_submitted' ? (
                <p className="text-sm text-gray-600">Quotation already submitted</p>
              ) : (
                <p className="text-sm text-gray-600">RFQ not available for quotation</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <p className="text-gray-900">{supplier?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <p className="text-gray-900">{supplier?.location || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <p className="text-gray-900">{supplier?.rating || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RFQDetails
