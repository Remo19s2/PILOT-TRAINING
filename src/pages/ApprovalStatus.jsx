import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { CheckCircle, X, Clock, DollarSign, Package, Truck, AlertTriangle, FileText, User, Building, Send, Search } from 'lucide-react'

const ApprovalStatus = () => {
  const navigate = useNavigate()
  const { approvals, rfqs, quotations, suppliers, approveRequest, rejectRequest } = useWorkflow()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.component?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusVariant = (status) => {
    const variants = {
      'pending_finance_approval': 'warning',
      'approved': 'success',
      'rejected': 'danger'
    }
    return variants[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending_finance_approval': 'Pending Approval',
      'approved': 'Approved',
      'rejected': 'Rejected'
    }
    return labels[status] || status
  }

  const handleViewDetails = (approval) => {
    setSelectedApproval(approval)
  }

  const handleBackToList = () => {
    setSelectedApproval(null)
  }

  const handleApprove = () => {
    if (!selectedApproval) return
    
    approveRequest(selectedApproval.id)
    setShowApproveDialog(false)
    setSelectedApproval({
      ...selectedApproval,
      status: 'approved'
    })
    alert('Approval request approved successfully!')
  }

  const handleReject = () => {
    if (!selectedApproval || !rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    
    rejectRequest(selectedApproval.id, rejectionReason)
    setShowRejectDialog(false)
    setRejectionReason('')
    setSelectedApproval({
      ...selectedApproval,
      status: 'rejected',
      rejectionReason
    })
    alert('Approval request rejected.')
  }

  // Detail View
  if (selectedApproval) {
    const rfq = rfqs.find(r => r.id === selectedApproval.rfqId)
    const supplier = suppliers.find(s => s.id === selectedApproval.supplierId)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={handleBackToList}>
            <X className="w-4 h-4 mr-2" />
            Back to Approvals
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Approval Details</h1>
            <p className="text-gray-600 mt-1">{selectedApproval.id} - {selectedApproval.component}</p>
          </div>
        </div>

        {/* Status Banner */}
        <Card className={selectedApproval.status === 'approved' ? 'border-2 border-green-200 bg-green-50' : 
                        selectedApproval.status === 'rejected' ? 'border-2 border-red-200 bg-red-50' :
                        'border-2 border-warning-200 bg-warning-50'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedApproval.status === 'approved' && <CheckCircle className="w-6 h-6 text-green-600" />}
                {selectedApproval.status === 'rejected' && <X className="w-6 h-6 text-red-600" />}
                {selectedApproval.status === 'pending_finance_approval' && <Clock className="w-6 h-6 text-warning-600" />}
                <div>
                  <h3 className="font-semibold text-navy-900">{getStatusLabel(selectedApproval.status)}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedApproval.status === 'approved' ? 'Budget approved for procurement' :
                     selectedApproval.status === 'rejected' ? 'Budget request rejected' :
                     'Awaiting finance approval'}
                  </p>
                </div>
              </div>
              {selectedApproval.status === 'pending_finance_approval' && (
                <div className="flex gap-2">
                  <Button onClick={() => setShowApproveDialog(true)} variant="success">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button onClick={() => setShowRejectDialog(true)} variant="danger">
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
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
                  <span className="text-sm text-gray-600">Created At</span>
                  <p className="font-medium">{new Date(selectedApproval.createdAt).toLocaleString()}</p>
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

        {/* Procurement Manager Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Procurement Manager Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Reason for Selection:</strong> This supplier was selected based on overall score, quality, delivery performance, and negotiated pricing.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Overall Score:</span>
                  <p className="font-medium">{supplier?.overallScore || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Quality Score:</span>
                  <p className="font-medium">{supplier?.qualityScore || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Information */}
        {supplier && supplier.riskLevel === 'High' && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Risk Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-800">
                This supplier has a high predicted risk score. Please review carefully before approving.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Rejection Reason */}
        {selectedApproval.status === 'rejected' && selectedApproval.rejectionReason && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                Rejection Reason
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-800">{selectedApproval.rejectionReason}</p>
            </CardContent>
          </Card>
        )}

        {/* Approve Dialog */}
        {showApproveDialog && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Confirm Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to approve this procurement request for ₹{selectedApproval.totalPrice.toLocaleString()}?
              </p>
              <div className="flex gap-2">
                <Button onClick={handleApprove} className="flex-1" variant="success">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Approval
                </Button>
                <Button variant="secondary" onClick={() => setShowApproveDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reject Dialog */}
        {showRejectDialog && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                Reject Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Please provide a reason for rejecting this procurement request.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <Button onClick={handleReject} className="flex-1" variant="danger">
                  <X className="w-4 h-4 mr-2" />
                  Confirm Rejection
                </Button>
                <Button variant="secondary" onClick={() => setShowRejectDialog(false)} className="flex-1">
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
        <h1 className="text-2xl font-bold text-navy-900">Finance Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve procurement requests</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending_finance_approval">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approvals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Approval Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApprovals.length > 0 ? (
            <div className="space-y-4">
              {filteredApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                  onClick={() => handleViewDetails(approval)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-navy-900">{approval.component}</p>
                      <p className="text-sm text-gray-600">{approval.id} • {approval.supplierName}</p>
                    </div>
                    <Badge variant={getStatusVariant(approval.status)}>
                      {getStatusLabel(approval.status)}
                    </Badge>
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
                      <span className="text-gray-600">Submitted</span>
                      <p className="font-medium">{new Date(approval.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No approval requests found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ApprovalStatus
