import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Brain
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const FinanceApproverDashboard = () => {
  const metrics = [
    { 
      title: 'Pending Approvals', 
      value: '8', 
      change: '+2', 
      trend: 'up',
      icon: Clock,
      color: 'warning'
    },
    { 
      title: 'Approved Today', 
      value: '12', 
      change: '+4', 
      trend: 'up',
      icon: CheckCircle,
      color: 'success'
    },
    { 
      title: 'Total Value Pending', 
      value: '$1.2M', 
      change: '+15%', 
      trend: 'up',
      icon: DollarSign,
      color: 'primary'
    },
    { 
      title: 'Rejected This Week', 
      value: '3', 
      change: '-1', 
      trend: 'down',
      icon: XCircle,
      color: 'danger'
    },
  ]

  const approvalTrends = [
    { month: 'Jul', approved: 45, rejected: 5, pending: 12 },
    { month: 'Aug', approved: 52, rejected: 3, pending: 15 },
    { month: 'Sep', approved: 48, rejected: 7, pending: 10 },
    { month: 'Oct', approved: 55, rejected: 4, pending: 18 },
    { month: 'Nov', approved: 60, rejected: 6, pending: 14 },
    { month: 'Dec', approved: 58, rejected: 5, pending: 16 },
  ]

  const categoryBreakdown = [
    { name: 'Raw Materials', value: 450000, color: '#3367d6' },
    { name: 'Services', value: 320000, color: '#22c55e' },
    { name: 'Equipment', value: 280000, color: '#f59e0b' },
    { name: 'Components', value: 150000, color: '#8b5cf6' },
  ]

  const pendingApprovals = [
    { 
      id: 'PO-4522',
      type: 'Purchase Order',
      supplier: 'TechCorp Industries',
      amount: 125000,
      budget: 150000,
      requester: 'Sarah Johnson',
      department: 'Engineering',
      submitted: '2024-01-10',
      priority: 'high',
      aiRecommendation: 'approve',
      aiConfidence: 94,
      aiExplanation: 'Within budget, supplier performance excellent (92%), historical delivery reliability 95%'
    },
    { 
      id: 'CT-2024-089',
      type: 'Contract',
      supplier: 'GlobalSupply Co.',
      amount: 250000,
      budget: 200000,
      requester: 'Michael Chen',
      department: 'Operations',
      submitted: '2024-01-09',
      priority: 'medium',
      aiRecommendation: 'review',
      aiConfidence: 78,
      aiExplanation: '25% over budget, consider negotiation for better terms. Supplier risk score: 72 (medium)'
    },
    { 
      id: 'PO-4523',
      type: 'Purchase Order',
      supplier: 'IndustrialX Manufacturing',
      amount: 45000,
      budget: 50000,
      requester: 'Emily Davis',
      department: 'Production',
      submitted: '2024-01-08',
      priority: 'low',
      aiRecommendation: 'approve',
      aiConfidence: 89,
      aiExplanation: 'Within budget, competitive pricing, supplier meets quality standards'
    },
  ]

  const approvalHistory = [
    { id: 'PO-4520', type: 'Purchase Order', supplier: 'TechCorp', amount: '$156,000', action: 'Approved', date: '2024-01-05' },
    { id: 'CT-2024-088', type: 'Contract', supplier: 'PrimeMfg', amount: '$89,000', action: 'Rejected', date: '2024-01-04' },
    { id: 'PO-4519', type: 'Purchase Order', supplier: 'AutoParts', amount: '$234,000', action: 'Approved', date: '2024-01-03' },
  ]

  const getMetricIcon = (Icon, color) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600',
      success: 'bg-success-100 text-success-600',
      warning: 'bg-warning-100 text-warning-600',
      danger: 'bg-danger-100 text-danger-600',
    }
    return (
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    )
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success',
    }
    return <Badge variant={variants[priority]}>{priority}</Badge>
  }

  const getRecommendationBadge = (recommendation) => {
    const variants = {
      approve: 'success',
      review: 'warning',
      reject: 'danger',
    }
    const labels = {
      approve: 'AI: Approve',
      review: 'AI: Review',
      reject: 'AI: Reject',
    }
    return <Badge variant={variants[recommendation]}>{labels[recommendation]}</Badge>
  }

  const getActionBadge = (action) => {
    const variants = {
      Approved: 'success',
      Rejected: 'danger',
      Returned: 'warning',
    }
    return <Badge variant={variants[action]}>{action}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Finance Approver Dashboard</h1>
          <p className="text-gray-600 mt-1">Review and approve procurement requests with AI-powered insights</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          View All Requests
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {getMetricIcon(metric.icon, metric.color)}
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-navy-900 mt-1">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval Trends</CardTitle>
            <CardDescription>Monthly approval, rejection, and pending requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={approvalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="approved" fill="#22c55e" name="Approved" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Value by Category</CardTitle>
            <CardDescription>Distribution of pending approval amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium ml-auto">${(item.value / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Requests awaiting your financial review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-navy-900">{approval.id}</h4>
                        <Badge variant="default">{approval.type}</Badge>
                        {getPriorityBadge(approval.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{approval.supplier}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Requester: {approval.requester}</span>
                        <span>Department: {approval.department}</span>
                        <span>Submitted: {approval.submitted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-navy-900">${approval.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Budget: ${approval.budget.toLocaleString()}</p>
                    <div className="mt-2">
                      {approval.amount <= approval.budget ? (
                        <Badge variant="success">Within Budget</Badge>
                      ) : (
                        <Badge variant="danger">Over Budget by ${((approval.amount - approval.budget) / approval.budget * 100).toFixed(0)}%</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Section */}
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-accent-600" />
                    <span className="font-medium text-accent-900">AI Recommendation</span>
                    {getRecommendationBadge(approval.aiRecommendation)}
                    <span className="text-sm text-accent-700 ml-auto">Confidence: {approval.aiConfidence}%</span>
                  </div>
                  <p className="text-sm text-accent-800">{approval.aiExplanation}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      Return for Modification
                    </Button>
                    <Button variant="danger" size="sm">
                      Reject
                    </Button>
                    <Button variant="success" size="sm">
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Approval History</CardTitle>
          <CardDescription>Your recent approval decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {approvalHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-navy-900">{item.id}</p>
                    <p className="text-sm text-gray-600">{item.type} - {item.supplier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-navy-900">{item.amount}</span>
                  {getActionBadge(item.action)}
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FinanceApproverDashboard
