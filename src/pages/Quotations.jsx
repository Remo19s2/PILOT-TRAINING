import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import QuotationCard from '../components/shared/QuotationCard'
import StatusBadge from '../components/shared/StatusBadge'
import { Search, FileText, ArrowRight } from 'lucide-react'

const Quotations = () => {
  const navigate = useNavigate()
  const { quotations, rfqs } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.rfqId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewQuotation = (quotation) => {
    navigate(`/quotation-details/${quotation.id}`)
  }

  const handleSelectSupplier = (quotation) => {
    navigate(`/compare-quotations/${quotation.rfqId}`)
  }

  const handleCompareQuotations = (rfqId) => {
    navigate(`/compare-quotations/${rfqId}`)
  }

  // Group quotations by RFQ
  const quotationsByRFQ = filteredQuotations.reduce((acc, quotation) => {
    if (!acc[quotation.rfqId]) {
      acc[quotation.rfqId] = []
    }
    acc[quotation.rfqId].push(quotation)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Quotations</h1>
        <p className="text-gray-600 mt-1">Review and compare supplier quotations</p>
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
                <option value="submitted">Submitted</option>
                <option value="selected">Selected</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotations grouped by RFQ */}
      {Object.keys(quotationsByRFQ).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(quotationsByRFQ).map(([rfqId, rfqQuotations]) => (
            <div key={rfqId}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-navy-900">{rfqId}</h2>
                {rfqQuotations.length > 1 && (
                  <Button variant="secondary" onClick={() => handleCompareQuotations(rfqId)}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Compare All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rfqQuotations.map((quotation) => (
                  <QuotationCard
                    key={quotation.id}
                    quotation={quotation}
                    onView={handleViewQuotation}
                    onSelect={quotation.status === 'submitted' ? handleSelectSupplier : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No quotations received yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Quotations
