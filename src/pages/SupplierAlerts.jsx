import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Bell, FileText, MessageSquare, CheckCircle, Clock, AlertTriangle, ArrowRight, X } from 'lucide-react'

const SupplierAlerts = () => {
  const navigate = useNavigate()
  const { rfqs, negotiations, quotations, currentUser } = useWorkflow()
  
  const [dismissedAlerts, setDismissedAlerts] = useState([])

  const supplierId = currentUser?.id || 'SUP-001'
  const myRFQs = rfqs.filter(rfq => rfq.sentTo?.includes(supplierId))
  const newRFQs = myRFQs.filter(rfq => !rfq.viewedBy?.includes(supplierId))
  const myNegotiations = negotiations.filter(n => n.supplierId === supplierId)
  const activeNegotiations = myNegotiations.filter(n => n.status === 'negotiation_active' || n.status === 'counter_offer_received')
  const myQuotations = quotations.filter(q => q.supplierId === supplierId)
  const pendingQuotations = myQuotations.filter(q => q.status === 'submitted')
  const agreedDeals = myNegotiations.filter(n => n.dealStatus === 'agreed')

  // Generate alerts based on current state
  const alerts = [
    ...newRFQs.map(rfq => ({
      id: `rfq-${rfq.id}`,
      type: 'new_rfq',
      severity: 'high',
      title: 'New RFQ Received',
      message: `New RFQ for ${rfq.component} (${rfq.quantity} units) requires your attention`,
      timestamp: new Date().toISOString(),
      action: () => navigate(`/rfq-details/${rfq.id}`),
      icon: FileText,
      color: 'primary'
    })),
    ...activeNegotiations.map(neg => ({
      id: `neg-${neg.id}`,
      type: 'negotiation',
      severity: neg.status === 'counter_offer_received' ? 'high' : 'medium',
      title: neg.status === 'counter_offer_received' ? 'Counter Offer Received' : 'Negotiation Update',
      message: `${neg.status === 'counter_offer_received' ? 'Procurement manager has sent a counter offer' : 'Negotiation activity for ' + neg.component}`,
      timestamp: neg.lastUpdated,
      action: () => navigate(`/supplier-negotiations/${neg.id}`),
      icon: MessageSquare,
      color: neg.status === 'counter_offer_received' ? 'warning' : 'accent'
    })),
    ...pendingQuotations.map(quot => ({
      id: `quot-${quot.id}`,
      type: 'quotation',
      severity: 'medium',
      title: 'Quotation Pending Review',
      message: `Your quotation for ${quot.component} is under review`,
      timestamp: quot.submittedAt,
      action: () => navigate('/submitted-quotations'),
      icon: Clock,
      color: 'info'
    })),
    ...agreedDeals.map(deal => ({
      id: `deal-${deal.id}`,
      type: 'deal',
      severity: deal.financeStatus === 'approved' ? 'high' : 'medium',
      title: deal.financeStatus === 'approved' ? 'Deal Approved - Acknowledge Order' : 'Deal Agreed',
      message: deal.financeStatus === 'approved' 
        ? `Finance approved for ${deal.component}. Please acknowledge the order.`
        : `Negotiation for ${deal.component} has been agreed. Awaiting finance approval.`,
      timestamp: deal.lastUpdated,
      action: () => navigate('/final-decisions'),
      icon: CheckCircle,
      color: deal.financeStatus === 'approved' ? 'success' : 'accent'
    }))
  ].filter(alert => !dismissedAlerts.includes(alert.id))

  const getSeverityBadge = (severity) => {
    const variants = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'info'
    }
    return variants[severity] || 'default'
  }

  const getColorClass = (color) => {
    const colors = {
      'primary': 'bg-primary-50 border-primary-200',
      'warning': 'bg-warning-50 border-warning-200',
      'accent': 'bg-accent-50 border-accent-200',
      'info': 'bg-info-50 border-info-200',
      'success': 'bg-success-50 border-success-200',
      'danger': 'bg-danger-50 border-danger-200'
    }
    return colors[color] || 'bg-gray-50 border-gray-200'
  }

  const getIconColor = (color) => {
    const colors = {
      'primary': 'text-primary-600',
      'warning': 'text-warning-600',
      'accent': 'text-accent-600',
      'info': 'text-info-600',
      'success': 'text-success-600',
      'danger': 'text-danger-600'
    }
    return colors[color] || 'text-gray-600'
  }

  const handleDismiss = (alertId) => {
    setDismissedAlerts([...dismissedAlerts, alertId])
  }

  const handleDismissAll = () => {
    setDismissedAlerts(alerts.map(alert => alert.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Alerts</h1>
          <p className="text-gray-600 mt-1">Important notifications and action items</p>
        </div>
        {alerts.length > 0 && (
          <Button variant="secondary" onClick={handleDismissAll}>
            <X className="w-4 h-4 mr-2" />
            Dismiss All
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-600" />
            Active Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((alert) => {
                const Icon = alert.icon
                return (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg ${getColorClass(alert.color)} transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${getColorClass(alert.color)}`}>
                        <Icon className={`w-5 h-5 ${getIconColor(alert.color)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-navy-900">{alert.title}</h3>
                              <Badge variant={getSeverityBadge(alert.severity)}>
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{alert.message}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(alert.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <Button
                            size="sm"
                            onClick={alert.action}
                            className="flex items-center gap-2"
                          >
                            {alert.type === 'new_rfq' && 'View RFQ'}
                            {alert.type === 'negotiation' && 'View Negotiation'}
                            {alert.type === 'quotation' && 'View Quotations'}
                            {alert.type === 'deal' && 'View Decision'}
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600">No active alerts</p>
              <p className="text-sm text-gray-500 mt-2">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dismissed Alerts */}
      {dismissedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dismissed Alerts ({dismissedAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDismissedAlerts([])}
            >
              Restore All
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SupplierAlerts
