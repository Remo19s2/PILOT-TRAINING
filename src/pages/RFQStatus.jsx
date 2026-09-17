import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Send, CheckCircle, Eye, Package, AlertTriangle, FileText, Clock, Plus } from 'lucide-react'

const RFQStatus = () => {
  const navigate = useNavigate()
  const { rfqs, sendRFQ } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [sendingRfqId, setSendingRfqId] = useState(null)
  const [notification, setNotification] = useState(null)

  const filteredRFQs = rfqs.filter(rfq => {
    const compName = rfq.component || rfq.requirementName || ''
    const supName = rfq.supplierName || ''
    const rfqId = rfq.id || ''
    const matchesSearch = !searchTerm || 
      (compName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       supName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       rfqId.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const draftRFQs = filteredRFQs.filter(r => ['draft', 'rfq_created'].includes(r.status?.toLowerCase()))

  const handleSendDraft = async (rfq) => {
    try {
      setSendingRfqId(rfq.id)
      const supplierIds = rfq.supplierIds || rfq.suppliers?.map(s => s.supplier_id || s) || []
      await sendRFQ(rfq.id, supplierIds)
      setNotification({
        type: 'success',
        message: `RFQ ${rfq.id} was dispatched successfully to suppliers!`,
      })
      setTimeout(() => setNotification(null), 6000)
    } catch (err) {
      console.error('Failed to send RFQ draft:', err)
      setNotification({
        type: 'error',
        message: 'Failed to send RFQ: ' + (err.response?.data?.detail || err.message),
      })
    } finally {
      setSendingRfqId(null)
    }
  }

  const getRFQStatusBadge = (rfq) => {
    const status = rfq.status?.toLowerCase()
    if (['draft', 'rfq_created'].includes(status)) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
          <FileText className="w-3 h-3 text-amber-500" />
          Draft
        </span>
      )
    } else if (status === 'sent' && rfq.openedDate) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <Eye className="w-3 h-3 text-emerald-500" />
          Opened
        </span>
      )
    } else if (status === 'sent' && rfq.receivedDate) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
          <CheckCircle className="w-3 h-3 text-blue-500" />
          Received
        </span>
      )
    } else if (status === 'sent' || status === 'open' || status === 'rfq_sent') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
          <Send className="w-3 h-3 text-blue-500" />
          Sent
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
        {rfq.status?.replace(/_/g, ' ') || 'Unknown'}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">RFQ Status Tracking</h1>
          <p className="text-gray-600 mt-1">Track and manage RFQs and supplier dispatches</p>
        </div>
        <Button onClick={() => navigate('/create-rfq')}>
          <Plus className="w-4 h-4 mr-2" />
          Create RFQ
        </Button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-lg flex items-center justify-between border shadow-sm ${
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
            <span className="font-medium text-sm">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs font-semibold underline ml-4 hover:opacity-80">Dismiss</button>
        </div>
      )}

      {/* Draft banner reminder */}
      {draftRFQs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                {draftRFQs.length} Draft RFQ{draftRFQs.length > 1 ? 's' : ''} Ready to Send
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                You have unsent draft RFQs. Click &quot;Send to Suppliers&quot; in the table below to invite suppliers and begin receiving quotations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Package className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by RFQ ID, requirement, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* RFQ Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>RFQ Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RFQ ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requirement</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sent Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRFQs.map((rfq) => {
                  const isDraft = ['draft', 'rfq_created'].includes(rfq.status?.toLowerCase())
                  const componentName = rfq.component || rfq.requirementName || '—'

                  return (
                    <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900 font-semibold">{rfq.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 font-medium">{componentName}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{rfq.quantity ? `${rfq.quantity.toLocaleString()} units` : '—'}</td>
                      <td className="px-4 py-4 text-sm">
                        {getRFQStatusBadge(rfq)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{rfq.sentDate || (isDraft ? 'Not sent yet' : '—')}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{rfq.quotationDeadline || rfq.deliveryDeadline || '—'}</td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {isDraft ? (
                            <Button
                              size="sm"
                              onClick={() => handleSendDraft(rfq)}
                              disabled={sendingRfqId === rfq.id}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-sm text-xs py-1.5 px-3"
                            >
                              <Send className="w-3.5 h-3.5" />
                              {sendingRfqId === rfq.id ? 'Sending...' : 'Send to Suppliers'}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => navigate(`/rfq-details/${rfq.id}`)}
                              className="text-xs py-1.5 px-3 flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View Details
                            </Button>
                          )}
                          {isDraft && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => navigate(`/rfq-details/${rfq.id}`)}
                              className="text-xs py-1.5 px-2.5"
                              title="View RFQ details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredRFQs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No RFQs found</p>
                <Button onClick={() => navigate('/create-rfq')} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First RFQ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RFQStatus
