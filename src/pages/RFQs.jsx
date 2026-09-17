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
import { Search, Plus, FileText, Clock, AlertTriangle, Eye, MessageSquare, CheckCircle, ArrowRight, Send, Users, ArrowLeft, Building2 } from 'lucide-react'
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
      matchesStatus = ['open', 'rfq_sent', 'sent', 'received', 'rfq_viewed', 'quotations_received'].includes(s)
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
        message: `RFQ ${rfq.id} dispatched to ${supplierIds.length > 0 ? supplierIds.length : 'assigned'} supplier(s)!`,
      })
      if (selectedRFQ && selectedRFQ.id === rfq.id) {
        setSelectedRFQ(prev => prev ? { ...prev, status: 'open' } : null)
      }
      setTimeout(() => setNotification(null), 5000)
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
    const rfqQuotations = quotations.filter(q => q.rfqId === selectedRFQ.id || q.rfq_id === selectedRFQ.id)
    const onTimeQuotations = rfqQuotations.filter(q => q.submissionStatus === 'on-time' || q.submissionStatus === 'on_time')
    const lateQuotations = rfqQuotations.filter(q => q.submissionStatus === 'late')
    const isDraft = ['draft', 'rfq_created'].includes(selectedRFQ.status?.toLowerCase())
    const isOpenAwaiting = (selectedRFQ.status === 'open' || selectedRFQ.status === 'rfq_sent') && rfqQuotations.length === 0
    const assignedSupplierIds = selectedRFQ.supplierIds || selectedRFQ.suppliers?.map(s => s.supplier_id || s) || []
    const assignedSuppliersList = suppliers.filter(s => assignedSupplierIds.includes(s.id))

    return (
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Detail Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackToList} className="h-8 px-2 text-gray-600 hover:text-navy-900">
              <ArrowLeft className="w-4 h-4 mr-1" />
              RFQ Index
            </Button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-navy-900">
                  {selectedRFQ.component || 'Component RFQ'}
                </h1>
                <Badge variant="primary" className="text-[10px] font-mono">{selectedRFQ.id}</Badge>
                <StatusBadge status={selectedRFQ.status} />
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Target: {Number(selectedRFQ.quantity || 1000).toLocaleString()} units &bull; Deadline: {selectedRFQ.quotationDeadline || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDraft && (
              <Button
                size="sm"
                onClick={() => handleSendRFQ(selectedRFQ)}
                disabled={sendingRfqId === selectedRFQ.id}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-8 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                {sendingRfqId === selectedRFQ.id ? 'Dispatching...' : 'Send RFQ to Suppliers'}
              </Button>
            )}
            {rfqQuotations.length > 0 && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleProceedToNegotiation(selectedRFQ)}
                  className="text-xs font-semibold h-8"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Negotiation Center
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleProceedToComparison(selectedRFQ)}
                  className="bg-navy-900 hover:bg-slate-800 text-white text-xs font-semibold h-8 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Compare Quotes ({rfqQuotations.length})
                </Button>
              </>
            )}
          </div>
        </div>

        {notification && (
          <div className={`p-3 rounded-lg flex items-center justify-between border text-xs font-semibold ${
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="underline ml-4 text-[11px]">Dismiss</button>
          </div>
        )}

        {/* Draft Dispatch Panel */}
        {isDraft && (
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  Ready for Dispatch
                </h3>
                <p className="text-xs text-blue-900 mt-0.5">
                  Assigned suppliers will receive instant automated RFQ notifications upon release.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleSendRFQ(selectedRFQ)}
                disabled={sendingRfqId === selectedRFQ.id}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8"
              >
                {sendingRfqId === selectedRFQ.id ? 'Dispatching...' : 'Dispatch Now'}
              </Button>
            </div>

            {assignedSuppliersList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-blue-200/60">
                {assignedSuppliersList.map(sup => (
                  <div key={sup.id} className="p-2.5 bg-white rounded-lg border border-blue-100 text-xs">
                    <p className="font-bold text-navy-900">{sup.name}</p>
                    <p className="text-[10px] text-gray-500">{sup.id} &bull; {sup.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quotations Ledger Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Received Quotations ({rfqQuotations.length})
            </h3>
            <span className="text-[11px] text-gray-500">
              {onTimeQuotations.length} On-Time &bull; {lateQuotations.length} Late
            </span>
          </div>

          {rfqQuotations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {rfqQuotations.map(quotation => {
                const supplier = suppliers.find(s => s.id === quotation.supplierId)
                const isLate = quotation.submissionStatus === 'late'

                return (
                  <div
                    key={quotation.id}
                    onClick={() => navigate(`/supplier-comparison/${selectedRFQ.id}`)}
                    className={`p-3.5 rounded-xl border bg-white hover:shadow-md transition-all cursor-pointer ${
                      isLate ? 'border-amber-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-navy-900 truncate">
                          {supplier?.name || quotation.supplierName}
                        </h4>
                        <p className="text-[10px] text-gray-500">{quotation.supplierId}</p>
                      </div>
                      <Badge variant={isLate ? 'warning' : 'success'} className="text-[10px]">
                        {isLate ? 'Late' : 'On-Time'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 p-2 bg-gray-50 rounded-lg border border-gray-100 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">Unit Price</span>
                        <span className="font-bold text-navy-900">₹{quotation.unitPrice}/u</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">Lead Time</span>
                        <span className="font-bold text-blue-700">{quotation.deliveryTime} Days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 text-[11px]">
                      <span className="text-gray-400">Total: ₹{quotation.totalPrice?.toLocaleString()}</span>
                      <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                        Inspect
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <Card className="p-8 text-center border-dashed">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-700">Awaiting Supplier Submissions</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Quotations will automatically populate as suppliers respond before the deadline.
              </p>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            RFQs & Supplier Quotations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time RFQ dispatch, multi-source quotation collation, and deadline tracking
          </p>
        </div>

        <Button
          onClick={() => navigate('/create-rfq')}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-8 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Create RFQ
        </Button>
      </div>

      {notification && (
        <div className={`p-3 rounded-lg flex items-center justify-between border text-xs font-semibold ${
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="underline ml-4 text-[11px]">Dismiss</button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search component or RFQ ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft / Created</option>
            <option value="open">Open / Dispatched</option>
            <option value="quotation_submitted">Quotations Received</option>
            <option value="supplier_selected">Supplier Selected</option>
          </Select>
        </div>
      </div>

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
        <Card className="p-12 text-center border-dashed">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-700">No RFQs matching filter</p>
          <Button onClick={() => navigate('/create-rfq')} size="sm" className="mt-3 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Create First RFQ
          </Button>
        </Card>
      )}
    </div>
  )
}

export default RFQs
