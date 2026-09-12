import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import DashboardStats from '../components/shared/DashboardStats'
import { CheckSquare, CheckCircle, X, DollarSign, TrendingUp, ArrowRight, FileText, Activity } from 'lucide-react'

const FinanceDashboard = () => {
  const navigate = useNavigate()
  const { approvals } = useWorkflow()

  const pendingApprovals = approvals.filter(a => a.status === 'pending_finance_approval')
  const approvedRequests = approvals.filter(a => a.status === 'approved')
  const rejectedRequests = approvals.filter(a => a.status === 'rejected')
  const totalApprovalValue = approvedRequests.reduce((sum, a) => sum + (a.totalPrice || 0), 0)
  const pendingValue = pendingApprovals.reduce((sum, a) => sum + (a.totalPrice || 0), 0)

  const stats = [
    {
      label: 'Pending Approvals',
      value: pendingApprovals.length,
      icon: CheckSquare,
      bgColor: 'bg-warning-100',
      iconColor: 'text-warning-600',
      valueColor: 'text-warning-600',
      onClick: () => navigate('/pending-approvals')
    },
    {
      label: 'Approved Requests',
      value: approvedRequests.length,
      icon: CheckCircle,
      bgColor: 'bg-success-100',
      iconColor: 'text-success-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/approved-requests')
    },
    {
      label: 'Rejected Requests',
      value: rejectedRequests.length,
      icon: X,
      bgColor: 'bg-danger-100',
      iconColor: 'text-danger-600',
      valueColor: 'text-danger-600',
      onClick: () => navigate('/rejected-requests')
    },
    {
      label: 'Total Approved Value',
      value: `₹${totalApprovalValue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/procurement-details')
    },
  ]

  const recentApprovals = approvals.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Finance Approver Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of procurement approvals and budget management</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-navy-900">Recent Approval Requests</h2>
            <button onClick={() => navigate('/approval-status')} className="text-sm text-primary-600 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentApprovals.length > 0 ? (
              recentApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate('/approval-status')}
                >
                  <div>
                    <p className="font-medium text-navy-900">{approval.component}</p>
                    <p className="text-sm text-gray-600">{approval.supplierName} • ₹{approval.totalPrice?.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    approval.status === 'pending_finance_approval' ? 'bg-warning-100 text-warning-700' :
                    approval.status === 'approved' ? 'bg-success-100 text-success-700' :
                    'bg-danger-100 text-danger-700'
                  }`}>
                    {approval.status === 'pending_finance_approval' ? 'Pending' :
                     approval.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No approval requests yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/pending-approvals')}
              className="w-full flex items-center gap-3 p-4 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors text-left"
            >
              <CheckSquare className="w-5 h-5 text-warning-600" />
              <div>
                <p className="font-medium text-navy-900">Pending Approvals</p>
                <p className="text-sm text-gray-600">{pendingApprovals.length} requests awaiting review</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/approved-requests')}
              className="w-full flex items-center gap-3 p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors text-left"
            >
              <CheckCircle className="w-5 h-5 text-success-600" />
              <div>
                <p className="font-medium text-navy-900">Approved Requests</p>
                <p className="text-sm text-gray-600">{approvedRequests.length} approved requests</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/rejected-requests')}
              className="w-full flex items-center gap-3 p-4 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors text-left"
            >
              <X className="w-5 h-5 text-danger-600" />
              <div>
                <p className="font-medium text-navy-900">Rejected Requests</p>
                <p className="text-sm text-gray-600">{rejectedRequests.length} rejected requests</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/procurement-details')}
              className="w-full flex items-center gap-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-navy-900">Procurement Details</p>
                <p className="text-sm text-gray-600">View detailed procurement information</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/approval-history')}
              className="w-full flex items-center gap-3 p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors text-left"
            >
              <Activity className="w-5 h-5 text-accent-600" />
              <div>
                <p className="font-medium text-navy-900">Approval History</p>
                <p className="text-sm text-gray-600">View all past approvals</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Budget Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Total Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{totalApprovalValue.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-warning-50 border border-warning-200 rounded">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="w-5 h-5 text-warning-600" />
              <span className="font-medium text-warning-900">Pending Approval</span>
            </div>
            <p className="text-2xl font-bold text-warning-600">₹{pendingValue.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-primary-50 border border-primary-200 rounded">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-primary-900">Total Requests</span>
            </div>
            <p className="text-2xl font-bold text-primary-600">{approvals.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinanceDashboard
