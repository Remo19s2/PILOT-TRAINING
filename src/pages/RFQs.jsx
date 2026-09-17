import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import RFQCard from '../components/shared/RFQCard'
import StatusBadge from '../components/shared/StatusBadge'
import { Search, Plus, FileText, Clock, AlertTriangle, Eye, MessageSquare, CheckCircle, ArrowRight, Send, Users } from 'lucide-react'
import { triggerRfqDeadlineReached } from '../api/events'
import { useSupplierMonitoring } from '../lib/useSupplierMonitoring'

const RFQs = () => {
  const navigate = useNavigate()
  const { rfqs, quotations, suppliers, sendRFQ } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [sendingRfqId, setSendingRfqId] = useState(null)
  const [notification, setNotification] = useState(null)

  // Trigger 3 — Real-Time Supplier Monitoring every 2 min
  useSupplierMonitoring(suppliers, true)

  // Trigger 1 — RFQ Deadline Reached (auto-detect on mount + every minute)
  useEffect(() => {
    const checkDeadlines = async () => {
      const now = new Date()
      const overdue = rfqs.filter(rfq => {
        if (!rfq.quotation_deadline && !rfq.quotationDeadline) return false
        const deadline = new Date(rfq.quotation_deadline || rfq.quotationDeadline)
        const status = rfq.status?.toLowerCase()
        return deadline <= now && ['open', 'rfq_sent', 'rfq_viewed'].includes(status)
      })
      for (const rfq of overdue) {
        const rfqQuotes = quotations.filter(q => q.rfqId === rfq.id || q.rfq_id === rfq.id)
        try {
          await triggerRfqDeadlineReached({
            rfq_id:                   rfq.id,
            component_id:             rfq.component_id || rfq.componentId || null,
            required_delivery_date:   rfq.required_delivery_date || rfq.requiredDeliveryDate || null,
            expected_supplier_count:  rfq.expected_supplier_count || rfq.expectedSupplierCount || 0,
            quotation_count:          rfqQuotes.length,
            priority:                 'HIGH',
          })
        } catch { /* best-effort */ }
      }
    }
    checkDeadlines()
    const timer = setInterval(checkDeadlines, 60 * 1000)
    return () => clearInterval(timer)
  }, [rfqs, quotations])


  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = rfq.component?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.id?.toLowerCase().includes(searchTerm.toLowerCase())
    let matchesStatus = true
    const s = rfq.status?.toLowerCase()
    if (statusFilter === 'draft') {
      matchesStatus = ['draft', 'rfq_created'].includes(s)
    } else if (statusFilter === 'open') {
      matchesStatus = ['open', 'rfq_sent'].includes(s)
    } else if (statusFilter !== 'all') {
      matchesStatus = s === statusFilter.toLowerCase()
    }
    return matchesSearch && matchesStatus
  })

  const handleSendRFQ = async (rfq) => {
    try {
      setSendingRfqId(rfq.id)
      const supplierIds = rfq.supplierIds || rfq.suppliers?.map(s => s.supplier_id || s) || []
      await sendRFQ(rfq.id, supplierIds)
      setNotification({
        type: 'success',
        message: `RFQ ${rfq.id} was successfully sent to ${supplierIds.length > 0 ? supplierIds.length : 'assigned'} supplier(s)!`,
      })
      if (selectedRFQ && selectedRFQ.id === rfq.id) {
        setSelectedRFQ(prev => prev ? { ...prev, status: 'open' } : null)
      }
      setTimeout(() => setNotification(null), 6000)
    } catch (err) {
      console.error('Failed to send RFQ:', err)
      setNotification({
        type: 'error',
        message: 'Failed to send RFQ: ' + (err.response?.data?.detail || err.message),
      })
    } finally {
      setSendingRfqId(null)
    }
  }

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
    const onTimeQuotations = rfqQuotations.filter(q => q.submissionStatus === 'on-time' || q.submissionStatus === 'on_time')
    const lateQuotations = rfqQuotations.filter(q => q.submissionStatus === 'late')
    const isDraft = ['draft', 'rfq_created'].includes(selectedRFQ.status?.toLowerCase())
    const isOpenAwaiting = (selectedRFQ.status === 'open' || selectedRFQ.status === 'rfq_sent') && rfqQuotations.length === 0
    const assignedSupplierIds = selectedRFQ.supplierIds || selectedRFQ.suppliers?.map(s => s.supplier_id || s) || []
    const assignedSuppliersList = suppliers.filter(s => assignedSupplierIds.includes(s.id))

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={handleBackToList}>
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to RFQs
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-navy-900">
                  {isDraft ? 'RFQ Draft & Dispatch' : 'Quotation Review'}
                </h1>
                <StatusBadge status={selectedRFQ.status} />
              </div>
              <p className="text-gray-600 mt-1">{selectedRFQ.id} - {selectedRFQ.component}</p>
            </div>
          </div>
          {isDraft && (
            <Button
              onClick={() => handleSendRFQ(selectedRFQ)}
              disabled={sendingRfqId === selectedRFQ.id}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 flex items-center gap-2 shadow"
            >
              <Send className="w-4 h-4" />
              {sendingRfqId === selectedRFQ.id ? 'Sending...' : 'Send to Suppliers'}
            </Button>
          )}
        </div>

        {notification && (
          <div className={`p-4 rounded-lg flex items-center justify-between border ${
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <span className="font-medium text-sm">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-xs font-semibold underline ml-4">Dismiss</button>
          </div>
        )}

        {/* Draft Dispatch Panel */}
        {isDraft && (
          <Card className="border-2 border-blue-400 bg-blue-50/70 shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2 text-blue-950">
                    <Send className="w-5 h-5 text-blue-600" />
                    Draft RFQ — Ready for Supplier Dispatch
                  </CardTitle>
                  <CardDescription className="text-blue-900 mt-1">
                    This RFQ is currently saved as a draft. Click below to dispatch it to assigned suppliers and begin receiving quotations.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleSendRFQ(selectedRFQ)}
                  disabled={sendingRfqId === selectedRFQ.id}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 shadow hover:shadow-md transition-all flex items-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  {sendingRfqId === selectedRFQ.id ? 'Dispatching RFQ...' : 'Send RFQ to Suppliers Now'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-t border-blue-200 pt-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Target Suppliers ({assignedSuppliersList.length > 0 ? assignedSuppliersList.length : assignedSupplierIds.length}):
                </h4>
                {assignedSuppliersList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {assignedSuppliersList.map(sup => (
                      <div key={sup.id} className="p-3 bg-white border border-blue-200 rounded-lg shadow-xs">
                        <p className="font-semibold text-sm text-gray-900">{sup.name}</p>
                        <p className="text-xs text-gray-500">{sup.code || sup.id}</p>
                        {sup.contact_email && <p className="text-xs text-gray-400 mt-1">{sup.contact_email}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">All registered suppliers will be eligible to quote on this RFQ once dispatched.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Awaiting Quotations Banner */}
        {isOpenAwaiting && (
          <Card className="border border-emerald-300 bg-emerald-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-950">
                <Clock className="w-5 h-5 text-emerald-600" />
                RFQ Dispatched — Awaiting Supplier Quotations
              </CardTitle>
              <CardDescription className="text-emerald-900">
                This RFQ has been sent to suppliers. Quotations submitted prior to the deadline ({selectedRFQ.quotationDeadline || 'N/A'}) will appear here automatically.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

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

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-lg flex items-center justify-between border ${
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="font-medium text-sm">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs font-semibold underline ml-4">Dismiss</button>
        </div>
      )}

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
                <option value="draft">Draft / Created</option>
                <option value="open">Open / RFQ Sent</option>
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
              onSend={handleSendRFQ}
              isSending={sendingRfqId === rfq.id}
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
