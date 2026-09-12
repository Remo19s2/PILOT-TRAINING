import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import StatusBadge from '../components/shared/StatusBadge'
import WorkflowTracker from '../components/shared/WorkflowTracker'
import ConfirmationDialog from '../components/shared/ConfirmationDialog'
import { ArrowLeft, Check, X, DollarSign, Calendar, Truck, Building, AlertTriangle } from 'lucide-react'

const FinanceApproval = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { approvals, approveRequest, rejectRequest, workflowStatuses } = useWorkflow()
  
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const approval = approvals.find(a => a.id === id)

  const handleApprove = () => {
    setIsProcessing(true)
    approveRequest(id)
    setIsProcessing(false)
    alert('Request approved successfully!')
    navigate('/pending-approvals')
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    setIsProcessing(true)
    rejectRequest(id, rejectionReason)
    setIsProcessing(false)
    setShowRejectDialog(false)
    alert('Request rejected successfully!')
    navigate('/pending-approvals')
  }

  if (!approval) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Approval request not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const budgetStatus = approval.totalPrice <= approval.expectedBudget ? 'within_budget' : 'over_budget'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Finance Approval</h1>
          <p className="text-gray-600 mt-1">{approval.id}</p>
        </div>
      </div>

      <WorkflowTracker currentStatus={approval.status} workflowStatuses={workflowStatuses} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approval Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Component</label>
                  <p className="text-lg font-semibold text-navy-900">{approval.component}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Supplier</label>
                  <p className="text-lg font-semibold text-navy-900">{approval.supplierName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Quantity</label>
                  <p className="text-2xl font-bold text-navy-900">{approval.quantity?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                  <p className="text-2xl font-bold text-navy-900">{approval.deliveryTime} days</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                  <p className="text-2xl font-bold text-navy-900">₹{approval.unitPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Procurement Cost</label>
                  <p className="text-3xl font-bold text-primary-600">₹{approval.totalPrice?.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <p className="text-gray-900">{approval.paymentTerms || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Budget</label>
                  <p className="text-2xl font-bold text-navy-900">₹{approval.expectedBudget?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Status</label>
                  <div className={`p-3 rounded-lg ${
                    budgetStatus === 'within_budget' ? 'bg-success-100' : 'bg-danger-100'
                  }`}>
                    <p className={`font-semibold ${
                      budgetStatus === 'within_budget' ? 'text-success-700' : 'text-danger-700'
                    }`}>
                      {budgetStatus === 'within_budget' ? 'Within Budget' : 'Over Budget'}
                    </p>
                  </div>
                </div>
              </div>

              {budgetStatus === 'over_budget' && (
                <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-danger-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-danger-900">Budget Exceeded</p>
                      <p className="text-sm text-danger-800">
                        This request exceeds the expected budget by ₹{(approval.totalPrice - approval.expectedBudget).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Budget Variance:</span>{' '}
                  {budgetStatus === 'within_budget' ? '+' : ''}
                  ₹{(approval.totalPrice - approval.expectedBudget).toLocaleString()}
                  {' '}
                  ({((approval.totalPrice - approval.expectedBudget) / approval.expectedBudget * 100).toFixed(1)}%)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {approval.status === 'pending_finance_approval' ? (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="w-full"
                    variant="success"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Approve Request'}
                  </Button>
                  <Button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isProcessing}
                    variant="danger"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  This request has already been {approval.status === 'approved' ? 'approved' : 'rejected'}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={approval.status} />
              <p className="text-sm text-gray-600 mt-2">
                Created: {new Date(approval.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rejection Dialog */}
      <ConfirmationDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        title="Reject Approval Request"
        message={
          <div>
            <p className="mb-4">Are you sure you want to reject this approval request?</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
              <Input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
            </div>
          </div>
        }
        confirmText="Reject Request"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

export default FinanceApproval
