import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  Brain,
  MessageSquare
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
  Line
} from 'recharts'

const ProcurementManagerDashboard = () => {
  const metrics = [
    { 
      title: 'Active RFQs', 
      value: '23', 
      change: '+5', 
      trend: 'up',
      icon: FileText,
      color: 'primary'
    },
    { 
      title: 'Suppliers Evaluated', 
      value: '156', 
      change: '+12', 
      trend: 'up',
      icon: Users,
      color: 'success'
    },
    { 
      title: 'Pending Negotiations', 
      value: '8', 
      change: '-2', 
      trend: 'down',
      icon: MessageSquare,
      color: 'warning'
    },
    { 
      title: 'Procurement Savings', 
      value: '$340K', 
      change: '+18%', 
      trend: 'up',
      icon: DollarSign,
      color: 'success'
    },
    { 
      title: 'High-Risk Suppliers', 
      value: '7', 
      change: '+1', 
      trend: 'up',
      icon: AlertTriangle,
      color: 'danger'
    },
    { 
      title: 'AI Recommendations Pending', 
      value: '15', 
      change: '+3', 
      trend: 'up',
      icon: Brain,
      color: 'accent'
    }
  ]

  const procurementTrends = [
    { month: 'Jul', spend: 180000, savings: 15000 },
    { month: 'Aug', spend: 220000, savings: 22000 },
    { month: 'Sep', spend: 195000, savings: 18000 },
    { month: 'Oct', spend: 280000, savings: 35000 },
    { month: 'Nov', spend: 245000, savings: 28000 },
    { month: 'Dec', spend: 310000, savings: 42000 },
  ]

  const upcomingMilestones = [
    { id: 1, supplier: 'TechCorp Industries', milestone: 'Q1 Delivery - Batch A', date: '2024-01-15', status: 'on_track' },
    { id: 2, supplier: 'IndustrialX Manufacturing', milestone: 'Raw Materials Shipment', date: '2024-01-18', status: 'at_risk' },
    { id: 3, supplier: 'AutoParts Premium', milestone: 'Components Delivery', date: '2024-01-20', status: 'on_track' },
    { id: 4, supplier: 'GlobalSupply Co.', milestone: 'Logistics Pickup', date: '2024-01-22', status: 'delayed' },
  ]

  const aiRecommendations = [
    { 
      id: 1,
      type: 'cost_saving',
      title: 'Switch to Alternative Supplier',
      description: 'Consider PrimeMfg for electronic components - estimated 15% cost reduction',
      impact: '$45,000',
      confidence: 92,
      status: 'pending_review'
    },
    { 
      id: 2,
      type: 'risk_mitigation',
      title: 'Diversify Supply Chain',
      description: 'Add backup supplier for IndustrialX to reduce dependency risk',
      impact: 'Medium',
      confidence: 88,
      status: 'pending_review'
    },
    { 
      id: 3,
      type: 'negotiation',
      title: 'Volume Discount Opportunity',
      description: 'Consolidate orders with TechCorp for 8% bulk discount',
      impact: '$28,000',
      confidence: 95,
      status: 'pending_review'
    },
  ]

  const getMetricIcon = (Icon, color) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600',
      success: 'bg-success-100 text-success-600',
      warning: 'bg-warning-100 text-warning-600',
      danger: 'bg-danger-100 text-danger-600',
      accent: 'bg-accent-100 text-accent-600',
    }
    return (
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    )
  }

  const getMilestoneBadge = (status) => {
    const variants = {
      on_track: 'success',
      at_risk: 'warning',
      delayed: 'danger',
    }
    const labels = {
      on_track: 'On Track',
      at_risk: 'At Risk',
      delayed: 'Delayed',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getRecommendationBadge = (status) => {
    const variants = {
      pending_review: 'warning',
      approved: 'success',
      rejected: 'danger',
    }
    const labels = {
      pending_review: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Procurement Manager Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your procurement operations and AI insights</p>
        </div>
        <Button>
          <Brain className="w-4 h-4 mr-2" />
          View All Recommendations
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-4">
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
              <div className="mt-3">
                <p className="text-xs text-gray-600">{metric.title}</p>
                <p className="text-xl font-bold text-navy-900 mt-1">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Procurement Spend vs Savings</CardTitle>
            <CardDescription>Monthly spending and savings over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={procurementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spend" fill="#3367d6" name="Spend" />
                <Bar dataKey="savings" fill="#22c55e" name="Savings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Trend</CardTitle>
            <CardDescription>Procurement savings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={procurementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="savings" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations Awaiting Review</CardTitle>
            <CardDescription>AI-powered suggestions for optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-accent-600" />
                      <h4 className="font-medium text-navy-900">{rec.title}</h4>
                    </div>
                    {getRecommendationBadge(rec.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Impact:</span>
                        <span className="font-medium ml-1">{rec.impact}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Confidence:</span>
                        <span className="font-medium ml-1">{rec.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="success" size="sm">Approve</Button>
                      <Button variant="danger" size="sm">Reject</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Delivery Milestones</CardTitle>
            <CardDescription>Key delivery dates and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Truck className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">{milestone.milestone}</p>
                      <p className="text-sm text-gray-600">{milestone.supplier}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-navy-900">{milestone.date}</p>
                    {getMilestoneBadge(milestone.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProcurementManagerDashboard
