import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { Search, Filter, AlertTriangle, TrendingUp, TrendingDown, Brain, Target, Shield, Activity, Package, DollarSign, Globe, Users, ArrowUpDown, MoreVertical } from 'lucide-react'
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const SupplierRiskManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [riskLevelFilter, setRiskLevelFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('riskScore')

  const riskCategories = {
    delivery: { name: 'Delivery Risk', icon: Package, color: '#ef4444' },
    stock: { name: 'Stock Risk', icon: Activity, color: '#f59e0b' },
    capacity: { name: 'Capacity Risk', icon: Users, color: '#8b5cf6' },
    quality: { name: 'Quality Risk', icon: Shield, color: '#3367d6' },
    financial: { name: 'Financial Risk', icon: DollarSign, color: '#22c55e' },
    market: { name: 'Market Risk', icon: Globe, color: '#ec4899' },
    dependency: { name: 'Supplier Dependency Risk', icon: Target, color: '#06b6d4' },
  }

  const suppliers = [
    {
      id: 1,
      name: 'TechCorp Industries',
      category: 'Electronics',
      overallRiskScore: 15,
      riskLevel: 'low',
      riskTrend: 'stable',
      risks: {
        delivery: 10,
        stock: 8,
        capacity: 12,
        quality: 5,
        financial: 8,
        market: 15,
        dependency: 20,
      },
      aiPrediction: {
        prediction: 'Low risk maintained',
        confidence: 92,
        timeframe: 'Next 6 months',
        factors: ['Strong financial health', 'Excellent delivery record', 'Diversified customer base'],
      },
      rootCause: 'No significant risk factors identified. Supplier maintains strong performance across all metrics.',
      recommendedAction: 'Continue current relationship. Monitor quarterly for any changes in financial indicators.',
      alerts: [],
    },
    {
      id: 2,
      name: 'IndustrialX Manufacturing',
      category: 'Raw Materials',
      overallRiskScore: 42,
      riskLevel: 'medium',
      riskTrend: 'increasing',
      risks: {
        delivery: 35,
        stock: 25,
        capacity: 40,
        quality: 30,
        financial: 55,
        market: 45,
        dependency: 35,
      },
      aiPrediction: {
        prediction: 'Risk increasing',
        confidence: 85,
        timeframe: 'Next 3 months',
        factors: ['Declining profit margins', 'Increased debt ratio', 'Market volatility in raw materials'],
      },
      rootCause: 'Financial health deterioration due to market conditions and increased operational costs. Delivery performance also showing slight decline.',
      recommendedAction: 'Develop contingency plans. Consider diversifying suppliers. Monitor financial statements monthly.',
      alerts: [
        { type: 'warning', message: 'Debt ratio increased by 15% in Q4', date: '2024-01-10' },
        { type: 'warning', message: 'Delivery delays increased to 12%', date: '2024-01-08' },
      ],
    },
    {
      id: 3,
      name: 'GlobalSupply Co.',
      category: 'Logistics',
      overallRiskScore: 68,
      riskLevel: 'high',
      riskTrend: 'increasing',
      risks: {
        delivery: 55,
        stock: 40,
        capacity: 50,
        quality: 45,
        financial: 75,
        market: 60,
        dependency: 65,
      },
      aiPrediction: {
        prediction: 'High risk - action required',
        confidence: 88,
        timeframe: 'Immediate',
        factors: ['Critical financial instability', 'High dependency on single market', 'Quality concerns increasing'],
      },
      rootCause: 'Severe financial instability with debt-to-equity ratio at critical levels. High dependency on Asian market creating supply chain vulnerability.',
      recommendedAction: 'URGENT: Initiate supplier replacement process. Reduce order volumes immediately. Secure alternative suppliers.',
      alerts: [
        { type: 'critical', message: 'Debt-to-equity ratio at 85%', date: '2024-01-12' },
        { type: 'critical', message: 'Credit rating downgraded', date: '2024-01-11' },
        { type: 'warning', message: 'Quality score dropped below threshold', date: '2024-01-09' },
      ],
    },
    {
      id: 4,
      name: 'AutoParts Premium',
      category: 'Automotive',
      overallRiskScore: 22,
      riskLevel: 'low',
      riskTrend: 'decreasing',
      risks: {
        delivery: 15,
        stock: 12,
        capacity: 20,
        quality: 10,
        financial: 18,
        market: 25,
        dependency: 30,
      },
      aiPrediction: {
        prediction: 'Risk decreasing',
        confidence: 90,
        timeframe: 'Next 6 months',
        factors: ['Improving financial metrics', 'Capacity expansion completed', 'Quality certifications renewed'],
      },
      rootCause: 'Recent improvements in financial health and capacity. Quality performance consistently excellent.',
      recommendedAction: 'Excellent supplier. Consider increasing order volumes. Maintain current relationship.',
      alerts: [
        { type: 'info', message: 'New ISO certification obtained', date: '2024-01-05' },
      ],
    },
    {
      id: 5,
      name: 'PrimeMfg Solutions',
      category: 'Manufacturing',
      overallRiskScore: 35,
      riskLevel: 'medium',
      riskTrend: 'stable',
      risks: {
        delivery: 25,
        stock: 20,
        capacity: 35,
        quality: 22,
        financial: 30,
        market: 40,
        dependency: 45,
      },
      aiPrediction: {
        prediction: 'Medium risk stable',
        confidence: 82,
        timeframe: 'Next 6 months',
        factors: ['Moderate financial position', 'Capacity constraints during peak season', 'Geographic concentration risk'],
      },
      rootCause: 'Moderate risk across multiple categories. Geographic concentration creates some dependency risk. Capacity constraints during peak periods.',
      recommendedAction: 'Monitor capacity planning. Consider geographic diversification. Maintain current order levels.',
      alerts: [],
    },
    {
      id: 6,
      name: 'EasternParts Ltd',
      category: 'Components',
      overallRiskScore: 78,
      riskLevel: 'critical',
      riskTrend: 'increasing',
      risks: {
        delivery: 70,
        stock: 60,
        capacity: 55,
        quality: 65,
        financial: 85,
        market: 75,
        dependency: 80,
      },
      aiPrediction: {
        prediction: 'Critical - immediate action',
        confidence: 95,
        timeframe: 'Immediate',
        factors: ['Severe financial distress', 'Quality failures increasing', 'High dependency risk', 'Market instability'],
      },
      rootCause: 'Multiple critical risk factors including severe financial distress, quality failures, and high dependency. Supplier in distress.',
      recommendedAction: 'CRITICAL: Immediately suspend new orders. Expedite supplier replacement. Activate contingency plans. Legal review recommended.',
      alerts: [
        { type: 'critical', message: 'Bankruptcy risk elevated', date: '2024-01-12' },
        { type: 'critical', message: 'Quality failures in last 3 shipments', date: '2024-01-11' },
        { type: 'critical', message: 'Payment delays reported', date: '2024-01-10' },
        { type: 'warning', message: 'Key personnel departed', date: '2024-01-08' },
      ],
    },
  ]

  const getRiskLevelBadge = (level) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'danger',
    }
    return <Badge variant={variants[level]}>{level.charAt(0).toUpperCase() + level.slice(1)}</Badge>
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-danger-600" />
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-success-600" />
    return <Activity className="w-4 h-4 text-gray-400" />
  }

  const getAlertBadge = (type) => {
    const variants = {
      critical: 'danger',
      warning: 'warning',
      info: 'primary',
    }
    return <Badge variant={variants[type]}>{type}</Badge>
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskLevelFilter === 'all' || supplier.riskLevel === riskLevelFilter
    return matchesSearch && matchesRisk
  }).sort((a, b) => {
    if (sortBy === 'riskScore') return b.overallRiskScore - a.overallRiskScore
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const riskHeatmapData = suppliers.map(s => ({
    name: s.name.split(' ')[0],
    delivery: s.risks.delivery,
    stock: s.risks.stock,
    capacity: s.risks.capacity,
    quality: s.risks.quality,
    financial: s.risks.financial,
    market: s.risks.market,
    dependency: s.risks.dependency,
  }))

  const riskTrendData = suppliers.map(s => ({
    name: s.name.split(' ')[0],
    current: s.overallRiskScore,
    previous: s.riskTrend === 'increasing' ? s.overallRiskScore - 10 : s.riskTrend === 'decreasing' ? s.overallRiskScore + 10 : s.overallRiskScore,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Supplier Risk Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive risk analysis with AI-powered insights and predictions</p>
        </div>
        <Button>
          <Brain className="w-4 h-4 mr-2" />
          Run AI Risk Analysis
        </Button>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success-100 rounded-lg">
                <Shield className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Risk</p>
                <p className="text-2xl font-bold text-success-600">{suppliers.filter(s => s.riskLevel === 'low').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medium Risk</p>
                <p className="text-2xl font-bold text-warning-600">{suppliers.filter(s => s.riskLevel === 'medium').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-danger-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-danger-600">{suppliers.filter(s => s.riskLevel === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-danger-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-danger-600">{suppliers.filter(s => s.riskLevel === 'critical').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskLevelFilter} onChange={(e) => setRiskLevelFilter(e.target.value)} className="w-40">
              <option value="all">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-40">
              <option value="all">All Categories</option>
              {[...new Set(suppliers.map(s => s.category))].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-40">
              <option value="riskScore">Sort by Risk</option>
              <option value="name">Sort by Name</option>
            </Select>
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Heatmap by Category</CardTitle>
          <CardDescription>Visual risk assessment across all risk categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Supplier</th>
                  {Object.entries(riskCategories).map(([key, cat]) => (
                    <th key={key} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                      {cat.name}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Overall</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t">
                    <td className="px-4 py-3 text-sm font-medium text-navy-900">{supplier.name.split(' ')[0]}</td>
                    {Object.entries(supplier.risks).map(([key, value]) => (
                      <td key={key} className="px-4 py-3 text-center">
                        <div 
                          className={`w-full h-8 rounded flex items-center justify-center text-xs font-medium ${
                            value >= 70 ? 'bg-danger-500 text-white' :
                            value >= 50 ? 'bg-danger-300 text-white' :
                            value >= 30 ? 'bg-warning-400 text-white' :
                            value >= 15 ? 'bg-warning-200 text-gray-800' :
                            'bg-success-200 text-gray-800'
                          }`}
                        >
                          {value}
                        </div>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <div 
                        className={`w-full h-8 rounded flex items-center justify-center text-xs font-bold ${
                          supplier.overallRiskScore >= 70 ? 'bg-danger-600 text-white' :
                          supplier.overallRiskScore >= 50 ? 'bg-danger-400 text-white' :
                          supplier.overallRiskScore >= 30 ? 'bg-warning-500 text-white' :
                          'bg-success-500 text-white'
                        }`}
                      >
                        {supplier.overallRiskScore}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Trend Analysis</CardTitle>
          <CardDescription>Current vs previous risk scores by supplier</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="previous" fill="#94a3b8" name="Previous" />
              <Bar dataKey="current" fill="#3367d6" name="Current" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Supplier Risk Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className={`${supplier.riskLevel === 'critical' ? 'border-2 border-danger-500' : supplier.riskLevel === 'high' ? 'border-2 border-danger-300' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {supplier.name}
                    {getRiskLevelBadge(supplier.riskLevel)}
                  </CardTitle>
                  <CardDescription>{supplier.category}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(supplier.riskTrend)}
                  <span className="text-sm text-gray-500">{supplier.riskTrend}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Risk Score */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Overall Risk Score</span>
                  <span className="text-2xl font-bold text-navy-900">{supplier.overallRiskScore}</span>
                </div>
                <Progress 
                  value={supplier.overallRiskScore} 
                  variant={supplier.overallRiskScore >= 70 ? 'danger' : supplier.overallRiskScore >= 50 ? 'warning' : 'success'} 
                />
              </div>

              {/* Risk Categories */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Risk Categories</h4>
                <div className="space-y-2">
                  {Object.entries(supplier.risks).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-32">{riskCategories[key].name}</span>
                      <Progress 
                        value={value} 
                        variant={value >= 70 ? 'danger' : value >= 50 ? 'warning' : 'success'} 
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-8 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Prediction */}
              <Card className="border-2 border-accent-200 bg-accent-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-5 h-5 text-accent-600" />
                    AI Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Prediction</span>
                      <span className="font-medium text-accent-900">{supplier.aiPrediction.prediction}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <Badge variant="accent">{supplier.aiPrediction.confidence}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Timeframe</span>
                      <span className="text-sm font-medium">{supplier.aiPrediction.timeframe}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Key Factors</span>
                      <ul className="mt-1 space-y-1">
                        {supplier.aiPrediction.factors.map((factor, i) => (
                          <li key={i} className="text-sm text-accent-800">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Root Cause */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Root Cause Analysis</h4>
                <p className="text-sm text-gray-600">{supplier.rootCause}</p>
              </div>

              {/* Recommended Action */}
              <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-medium text-primary-900 mb-1">Recommended Action</h4>
                <p className="text-sm text-primary-800">{supplier.recommendedAction}</p>
              </div>

              {/* Alerts */}
              {supplier.alerts.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recent Alerts</h4>
                  <div className="space-y-2">
                    {supplier.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                        <div className="flex items-center gap-2">
                          {getAlertBadge(alert.type)}
                          <span className="text-sm text-gray-700">{alert.message}</span>
                        </div>
                        <span className="text-xs text-gray-500">{alert.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SupplierRiskManagement
