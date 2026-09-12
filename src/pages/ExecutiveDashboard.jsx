import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Search, Filter, Calendar, MapPin, AlertTriangle, Brain, TrendingUp, TrendingDown, DollarSign, Package, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, FileText, Users, Truck, BarChart3, ClipboardList } from 'lucide-react'
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
  Cell,
  AreaChart,
  Area
} from 'recharts'

const ExecutiveDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: 'last6months',
    supplier: 'all',
    location: 'all',
    category: 'all',
    riskLevel: 'all'
  })

  const kpiData = [
    { 
      title: 'Active Procurement Requirements', 
      value: '12', 
      change: '+3', 
      trend: 'up',
      icon: ClipboardList,
      color: 'primary'
    },
    { 
      title: 'Active RFQs', 
      value: '47', 
      change: '+8', 
      trend: 'up',
      icon: FileText,
      color: 'primary'
    },
    { 
      title: 'Pending Quotations', 
      value: '23', 
      change: '+5', 
      trend: 'up',
      icon: FileText,
      color: 'warning'
    },
    { 
      title: 'High Risk Suppliers', 
      value: '7', 
      change: '+1', 
      trend: 'up',
      icon: AlertTriangle,
      color: 'danger'
    },
    { 
      title: 'Critical Inventory Alerts', 
      value: '3', 
      change: '+2', 
      trend: 'up',
      icon: Package,
      color: 'danger'
    },
    { 
      title: 'Pending Approvals', 
      value: '15', 
      change: '-5', 
      trend: 'down',
      icon: Clock,
      color: 'warning'
    },
    { 
      title: 'Active Purchase Orders', 
      value: '89', 
      change: '+6', 
      trend: 'up',
      icon: Package,
      color: 'primary'
    },
  ]

  const supplierPerformanceTrends = [
    { month: 'Jul', techCorp: 92, industrialX: 78, autoParts: 88, globalSupply: 72 },
    { month: 'Aug', techCorp: 94, industrialX: 80, autoParts: 85, globalSupply: 75 },
    { month: 'Sep', techCorp: 91, industrialX: 82, autoParts: 90, globalSupply: 70 },
    { month: 'Oct', techCorp: 93, industrialX: 79, autoParts: 87, globalSupply: 73 },
    { month: 'Nov', techCorp: 95, industrialX: 81, autoParts: 89, globalSupply: 71 },
    { month: 'Dec', techCorp: 96, industrialX: 83, autoParts: 91, globalSupply: 74 },
  ]

  const procurementSpending = [
    { month: 'Jul', rawMaterials: 180000, components: 120000, services: 80000, equipment: 50000 },
    { month: 'Aug', rawMaterials: 220000, components: 140000, services: 90000, equipment: 60000 },
    { month: 'Sep', rawMaterials: 195000, components: 130000, services: 85000, equipment: 55000 },
    { month: 'Oct', rawMaterials: 280000, components: 160000, services: 100000, equipment: 70000 },
    { month: 'Nov', rawMaterials: 245000, components: 150000, services: 95000, equipment: 65000 },
    { month: 'Dec', rawMaterials: 310000, components: 170000, services: 110000, equipment: 80000 },
  ]

  const riskDistribution = [
    { name: 'Low Risk', value: 126, color: '#22c55e' },
    { name: 'Medium Risk', value: 23, color: '#f59e0b' },
    { name: 'High Risk', value: 7, color: '#ef4444' },
  ]

  const deliveryPerformance = [
    { month: 'Jul', onTime: 95, delayed: 5 },
    { month: 'Aug', onTime: 92, delayed: 8 },
    { month: 'Sep', onTime: 94, delayed: 6 },
    { month: 'Oct', onTime: 90, delayed: 10 },
    { month: 'Nov', onTime: 93, delayed: 7 },
    { month: 'Dec', onTime: 96, delayed: 4 },
  ]

  const inventoryStatus = [
    { category: 'Raw Materials', available: 85, required: 100, status: 'adequate' },
    { category: 'Components', available: 45, required: 80, status: 'critical' },
    { category: 'Packaging', available: 120, required: 100, status: 'excess' },
    { category: 'Finished Goods', available: 70, required: 90, status: 'low' },
  ]

  const predictedVsActual = [
    { month: 'Jul', predicted: 180000, actual: 175000 },
    { month: 'Aug', predicted: 200000, actual: 220000 },
    { month: 'Sep', predicted: 190000, actual: 195000 },
    { month: 'Oct', predicted: 250000, actual: 280000 },
    { month: 'Nov', predicted: 230000, actual: 245000 },
    { month: 'Dec', predicted: 280000, actual: 310000 },
  ]

  const criticalAlerts = [
    { id: 1, type: 'critical', title: 'Inventory Shortage Predicted', description: 'Steel Sheets inventory will reach critical levels in 5 days. Current: 450 kg, Minimum: 500 kg', time: '2 hours ago' },
    { id: 2, type: 'critical', title: 'Supplier Delivery Delay', description: 'IndustrialX Manufacturing reported 5-day delay for PO-2024-0045 due to capacity constraints', time: '4 hours ago' },
    { id: 3, type: 'warning', title: 'High Supplier Risk', description: 'GlobalSupply Co. risk score increased to 85 due to financial concerns', time: '6 hours ago' },
    { id: 4, type: 'critical', title: 'Missed Delivery Milestone', description: 'TechCorp Industries missed Q1 delivery milestone for Batch A - 2 days late', time: '8 hours ago' },
  ]

  const aiIntelligence = {
    recommendation: 'Split steel sheets order between IndustrialX (60%) and PrimeMfg (40%)',
    riskLevel: 'medium',
    recommendedAction: 'Approve split order strategy to balance cost, delivery, and risk',
    confidence: 92,
    explanation: 'This approach reduces dependency on a single supplier while meeting the critical 22-day timeline. Expected 15% cost savings compared to single-source procurement.',
  }

  const aiRecommendations = [
    { id: 1, type: 'cost', title: 'Consolidate Orders with TechCorp', impact: '$45,000', confidence: 94 },
    { id: 2, type: 'risk', title: 'Diversify from IndustrialX', impact: 'Medium', confidence: 88 },
    { id: 3, type: 'efficiency', title: 'Optimize Delivery Routes', impact: '$28,000', confidence: 91 },
  ]

  const upcomingMilestones = [
    { id: 1, supplier: 'TechCorp', milestone: 'Q1 Delivery - Batch A', date: '2024-01-15', status: 'on_track' },
    { id: 2, supplier: 'AutoParts', milestone: 'Components Delivery', date: '2024-01-18', status: 'at_risk' },
    { id: 3, supplier: 'PrimeMfg', milestone: 'Equipment Installation', date: '2024-01-22', status: 'on_track' },
  ]

  const pendingApprovals = [
    { id: 'PO-4522', supplier: 'TechCorp', amount: '$125,000', priority: 'high' },
    { id: 'CT-2024-089', supplier: 'GlobalSupply', amount: '$250,000', priority: 'medium' },
    { id: 'PO-4523', supplier: 'IndustrialX', amount: '$45,200', priority: 'low' },
  ]

  const supplierPerformanceOverview = [
    { name: 'TechCorp Industries', overallScore: 96, deliveryScore: 98, qualityScore: 95, riskLevel: 'low' },
    { name: 'AutoParts Premium', overallScore: 91, deliveryScore: 94, qualityScore: 92, riskLevel: 'low' },
    { name: 'PrimeMfg Solutions', overallScore: 89, deliveryScore: 92, qualityScore: 88, riskLevel: 'low' },
    { name: 'IndustrialX Manufacturing', overallScore: 78, deliveryScore: 82, qualityScore: 80, riskLevel: 'high' },
    { name: 'GlobalSupply Co.', overallScore: 72, deliveryScore: 75, qualityScore: 70, riskLevel: 'high' },
  ]

  const highRiskSuppliers = [
    { name: 'GlobalSupply Co.', riskScore: 85, issues: ['Financial', 'Operational'] },
    { name: 'IndustrialX Manufacturing', riskScore: 72, issues: ['Delivery'] },
    { name: 'EasternParts Ltd', riskScore: 68, issues: ['Quality'] },
  ]

  const recentActivities = [
    { action: 'PO Approved', details: 'PO-4521 - TechCorp - $125,000', time: '2 hours ago' },
    { action: 'RFQ Created', details: 'RFQ-2024-007 - Electronic Components', time: '4 hours ago' },
    { action: 'Risk Alert', details: 'GlobalSupply - Financial health declined', time: '6 hours ago' },
    { action: 'Delivery Received', details: 'PO-4520 - AutoParts - On time', time: '1 day ago' },
  ]

  const getKPIIcon = (Icon, color) => {
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

  const getAlertBadge = (type) => {
    const variants = {
      critical: 'danger',
      warning: 'warning',
      info: 'primary',
    }
    return <Badge variant={variants[type]}>{type}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success',
    }
    return <Badge variant={variants[priority]}>{priority}</Badge>
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

  const getInventoryStatus = (status) => {
    const variants = {
      adequate: 'success',
      low: 'warning',
      critical: 'danger',
      excess: 'primary',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Executive Procurement Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time procurement intelligence and analytics</p>
        </div>
        <Button>
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <Select 
              value={filters.dateRange} 
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="w-40"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </Select>
            <Select 
              value={filters.supplier} 
              onChange={(e) => setFilters({...filters, supplier: e.target.value})}
              className="w-40"
            >
              <option value="all">All Suppliers</option>
              <option value="techcorp">TechCorp</option>
              <option value="industrialx">IndustrialX</option>
              <option value="autoparts">AutoParts</option>
            </Select>
            <Select 
              value={filters.location} 
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-40"
            >
              <option value="all">All Locations</option>
              <option value="plant1">Plant 1</option>
              <option value="plant2">Plant 2</option>
              <option value="warehouse">Warehouse</option>
            </Select>
            <Select 
              value={filters.category} 
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-40"
            >
              <option value="all">All Categories</option>
              <option value="raw">Raw Materials</option>
              <option value="components">Components</option>
              <option value="services">Services</option>
            </Select>
            <Select 
              value={filters.riskLevel} 
              onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
              className="w-40"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </Select>
            <Button variant="secondary" size="sm">Apply Filters</Button>
            <Button variant="ghost" size="sm">Reset</Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {getKPIIcon(kpi.icon, kpi.color)}
                <div className={`flex items-center gap-1 text-sm ${
                  kpi.trend === 'up' ? 'text-success-600' : kpi.trend === 'down' ? 'text-danger-600' : 'text-gray-500'
                }`}>
                  {kpi.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : kpi.trend === 'down' ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : null}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600">{kpi.title}</p>
                <p className="text-xl font-bold text-navy-900 mt-1">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance Trends</CardTitle>
            <CardDescription>Performance scores over time by supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={supplierPerformanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="techCorp" stroke="#3367d6" name="TechCorp" />
                <Line type="monotone" dataKey="industrialX" stroke="#ef4444" name="IndustrialX" />
                <Line type="monotone" dataKey="autoParts" stroke="#22c55e" name="AutoParts" />
                <Line type="monotone" dataKey="globalSupply" stroke="#f59e0b" name="GlobalSupply" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procurement Spending Trends</CardTitle>
            <CardDescription>Monthly spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={procurementSpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="rawMaterials" stackId="1" stroke="#3367d6" fill="#3367d6" name="Raw Materials" />
                <Area type="monotone" dataKey="components" stackId="1" stroke="#22c55e" fill="#22c55e" name="Components" />
                <Area type="monotone" dataKey="services" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Services" />
                <Area type="monotone" dataKey="equipment" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Equipment" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Suppliers by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>On-time vs delayed deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="onTime" fill="#22c55e" name="On-Time %" />
                <Bar dataKey="delayed" fill="#ef4444" name="Delayed %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current inventory levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryStatus.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    {getInventoryStatus(item.status)}
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={(item.available / item.required) * 100} variant={item.status === 'critical' ? 'danger' : item.status === 'low' ? 'warning' : 'success'} className="flex-1" />
                    <span className="text-sm text-gray-600">{item.available}/{item.required}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predicted vs Actual */}
      <Card>
        <CardHeader>
          <CardTitle>Predicted vs Actual Spending</CardTitle>
          <CardDescription>AI prediction accuracy over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={predictedVsActual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeDasharray="5 5" name="Predicted" />
              <Line type="monotone" dataKey="actual" stroke="#3367d6" name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Procurement Intelligence */}
      <Card className="border-2 border-accent-500 bg-accent-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent-600" />
            AI Procurement Intelligence
          </CardTitle>
          <CardDescription>Current AI-powered recommendation and analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Current Recommendation</p>
              <p className="text-sm font-semibold text-navy-900">{aiIntelligence.recommendation}</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Risk Level</p>
              <Badge variant={aiIntelligence.riskLevel === 'high' ? 'danger' : aiIntelligence.riskLevel === 'medium' ? 'warning' : 'success'}>
                {aiIntelligence.riskLevel.charAt(0).toUpperCase() + aiIntelligence.riskLevel.slice(1)}
              </Badge>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-xs text-gray-600 mb-1">AI Confidence</p>
              <p className="text-2xl font-bold text-accent-600">{aiIntelligence.confidence}%</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Recommended Action</p>
            <p className="text-sm font-medium text-navy-900">{aiIntelligence.recommendedAction}</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Explanation</p>
            <p className="text-sm text-gray-700">{aiIntelligence.explanation}</p>
          </div>
          <Button variant="primary" className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            View Full Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger-600" />
            Critical Alerts
          </CardTitle>
          <CardDescription>Urgent issues requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${alert.type === 'critical' ? 'border-danger-500 bg-danger-50' : 'border-warning-500 bg-warning-50'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${alert.type === 'critical' ? 'text-danger-600' : 'text-warning-600'}`} />
                    <h4 className="font-medium text-navy-900">{alert.title}</h4>
                  </div>
                  {getAlertBadge(alert.type)}
                </div>
                <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance Overview</CardTitle>
          <CardDescription>Key supplier metrics and risk levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Supplier Name</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Overall Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Delivery Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Quality Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {supplierPerformanceOverview.map((supplier, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-navy-900">{supplier.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-lg font-bold ${supplier.overallScore >= 90 ? 'text-success-600' : supplier.overallScore >= 80 ? 'text-warning-600' : 'text-danger-600'}`}>
                        {supplier.overallScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700">{supplier.deliveryScore}%</td>
                    <td className="py-3 px-4 text-center text-sm text-gray-700">{supplier.qualityScore}%</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={supplier.riskLevel === 'low' ? 'success' : supplier.riskLevel === 'medium' ? 'warning' : 'danger'}>
                        {supplier.riskLevel.charAt(0).toUpperCase() + supplier.riskLevel.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Widgets Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
            <CardDescription>Key delivery dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-navy-900 text-sm">{milestone.supplier}</p>
                    {getMilestoneBadge(milestone.status)}
                  </div>
                  <p className="text-xs text-gray-600">{milestone.milestone}</p>
                  <p className="text-xs text-gray-500 mt-1">{milestone.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Requests awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-navy-900 text-sm">{approval.id}</p>
                    {getPriorityBadge(approval.priority)}
                  </div>
                  <p className="text-xs text-gray-600">{approval.supplier}</p>
                  <p className="text-xs font-semibold text-navy-900 mt-1">{approval.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest procurement events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium text-navy-900 text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing & High Risk Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Suppliers</CardTitle>
            <CardDescription>Best performers this quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplierPerformanceOverview.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-navy-900">{supplier.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>On-Time: {supplier.deliveryScore}%</span>
                      <span>Quality: {supplier.qualityScore}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success-600">{supplier.overallScore}</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>High-Risk Suppliers</CardTitle>
            <CardDescription>Suppliers requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highRiskSuppliers.map((supplier, index) => (
                <div key={index} className="p-4 border border-danger-200 bg-danger-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-navy-900">{supplier.name}</p>
                    <Badge variant="danger">Risk: {supplier.riskScore}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {supplier.issues.map((issue, i) => (
                      <Badge key={i} variant="warning">{issue}</Badge>
                    ))}
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

export default ExecutiveDashboard
