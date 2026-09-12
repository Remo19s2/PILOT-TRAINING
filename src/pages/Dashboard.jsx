import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
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

const Dashboard = () => {
  const metrics = [
    { 
      title: 'Total Spend', 
      value: '$2.4M', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'primary'
    },
    { 
      title: 'Active Suppliers', 
      value: '156', 
      change: '+8', 
      trend: 'up',
      icon: Users,
      color: 'success'
    },
    { 
      title: 'Pending RFQs', 
      value: '23', 
      change: '-5', 
      trend: 'down',
      icon: Clock,
      color: 'warning'
    },
    { 
      title: 'High Risk Suppliers', 
      value: '7', 
      change: '+2', 
      trend: 'up',
      icon: AlertTriangle,
      color: 'danger'
    }
  ]

  const spendData = [
    { month: 'Jan', spend: 180000 },
    { month: 'Feb', spend: 220000 },
    { month: 'Mar', spend: 195000 },
    { month: 'Apr', spend: 280000 },
    { month: 'May', spend: 245000 },
    { month: 'Jun', spend: 310000 },
  ]

  const supplierPerformance = [
    { name: 'TechCorp', score: 92 },
    { name: 'AutoParts', score: 88 },
    { name: 'IndustrialX', score: 85 },
    { name: 'GlobalSupply', score: 78 },
    { name: 'PrimeMfg', score: 72 },
  ]

  const categoryData = [
    { name: 'Raw Materials', value: 35, color: '#3367d6' },
    { name: 'Components', value: 28, color: '#22c55e' },
    { name: 'Services', value: 20, color: '#f59e0b' },
    { name: 'Equipment', value: 17, color: '#8b5cf6' },
  ]

  const recentActivities = [
    { 
      id: 1,
      type: 'approval',
      title: 'PO #4521 Approved',
      description: 'Purchase order for TechCorp - $125,000',
      time: '2 hours ago',
      status: 'completed'
    },
    { 
      id: 2,
      type: 'risk',
      title: 'Risk Alert: IndustrialX',
      description: 'Financial health score dropped below threshold',
      time: '4 hours ago',
      status: 'warning'
    },
    { 
      id: 3,
      type: 'rfq',
      title: 'RFQ #789 Created',
      description: 'New request for electronic components',
      time: '6 hours ago',
      status: 'pending'
    },
    { 
      id: 4,
      type: 'delivery',
      title: 'Shipment Delivered',
      description: 'Order #3321 from AutoParts received',
      time: '1 day ago',
      status: 'completed'
    },
  ]

  const pendingApprovals = [
    { id: 1, type: 'PO', number: 'PO-4522', supplier: 'GlobalSupply', amount: '$89,500', priority: 'high' },
    { id: 2, type: 'Contract', number: 'CT-2024-089', supplier: 'TechCorp', amount: '$250,000', priority: 'medium' },
    { id: 3, type: 'PO', number: 'PO-4523', supplier: 'PrimeMfg', amount: '$45,200', priority: 'low' },
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

  const getActivityIcon = (type) => {
    const icons = {
      approval: <CheckCircle className="w-5 h-5 text-success-600" />,
      risk: <AlertTriangle className="w-5 h-5 text-danger-600" />,
      rfq: <Clock className="w-5 h-5 text-warning-600" />,
      delivery: <CheckCircle className="w-5 h-5 text-success-600" />,
    }
    return icons[type] || <Clock className="w-5 h-5 text-gray-600" />
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success',
    }
    return <Badge variant={variants[priority]}>{priority}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your procurement.</p>
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
            <CardTitle>Monthly Spend</CardTitle>
            <CardDescription>Procurement spending over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spend" fill="#3367d6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance</CardTitle>
            <CardDescription>Top 5 suppliers by performance score</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={supplierPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>Distribution across procurement categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">{item.type}</span>
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">{item.number}</p>
                      <p className="text-sm text-gray-600">{item.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-navy-900">{item.amount}</span>
                    {getPriorityBadge(item.priority)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across your procurement operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {getActivityIcon(activity.type)}
                  <div className="w-0.5 h-full bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-navy-900">{activity.title}</h4>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
