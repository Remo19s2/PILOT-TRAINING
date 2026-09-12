import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import DashboardStats from '../components/shared/DashboardStats'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { ClipboardList, FileText, Send, DollarSign, AlertTriangle, CheckSquare, TrendingUp, RefreshCw, MessageSquare, CheckCircle, XCircle, Package, Bell, Brain, Truck, ArrowRight } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const ProcurementDashboard = () => {
  const navigate = useNavigate()
  const { requirements, rfqs, quotations, negotiations, approvals } = useWorkflow()

  const newRequirements = requirements.filter(r => r.status === 'new')
  const activeRFQs = rfqs.filter(r => r.status === 'rfq_sent' || r.status === 'rfq_viewed')
  const quotationsReceived = quotations.filter(q => q.status === 'submitted')
  const activeNegotiations = negotiations.filter(n => n.status === 'negotiation_active' || n.status === 'counter_offer_received')
  const agreedDeals = negotiations.filter(n => n.dealStatus === 'agreed')
  const pendingApprovals = approvals.filter(a => a.status === 'pending_finance_approval')
  const approvedOrders = approvals.filter(a => a.status === 'approved')

  const stats = [
    {
      label: 'New Requirements',
      value: newRequirements.length,
      icon: Package,
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/planning-insights')
    },
    {
      label: 'Active RFQs',
      value: activeRFQs.length,
      icon: FileText,
      bgColor: 'bg-info-100',
      iconColor: 'text-info-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/rfqs')
    },
    {
      label: 'Quotations Received',
      value: quotationsReceived.length,
      icon: Send,
      bgColor: 'bg-success-100',
      iconColor: 'text-success-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/rfqs')
    },
    {
      label: 'Active Negotiations',
      value: activeNegotiations.length,
      icon: MessageSquare,
      bgColor: 'bg-warning-100',
      iconColor: 'text-warning-600',
      valueColor: 'text-warning-600',
      onClick: () => navigate('/negotiation-center')
    },
    {
      label: 'Agreed Deals',
      value: agreedDeals.length,
      icon: CheckCircle,
      bgColor: 'bg-accent-100',
      iconColor: 'text-accent-600',
      valueColor: 'text-navy-900',
      onClick: () => navigate('/negotiation-center')
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovals.length,
      icon: CheckSquare,
      bgColor: 'bg-danger-100',
      iconColor: 'text-danger-600',
      valueColor: 'text-danger-600',
      onClick: () => navigate('/approval-status')
    },
    {
      label: 'Approved Orders',
      value: approvedOrders.length,
      icon: Truck,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600',
      onClick: () => navigate('/purchase-orders')
    },
    {
      label: 'Active Alerts',
      value: 3,
      icon: Bell,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-600',
      onClick: () => navigate('/monitoring-alerts')
    },
  ]

  const recentRequirements = requirements.slice(0, 5)

  // Prepare data for charts
  const categoryData = requirements.reduce((acc, req) => {
    acc[req.componentCategory] = (acc[req.componentCategory] || 0) + 1
    return acc
  }, {})

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  const priorityData = requirements.reduce((acc, req) => {
    acc[req.priority] = (acc[req.priority] || 0) + 1
    return acc
  }, {})

  const priorityChartData = Object.entries(priorityData).map(([name, value]) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value 
  }))

  const statusData = requirements.reduce((acc, req) => {
    const statusLabel = req.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    acc[statusLabel] = (acc[statusLabel] || 0) + 1
    return acc
  }, {})

  const statusChartData = Object.entries(statusData).map(([name, value]) => ({ name, value }))

  const monthlyData = [
    { month: 'Jan', rfqs: 12, quotations: 8, approvals: 10 },
    { month: 'Feb', rfqs: 15, quotations: 12, approvals: 14 },
    { month: 'Mar', rfqs: 18, quotations: 15, approvals: 16 },
    { month: 'Apr', rfqs: 22, quotations: 18, approvals: 20 },
    { month: 'May', rfqs: 25, quotations: 20, approvals: 22 },
    { month: 'Jun', rfqs: 28, quotations: 24, approvals: 26 }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Procurement Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">Complete overview of end-to-end procurement workflow</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requirements by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Procurement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rfqs" stroke="#3B82F6" name="RFQs" />
                <Line type="monotone" dataKey="quotations" stroke="#10B981" name="Quotations" />
                <Line type="monotone" dataKey="approvals" stroke="#F59E0B" name="Approvals" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/planning-insights')}
              className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left"
            >
              <Package className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-navy-900">Planning & Inventory</p>
                <p className="text-xs text-gray-600">Review requirements</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/create-rfq')}
              className="flex items-center gap-3 p-4 bg-info-50 rounded-lg hover:bg-info-100 transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-info-600" />
              <div>
                <p className="font-medium text-navy-900">Create RFQ</p>
                <p className="text-xs text-gray-600">Send to suppliers</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/negotiation-center')}
              className="flex items-center gap-3 p-4 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors text-left"
            >
              <MessageSquare className="w-5 h-5 text-warning-600" />
              <div>
                <p className="font-medium text-navy-900">Negotiation Center</p>
                <p className="text-xs text-gray-600">Manage negotiations</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/approval-status')}
              className="flex items-center gap-3 p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors text-left"
            >
              <CheckSquare className="w-5 h-5 text-success-600" />
              <div>
                <p className="font-medium text-navy-900">Finance Approvals</p>
                <p className="text-xs text-gray-600">Review approvals</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/risk-recommendations')}
              className="flex items-center gap-3 p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors text-left"
            >
              <Brain className="w-5 h-5 text-accent-600" />
              <div>
                <p className="font-medium text-navy-900">Recommendations</p>
                <p className="text-xs text-gray-600">Risk response</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/monitoring-alerts')}
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
            >
              <Bell className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-navy-900">Monitoring & Alerts</p>
                <p className="text-xs text-gray-600">View alerts</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/purchase-orders')}
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <Truck className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-navy-900">Orders</p>
                <p className="text-xs text-gray-600">View orders</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-navy-900">Reports</p>
                <p className="text-xs text-gray-600">View analytics</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProcurementDashboard
