import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import RFQCard from '../components/shared/RFQCard'
import StatusBadge from '../components/shared/StatusBadge'
import { Search, Plus, FileText, Clock, AlertTriangle, Eye, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react'

const RFQs = () => {
  const navigate = useNavigate()
  const { rfqs, quotations, suppliers } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRFQ, setSelectedRFQ] = useState(null)

  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = rfq.component?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewRFQ = (rfq) => {
    setSelectedRFQ(rfq)
  }

  const handleBackToList = () => {
    setSelectedRFQ(null)
  }

  const handleProceedToNegotiation = (rfq) => {
    navigate(`/negotiation-center/${rfq.id}`)
  }

  const handleProceedToComparison = (rfq) => {
    navigate(`/supplier-comparison/${rfq.id}`)
  }

  // Quotation Review View
  if (selectedRFQ) {
    const rfqQuotations = quotations.filter(q => q.rfqId === selectedRFQ.id)
    const onTimeQuotations = rfqQuotations.filter(q => q.submissionStatus === 'on-time')
    const lateQuotations = rfqQuotations.filter(q => q.submissionStatus === 'late')

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={handleBackToList}>
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to RFQs
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Quotation Review</h1>
            <p className="text-gray-600 mt-1">{selectedRFQ.id} - {selectedRFQ.component}</p>
          </div>
        </div>

        {/* RFQ Summary */}
        <Card>
          <CardHeader>
            <CardTitle>RFQ Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">RFQ ID</span>
                <p className="font-medium">{selectedRFQ.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Component</span>
                <p className="font-medium">{selectedRFQ.component}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Quantity</span>
                <p className="font-medium">{selectedRFQ.quantity} Units</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Deadline</span>
                <p className="font-medium">{selectedRFQ.quotationDeadline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* On-Time Quotations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              On-Time Quotations ({onTimeQuotations.length})
            </CardTitle>
            <CardDescription>Quotations submitted before the deadline</CardDescription>
          </CardHeader>
          <CardContent>
            {onTimeQuotations.length > 0 ? (
              <div className="space-y-4">
                {onTimeQuotations.map((quotation) => {
                  const supplier = suppliers.find(s => s.id === quotation.supplierId)
                  return (
                    <div
                      key={quotation.id}
                      className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                      onClick={() => navigate(`/supplier-comparison/${selectedRFQ.id}`)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-navy-900">{supplier?.name || quotation.supplierName}</p>
                          <p className="text-sm text-gray-600">{quotation.supplierId}</p>
                        </div>
                        <Badge variant="success">On-Time</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Unit Price</span>
                          <p className="font-medium">₹{quotation.unitPrice}/unit</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total</span>
                          <p className="font-medium">₹{quotation.totalPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Delivery</span>
                          <p className="font-medium">{quotation.deliveryTime} Days</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className="text-xs text-gray-500">Submitted: {quotation.submittedAt}</span>
                        <Button size="sm" variant="secondary">
                          View Details
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No on-time quotations received</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Late Quotations */}
        <Card className="border-2 border-warning-200 bg-warning-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
              Late Submissions ({lateQuotations.length})
            </CardTitle>
            <CardDescription>Quotations submitted after the deadline</CardDescription>
          </CardHeader>
          <CardContent>
            {lateQuotations.length > 0 ? (
              <div className="space-y-4">
                {lateQuotations.map((quotation) => {
                  const supplier = suppliers.find(s => s.id === quotation.supplierId)
                  return (
                    <div
                      key={quotation.id}
                      className="p-4 border border-warning-300 rounded-lg bg-white"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-navy-900">{supplier?.name || quotation.supplierName}</p>
                          <p className="text-sm text-gray-600">{quotation.supplierId}</p>
                        </div>
                        <Badge variant="warning">Late</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Unit Price</span>
                          <p className="font-medium">₹{quotation.unitPrice}/unit</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total</span>
                          <p className="font-medium">₹{quotation.totalPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Delivery</span>
                          <p className="font-medium">{quotation.deliveryTime} Days</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-xs text-warning-700">Submitted: {quotation.submittedAt} (Late)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-gray-600">No late submissions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {onTimeQuotations.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Button onClick={() => handleProceedToComparison(selectedRFQ)} className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Compare Suppliers
                </Button>
                <Button onClick={() => handleProceedToNegotiation(selectedRFQ)} variant="secondary" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Negotiation
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">RFQs & Quotations</h1>
          <p className="text-gray-600 mt-1">Manage RFQs and review supplier quotations</p>
        </div>
        <Button onClick={() => navigate('/create-rfq')}>
          <Plus className="w-4 h-4 mr-2" />
          Create RFQ
        </Button>
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
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="rfq_created">RFQ Created</option>
                <option value="rfq_sent">RFQ Sent</option>
                <option value="rfq_viewed">RFQ Viewed</option>
                <option value="quotation_submitted">Quotation Submitted</option>
                <option value="supplier_selected">Supplier Selected</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFQs Grid */}
      {filteredRFQs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRFQs.map((rfq) => (
            <RFQCard
              key={rfq.id}
              rfq={rfq}
              onView={handleViewRFQ}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No RFQs found</p>
            <Button onClick={() => navigate('/create-rfq')} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create First RFQ
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RFQs
