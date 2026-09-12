import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import StatusBadge from '../components/shared/StatusBadge'
import WorkflowTracker from '../components/shared/WorkflowTracker'
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Package, Calendar, DollarSign, Users, FileText } from 'lucide-react'

const RFQDetailManager = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rfqs, quotations, suppliers } = useWorkflow()
  
  const rfq = rfqs.find(r => r.id === id)
  const [timeRemaining, setTimeRemaining] = useState({ text: '', status: 'default' })

  if (!rfq) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">RFQ not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    )
  }

  // Calculate time remaining for deadline
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!rfq.quotationDeadline) return { text: 'No Deadline', status: 'default' }
      
      const deadlineDate = new Date(rfq.quotationDeadline)
      const now = new Date()
      const diff = deadlineDate - now
      
      if (diff <= 0) {
        return { text: 'Closed', status: 'danger' }
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      
      if (days > 0) {
        return { text: `${days}d ${hours}h remaining`, status: days <= 1 ? 'warning' : 'success' }
      }
      
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      if (hours > 0) {
        return { text: `${hours}h ${minutes}m remaining`, status: hours <= 2 ? 'danger' : 'warning' }
      }
      
      return { text: `${minutes}m remaining`, status: 'danger' }
    }

    setTimeRemaining(calculateTimeRemaining())
    const interval = setInterval(calculateTimeRemaining, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [rfq.quotationDeadline])

  const getDeadlineStatus = () => {
    if (!rfq.quotationDeadline) return { label: 'No Deadline', variant: 'default' }
    
    const deadlineDate = new Date(rfq.quotationDeadline)
    const now = new Date()
    const diff = deadlineDate - now
    
    if (diff <= 0) {
      return { label: 'Closed', variant: 'danger' }
    }
    
    const hours = diff / (1000 * 60 * 60)
    if (hours <= 24) {
      return { label: 'Closing Soon', variant: 'warning' }
    }
    
    return { label: 'Open', variant: 'success' }
  }

  const deadlineStatus = getDeadlineStatus()

  // Get quotations for this RFQ
  const rfqQuotations = quotations.filter(q => q.rfqId === rfq.id)
  
  // Separate on-time and late submissions
  const onTimeQuotations = rfqQuotations.filter(q => q.submissionStatus === 'on_time')
  const lateQuotations = rfqQuotations.filter(q => q.submissionStatus === 'late')

  // Get supplier response status
  const supplierResponses = rfq.selectedSuppliers?.map(supplierId => {
    const supplier = suppliers.find(s => s.id === supplierId)
    const quotation = rfqQuotations.find(q => q.supplierId === supplierId)
    
    let status = 'pending'
    let submittedDate = null
    let submissionStatus = null
    
    if (quotation) {
      status = 'submitted'
      submittedDate = quotation.submittedDate
      submissionStatus = quotation.submissionStatus
    }
    
    return {
      supplierId,
      supplierName: supplier?.name || 'Unknown',
      status,
      submittedDate,
      submissionStatus,
      quotation
    }
  }) || []

  const handleCompareQuotations = () => {
    navigate(`/supplier-comparison/${rfq.id}`)
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

      {/* Workflow Tracker with Deadline Status */}
      <WorkflowTracker 
        currentStatus={rfq.status} 
        workflowType="rfq_deadline"
        deadlineStatus={deadlineStatus.label}
      />

      {/* RFQ Information */}
      <Card>
        <CardHeader>
          <CardTitle>RFQ Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-600">Component</span>
              <p className="font-medium text-black">{rfq.component}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Quantity</span>
              <p className="font-medium">{rfq.quantity?.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Expected Budget</span>
              <p className="font-medium">₹{rfq.expectedBudget?.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Delivery Deadline</span>
              <p className="font-medium">{rfq.deliveryDeadline}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotation Deadline Section */}
      <Card className="border-2 border-primary-200 bg-primary-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            Quotation Submission Deadline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-navy-900">{rfq.quotationDeadline || 'Not Set'}</p>
              <p className="text-sm text-gray-600 mt-1">Suppliers must submit quotations before this deadline</p>
            </div>
            <div className="text-right">
              <Badge variant={deadlineStatus.variant} className="text-sm">
                {deadlineStatus.label}
              </Badge>
              <div className={`text-lg font-bold mt-2 ${
                timeRemaining.status === 'danger' ? 'text-red-600' :
                timeRemaining.status === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {timeRemaining.text}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Response Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Supplier Responses
          </CardTitle>
          <CardDescription>Track supplier quotation submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supplierResponses.map((response) => (
              <div key={response.supplierId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    response.status === 'submitted' && response.submissionStatus === 'on_time' ? 'bg-green-100' :
                    response.status === 'submitted' && response.submissionStatus === 'late' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {response.status === 'submitted' && response.submissionStatus === 'on_time' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {response.status === 'submitted' && response.submissionStatus === 'late' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                    {response.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">{response.supplierName}</p>
                    <p className="text-sm text-gray-600">
                      {response.status === 'submitted' ? `Submitted: ${response.submittedDate}` : 'Status: Awaiting Response'}
                    </p>
                  </div>
                </div>
                <div>
                  {response.status === 'submitted' && response.submissionStatus === 'on_time' && (
                    <Badge variant="success">On Time</Badge>
                  )}
                  {response.status === 'submitted' && response.submissionStatus === 'late' && (
                    <Badge variant="danger">Late Submission</Badge>
                  )}
                  {response.status === 'pending' && (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Quotations (On-Time Only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Active Quotations
          </CardTitle>
          <CardDescription>Quotations received before the deadline</CardDescription>
        </CardHeader>
        <CardContent>
          {onTimeQuotations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onTimeQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.supplierName}</TableCell>
                    <TableCell>₹{quotation.unitPrice}</TableCell>
                    <TableCell>₹{quotation.totalPrice?.toLocaleString()}</TableCell>
                    <TableCell>{quotation.deliveryTime} Days</TableCell>
                    <TableCell>{quotation.submittedDate}</TableCell>
                    <TableCell>
                      <Badge variant="success">On Time</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 text-center py-8">No on-time quotations received</p>
          )}
        </CardContent>
      </Card>

      {/* Late Submissions */}
      {lateQuotations.length > 0 && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Late Submissions
            </CardTitle>
            <CardDescription>Quotations received after the submission deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> These quotations were received after the deadline and are excluded from active comparison and supplier selection.
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lateQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.supplierName}</TableCell>
                    <TableCell>₹{quotation.unitPrice}</TableCell>
                    <TableCell>₹{quotation.totalPrice?.toLocaleString()}</TableCell>
                    <TableCell>{quotation.submittedDate}</TableCell>
                    <TableCell>{rfq.quotationDeadline}</TableCell>
                    <TableCell>
                      <Badge variant="danger">Late Submission</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleCompareQuotations}
            disabled={onTimeQuotations.length < 2}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Compare On-Time Quotations ({onTimeQuotations.length})
          </Button>
          {lateQuotations.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              Note: Late submissions are excluded from comparison
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RFQDetailManager
