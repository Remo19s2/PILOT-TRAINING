import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import DashboardStats from '../components/shared/DashboardStats'
import { Button } from '../components/ui/Button'
import { FileText, Send, CheckCircle, Clock, DollarSign, Eye, ArrowRight, MessageSquare, Bell, AlertTriangle } from 'lucide-react'

const SupplierDashboard = () => {
  const navigate = useNavigate()
  const { rfqs, quotations, negotiations, currentUser } = useWorkflow()

  // Filter RFQs sent to this supplier (mock: assuming current supplier is SUP-001)
  const supplierId = currentUser?.id || 'SUP-001'
  const myRFQs = rfqs.filter(rfq => rfq.sentTo?.includes(supplierId))
  const newRFQs = myRFQs.filter(rfq => !rfq.viewedBy?.includes(supplierId))
  const viewedRFQs = myRFQs.filter(rfq => rfq.viewedBy?.includes(supplierId))
  const myQuotations = quotations.filter(q => q.supplierId === supplierId)
  const pendingQuotations = myQuotations.filter(q => q.status === 'submitted')
  const myNegotiations = negotiations.filter(n => n.supplierId === supplierId)
  const activeNegotiations = myNegotiations.filter(n => n.status === 'negotiation_active' || n.status === 'counter_offer_received')
  const agreedDeals = myNegotiations.filter(n => n.dealStatus === 'agreed')

  const stats = [
    {
      label: 'Received RFQs',
      value: myRFQs.length,
      icon: FileText,
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/new-rfqs')
    },
    {
      label: 'My Quotations',
      value: myQuotations.length,
      icon: Send,
      bgColor: 'bg-info-100',
      iconColor: 'text-info-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/submitted-quotations')
    },
    {
      label: 'Active Negotiations',
      value: activeNegotiations.length,
      icon: MessageSquare,
      bgColor: 'bg-warning-100',
      iconColor: 'text-warning-600',
      valueColor: 'text-warning-600',
      onClick: () => navigate('/supplier-negotiations')
    },
    {
      label: 'Final Decisions',
      value: agreedDeals.length,
      icon: CheckCircle,
      bgColor: 'bg-success-100',
      iconColor: 'text-success-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/final-decisions')
    },
  ]

  const recentRFQs = myRFQs.slice(0, 5)
  const recentNegotiations = myNegotiations.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Supplier Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of RFQs, quotations, negotiations, and final decisions</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-navy-900">Recent RFQs</h2>
            <Button variant="secondary" size="sm" onClick={() => navigate('/new-rfqs')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentRFQs.length > 0 ? (
              recentRFQs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/rfq-details/${rfq.id}`)}
                >
                  <div>
                    <p className="font-medium text-navy-900">{rfq.component}</p>
                    <p className="text-sm text-gray-600">{rfq.id} • Qty: {rfq.quantity}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    rfq.viewedBy?.includes(supplierId) ? 'bg-success-100 text-success-700' : 'bg-primary-100 text-primary-700'
                  }`}>
                    {rfq.viewedBy?.includes(supplierId) ? 'Viewed' : 'New'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No RFQs received yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-navy-900">Active Negotiations</h2>
            <Button variant="secondary" size="sm" onClick={() => navigate('/supplier-negotiations')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentNegotiations.length > 0 ? (
              recentNegotiations.map((neg) => (
                <div
                  key={neg.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/negotiation-center/${neg.id}`)}
                >
                  <div>
                    <p className="font-medium text-navy-900">{neg.component}</p>
                    <p className="text-sm text-gray-600">{neg.rfqId} • Current: ₹{neg.currentOffer}/unit</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    neg.status === 'counter_offer_received' ? 'bg-warning-100 text-warning-700' : 'bg-primary-100 text-primary-700'
                  }`}>
                    {neg.status === 'counter_offer_received' ? 'Counter Offer' : 'Active'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active negotiations</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/new-rfqs')}
            className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium text-navy-900">View RFQs</p>
              <p className="text-xs text-gray-600">Received requests</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/submitted-quotations')}
            className="flex items-center gap-3 p-4 bg-info-50 rounded-lg hover:bg-info-100 transition-colors text-left"
          >
            <Send className="w-5 h-5 text-info-600" />
            <div>
              <p className="font-medium text-navy-900">My Quotations</p>
              <p className="text-xs text-gray-600">Submitted quotes</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/supplier-negotiations')}
            className="flex items-center gap-3 p-4 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors text-left"
          >
            <MessageSquare className="w-5 h-5 text-warning-600" />
            <div>
              <p className="font-medium text-navy-900">Negotiations</p>
              <p className="text-xs text-gray-600">Active discussions</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/final-decisions')}
            className="flex items-center gap-3 p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors text-left"
          >
            <CheckCircle className="w-5 h-5 text-success-600" />
            <div>
              <p className="font-medium text-navy-900">Final Decisions</p>
              <p className="text-xs text-gray-600">Order confirmations</p>
            </div>
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-warning-600" />
            Alerts
          </h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/supplier-alerts')}>
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {newRFQs.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
              <FileText className="w-5 h-5 text-primary-600" />
              <div className="flex-1">
                <p className="font-medium text-navy-900">{newRFQs.length} New RFQ{newRFQs.length > 1 ? 's' : ''} Received</p>
                <p className="text-sm text-gray-600">Review and submit quotations</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          )}
          {activeNegotiations.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-warning-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-warning-600" />
              <div className="flex-1">
                <p className="font-medium text-navy-900">{activeNegotiations.length} Active Negotiation{activeNegotiations.length > 1 ? 's' : ''}</p>
                <p className="text-sm text-gray-600">Respond to procurement offers</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          )}
          {agreedDeals.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-success-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <div className="flex-1">
                <p className="font-medium text-navy-900">{agreedDeals.length} Deal{agreedDeals.length > 1 ? 's' : ''} Agreed</p>
                <p className="text-sm text-gray-600">Awaiting final decision</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          )}
          {newRFQs.length === 0 && activeNegotiations.length === 0 && agreedDeals.length === 0 && (
            <p className="text-gray-500 text-center py-4">No alerts at this time</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupplierDashboard
