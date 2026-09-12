import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Eye, FileText } from 'lucide-react'

const RevisedQuotations = () => {
  const navigate = useNavigate()
  const { quotations } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')

  const revisedQuotations = quotations.filter(q => 
    q.status === 'revised' || q.status === 'negotiation_sent' || q.status === 'under_review'
  )

  const filteredQuotations = revisedQuotations.filter(quotation => {
    const matchesSearch = !searchTerm || 
      (quotation.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       quotation.requirementName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       quotation.rfqId?.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const getStatusBadge = (status) => {
    const statusStyles = {
      'submitted': 'bg-blue-100 text-blue-700',
      'revised': 'bg-yellow-100 text-yellow-700',
      'viewed': 'bg-gray-100 text-gray-700',
      'under_review': 'bg-purple-100 text-purple-700',
      'negotiation_pending': 'bg-orange-100 text-orange-700',
      'negotiation_sent': 'bg-indigo-100 text-indigo-700',
      'supplier_viewed': 'bg-cyan-100 text-cyan-700',
      'accepted': 'bg-green-100 text-green-700',
      'declined': 'bg-red-100 text-red-700'
    }
    const style = statusStyles[status] || 'bg-gray-100 text-gray-700'
    return (
      <span className={`text-xs px-2 py-1 rounded ${style}`}>
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    )
  }

  const handleViewQuotation = (quotation) => {
    navigate(`/revised-quotation/${quotation.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Revised Quotations</h1>
        <p className="text-gray-600 mt-1">View and manage revised quotations from suppliers</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <FileText className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by RFQ ID, supplier, or component..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Revised Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Revised Quotations Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RFQ ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Component</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Previous Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Revised Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Revision Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{quotation.rfqId}</td>
                    <td className="px-4 py-4 text-sm text-black">{quotation.supplierName}</td>
                    <td className="px-4 py-4 text-sm text-black">{quotation.requirementName}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">₹{quotation.previousPrice}/unit</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">₹{quotation.unitPrice}/unit</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{quotation.deliveryTime} Days</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{quotation.revisionDate}</td>
                    <td className="px-4 py-4 text-sm">
                      {getStatusBadge(quotation.status)}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewQuotation(quotation)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No revised quotations found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RevisedQuotations
