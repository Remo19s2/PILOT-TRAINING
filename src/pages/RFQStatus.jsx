import { useState } from 'react'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Send, CheckCircle, Eye, Package } from 'lucide-react'

const RFQStatus = () => {
  const { rfqs } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = !searchTerm || 
      (rfq.requirementName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       rfq.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       rfq.id?.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const getRFQStatusBadge = (rfq) => {
    if (rfq.status === 'sent' && rfq.openedDate) {
      return (
        <div className="flex items-center gap-1 text-xs text-success-600 bg-success-50 px-2 py-1 rounded">
          <Eye className="w-3 h-3" />
          Opened
        </div>
      )
    } else if (rfq.status === 'sent' && rfq.receivedDate) {
      return (
        <div className="flex items-center gap-1 text-xs text-info-600 bg-info-50 px-2 py-1 rounded">
          <CheckCircle className="w-3 h-3" />
          Received
        </div>
      )
    } else if (rfq.status === 'sent') {
      return (
        <div className="flex items-center gap-1 text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
          <Send className="w-3 h-3" />
          Sent
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
        {rfq.status}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">RFQ Status Tracking</h1>
        <p className="text-gray-600 mt-1">Track the status of RFQs sent to suppliers</p>
      </div>

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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Req ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sent Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Received Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Opened Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRFQs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{rfq.id}</td>
                    <td className="px-4 py-4 text-sm text-black">{rfq.requirementName}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{rfq.requirementId}</td>
                    <td className="px-4 py-4 text-sm text-black">{rfq.supplierName}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{rfq.supplierId}</td>
                    <td className="px-4 py-4 text-sm">
                      {getRFQStatusBadge(rfq)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{rfq.sentDate}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{rfq.receivedDate || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{rfq.openedDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRFQs.length === 0 && (
              <div className="text-center py-12">
                <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No RFQs found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RFQStatus
