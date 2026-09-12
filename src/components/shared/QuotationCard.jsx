import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Eye, Calendar, DollarSign, Truck } from 'lucide-react'
import StatusBadge from './StatusBadge'

const QuotationCard = ({ quotation, onView, onSelect }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{quotation.supplierName}</CardTitle>
            <CardDescription>{quotation.rfqId}</CardDescription>
          </div>
          <StatusBadge status={quotation.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>Unit Price: ₹{quotation.unitPrice?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>Total: ₹{quotation.totalPrice?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Delivery: {quotation.deliveryTime} days</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Truck className="w-4 h-4" />
          <span>Available: {quotation.availableQuantity}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => onView(quotation)}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          {onSelect && quotation.status === 'submitted' && (
            <Button variant="primary" size="sm" onClick={() => onSelect(quotation)}>
              Select
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuotationCard
