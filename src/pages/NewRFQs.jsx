import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import RFQCard from '../components/shared/RFQCard'
import StatusBadge from '../components/shared/StatusBadge'
import { Search, FileText } from 'lucide-react'

const NewRFQs = () => {
  const navigate = useNavigate()
  const { rfqs, currentUser, viewRFQ } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')

  const supplierId = currentUser?.id || 'SUP-001'
  const myRFQs = rfqs.filter(rfq => rfq.sentTo?.includes(supplierId))
  const newRFQs = myRFQs.filter(rfq => !rfq.viewedBy?.includes(supplierId))

  const filteredRFQs = newRFQs.filter(rfq => {
    return rfq.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
           rfq.id.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleViewRFQ = (rfq) => {
    viewRFQ(rfq.id, supplierId)
    navigate(`/rfq-details/${rfq.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">New RFQs</h1>
        <p className="text-gray-600 mt-1">RFQs sent to you that haven't been viewed yet</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
            <p className="text-gray-600">No new RFQs found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default NewRFQs
