import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Eye, Calendar, Package, DollarSign, Clock, AlertCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'

const RFQCard = ({ rfq, onView, onSelect }) => {
  if (!rfq) return null
  
  // Calculate time remaining for deadline
  const getTimeRemaining = (deadline) => {
    if (!deadline) return { text: 'No Deadline', status: 'default' }
    
    const deadlineDate = new Date(deadline)
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

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { label: 'No Deadline', variant: 'default' }
    
    const deadlineDate = new Date(deadline)
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

  const timeRemaining = getTimeRemaining(rfq.quotationDeadline)
  const deadlineStatus = getDeadlineStatus(rfq.quotationDeadline)
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{rfq.id || 'N/A'}</CardTitle>
            <CardDescription>{rfq.component || rfq.requirementName || 'N/A'}</CardDescription>
          </div>
          <StatusBadge status={rfq.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>Quantity: {rfq.quantity || rfq.requiredQuantity || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Delivery: {rfq.deliveryDeadline || rfq.requiredDeliveryDate || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>Budget: ₹{rfq.expectedBudget?.toLocaleString() || 'N/A'}</span>
        </div>
        
        {/* Quotation Deadline Section */}
        {rfq.quotationDeadline && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Clock className="w-4 h-4 text-primary-600" />
              <span className="font-medium">Quotation Deadline</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">{rfq.quotationDeadline}</span>
              <Badge variant={deadlineStatus.variant} className="text-xs">
                {deadlineStatus.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3" />
              <span className={`font-medium ${
                timeRemaining.status === 'danger' ? 'text-red-600' :
                timeRemaining.status === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {timeRemaining.text}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => onView(rfq)}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          {onSelect && rfq.status === 'quotation_submitted' && (
            <Button variant="primary" size="sm" onClick={() => onSelect(rfq)}>
              Select Supplier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RFQCard
