import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Eye, Calendar, Package, DollarSign, Clock, AlertCircle, Send, Users, ArrowRight } from 'lucide-react'
import StatusBadge from './StatusBadge'

const RFQCard = ({ rfq, onView, onSelect, onSend, isSending = false }) => {
  if (!rfq) return null
  
  const isDraft = ['draft', 'rfq_created'].includes(rfq.status?.toLowerCase())
  const supplierCount = rfq.suppliers?.length || rfq.supplierIds?.length || rfq.expectedSupplierCount || 0
  
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
      return { text: `${days}d ${hours}h left`, status: days <= 1 ? 'warning' : 'success' }
    }
    
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) {
      return { text: `${hours}h ${minutes}m left`, status: hours <= 2 ? 'danger' : 'warning' }
    }
    
    return { text: `${minutes}m left`, status: 'danger' }
  }

  const timeRemaining = getTimeRemaining(rfq.quotationDeadline || rfq.quotation_deadline)
  
  return (
    <Card
      className="border border-gray-200 hover:border-blue-400 transition-all hover:shadow-md bg-white cursor-pointer"
      onClick={() => onView && onView(rfq)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header Strip */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-gray-400 block">{rfq.id || 'N/A'}</span>
            <h3 className="font-bold text-sm text-navy-900 truncate">
              {rfq.component || rfq.requirementName || 'Automotive Component'}
            </h3>
          </div>
          <StatusBadge status={rfq.status} />
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-gray-50/90 rounded-lg border border-gray-100 text-center">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Quantity</span>
            <span className="text-xs font-bold text-navy-900">
              {Number(rfq.quantity || rfq.requiredQuantity || 1000).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Budget</span>
            <span className="text-xs font-bold text-emerald-700">
              ₹{rfq.expectedBudget ? Number(rfq.expectedBudget).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Suppliers</span>
            <span className="text-xs font-bold text-blue-700">
              {supplierCount > 0 ? `${supplierCount} invited` : 'Pending'}
            </span>
          </div>
        </div>

        {/* Deadline Indicator */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className={`text-[11px] font-semibold ${
              timeRemaining.status === 'danger' ? 'text-red-600' :
              timeRemaining.status === 'warning' ? 'text-amber-600' :
              'text-emerald-700'
            }`}>
              {timeRemaining.text}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onSend && isDraft && (
              <Button
                variant="primary"
                size="sm"
                disabled={isSending}
                onClick={(e) => {
                  e.stopPropagation()
                  onSend(rfq)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-2.5 font-semibold"
              >
                <Send className="w-3 h-3 mr-1" />
                {isSending ? 'Sending...' : 'Dispatch'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onView(rfq)
              }}
              className="text-gray-600 hover:text-navy-900 text-xs h-7 px-2"
            >
              View &rarr;
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RFQCard
