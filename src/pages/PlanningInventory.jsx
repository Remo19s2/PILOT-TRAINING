import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { Package, AlertTriangle, TrendingUp, Calendar, Target, ClipboardList, BarChart3, Plus, Filter, Search, ArrowRight, Brain, FileText, Eye, CheckCircle, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const PlanningInventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      alert('AI Analysis completed successfully!')
    }, 2000)
  }

  const handleGenerateRFQs = () => {
    alert('RFQs generated for critical shortages!')
  }

  const handleExportAnalysis = () => {
    alert('Analysis exported to CSV!')
  }

  // Planning & Inventory Agent Data
  const requirements = [
    {
      id: 'COMP-001',
      componentName: 'Electronic Control Unit',
      componentId: 'ECU-2024-X1',
      requiredQuantity: 10000,
      availableInventory: 3000,
      shortageQuantity: 7000,
      requiredDate: '2024-01-28',
      urgencyLevel: 'high',
      productionImpact: 'Production line stoppage risk if not procured by required date',
      
      // AI Analysis Data
      customerDemand: 9500,
      productionRequirement: 10000,
      bomRequirement: 10000,
      currentInventory: 3000,
      procurementRequirement: 7000,
    },
    {
      id: 'COMP-002',
      componentName: 'Steel Sheets - Grade A',
      componentId: 'SS-2024-A1',
      requiredQuantity: 30000,
      availableInventory: 450,
      shortageQuantity: 29550,
      requiredDate: '2024-01-25',
      urgencyLevel: 'critical',
      productionImpact: 'Critical production halt - multiple assembly lines affected',
      
      // AI Analysis Data
      customerDemand: 28000,
      productionRequirement: 30000,
      bomRequirement: 30000,
      currentInventory: 450,
      procurementRequirement: 29550,
    },
    {
      id: 'COMP-003',
      componentName: 'Circuit Board - Type B',
      componentId: 'CB-2024-B2',
      requiredQuantity: 5500,
      availableInventory: 1200,
      shortageQuantity: 4300,
      requiredDate: '2024-01-30',
      urgencyLevel: 'high',
      productionImpact: 'Customer order delays if not procured on time',
      
      // AI Analysis Data
      customerDemand: 5000,
      productionRequirement: 5500,
      bomRequirement: 5500,
      currentInventory: 1200,
      procurementRequirement: 4300,
    },
    {
      id: 'COMP-004',
      componentName: 'Packaging Materials',
      componentId: 'PM-2024-C1',
      requiredQuantity: 8000,
      availableInventory: 6500,
      shortageQuantity: 1500,
      requiredDate: '2024-02-05',
      urgencyLevel: 'medium',
      productionImpact: 'Minor impact - can use existing stock temporarily',
      
      // AI Analysis Data
      customerDemand: 7500,
      productionRequirement: 8000,
      bomRequirement: 8000,
      currentInventory: 6500,
      procurementRequirement: 1500,
    },
    {
      id: 'COMP-005',
      componentName: 'Fasteners - M8 Bolts',
      componentId: 'FB-2024-M8',
      requiredQuantity: 50000,
      availableInventory: 42000,
      shortageQuantity: 8000,
      requiredDate: '2024-02-10',
      urgencyLevel: 'low',
      productionImpact: 'No immediate impact - sufficient buffer stock',
      
      // AI Analysis Data
      customerDemand: 45000,
      productionRequirement: 50000,
      bomRequirement: 50000,
      currentInventory: 42000,
      procurementRequirement: 8000,
    },
  ]

  const getUrgencyBadge = (urgency) => {
    const variants = {
      critical: 'danger',
      high: 'warning',
      medium: 'primary',
      low: 'success',
    }
    return <Badge variant={variants[urgency]}>{urgency.charAt(0).toUpperCase() + urgency.slice(1)}</Badge>
  }

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.componentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUrgency = urgencyFilter === 'all' || req.urgencyLevel === urgencyFilter
    return matchesSearch && matchesUrgency
  })

  // Chart Data
  const demandAnalysis = [
    { name: 'ECU', customer: 9500, production: 10000, inventory: 3000 },
    { name: 'Steel', customer: 28000, production: 30000, inventory: 450 },
    { name: 'Circuit', customer: 5000, production: 5500, inventory: 1200 },
    { name: 'Packaging', customer: 7500, production: 8000, inventory: 6500 },
    { name: 'Fasteners', customer: 45000, production: 50000, inventory: 42000 },
  ]

  const urgencyDistribution = [
    { name: 'Critical', value: 1, color: '#ef4444' },
    { name: 'High', value: 2, color: '#f59e0b' },
    { name: 'Medium', value: 1, color: '#3367d6' },
    { name: 'Low', value: 1, color: '#22c55e' },
  ]

  const procurementTrend = [
    { month: 'Sep', value: 120 },
    { month: 'Oct', value: 145 },
    { month: 'Nov', value: 132 },
    { month: 'Dec', value: 168 },
    { month: 'Jan', value: 185 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Planning & Inventory Agent</h1>
          <p className="text-gray-600 mt-1">AI-powered inventory analysis and procurement planning</p>
        </div>
        <Button onClick={handleRunAIAnalysis} disabled={isAnalyzing}>
          <Brain className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <ClipboardList className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requirements</p>
                <p className="text-2xl font-bold text-navy-900">{requirements.length}</p>
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
                <p className="text-sm text-gray-600">Critical Shortages</p>
                <p className="text-2xl font-bold text-danger-600">{requirements.filter(r => r.urgencyLevel === 'critical').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Package className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Shortage</p>
                <p className="text-2xl font-bold text-navy-900">{requirements.reduce((sum, r) => sum + r.shortageQuantity, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Confidence</p>
                <p className="text-2xl font-bold text-success-600">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Demand vs Inventory Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demandAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customer" fill="#3367d6" name="Customer Demand" />
                <Bar dataKey="production" fill="#22c55e" name="Production Req" />
                <Bar dataKey="inventory" fill="#f59e0b" name="Inventory" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Urgency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={urgencyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {urgencyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procurement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={procurementTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3367d6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search component name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <option value="all">All Urgency Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Requirements</CardTitle>
          <CardDescription>{filteredRequirements.length} components requiring procurement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Component</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Component ID</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Required Qty</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Available</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Shortage</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Required Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Urgency</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequirements.map((req) => (
                  <tr key={req.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-navy-900">{req.componentName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{req.componentId}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-gray-700">{req.requiredQuantity.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-gray-700">{req.availableInventory.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-medium text-danger-600">{req.shortageQuantity.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{req.requiredDate}</span>
                    </td>
                    <td className="py-3 px-4">
                      {getUrgencyBadge(req.urgencyLevel)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="primary" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Panel */}
      <Card className="border-2 border-accent-500 bg-accent-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-900">
            <Brain className="w-5 h-5 text-accent-600" />
            AI Analysis - Planning & Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary-600" />
                <p className="text-sm font-medium text-gray-700">Customer Demand Analysis</p>
              </div>
              <p className="text-xs text-gray-600">AI analyzes historical customer orders, seasonal patterns, and market trends to predict future demand with 94% accuracy.</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-success-600" />
                <p className="text-sm font-medium text-gray-700">Production Requirements</p>
              </div>
              <p className="text-xs text-gray-600">Calculates exact material needs based on production schedules, BOM requirements, and capacity planning.</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-warning-600" />
                <p className="text-sm font-medium text-gray-700">Inventory Optimization</p>
              </div>
              <p className="text-xs text-gray-600">Optimizes inventory levels by balancing safety stock, lead times, and carrying costs to prevent shortages.</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-accent-200">
            <h4 className="font-semibold text-accent-900 mb-3">AI Recommendations</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Prioritize Steel Sheets Procurement</p>
                  <p className="text-xs text-gray-600">Critical shortage of 29,550 units with highest urgency. Recommend immediate RFQ to IndustrialX with expedited delivery.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Split ECU Order for Risk Mitigation</p>
                  <p className="text-xs text-gray-600">Split 7,000 unit shortage between TechCorp (60%) and AutoParts (40%) to reduce single-source dependency risk.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Increase Safety Stock for Fasteners</p>
                  <p className="text-xs text-gray-600">Current buffer insufficient. Recommend increasing safety stock by 20% to prevent future shortages.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="accent" onClick={handleGenerateRFQs} className="flex-1">
              <Brain className="w-4 h-4 mr-2" />
              Generate RFQs
            </Button>
            <Button variant="secondary" onClick={handleExportAnalysis} className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PlanningInventory
