import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { AlertTriangle, Search, Filter, TrendingUp, Shield, Clock, Brain, BarChart3, Target, ArrowRight, Eye, Activity, Zap, Globe, DollarSign, Package, X, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const RiskPrediction = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleRunRiskAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      alert('Risk Analysis completed successfully!')
    }, 2000)
  }

  const handleMitigateRisk = (risk) => {
    alert(`Mitigation plan created for ${risk.id}!`)
    setSelectedRisk(null)
  }

  const handleCreateActionPlan = (risk) => {
    alert(`Action plan created for ${risk.id}!`)
    setSelectedRisk(null)
  }

  // Risk Prediction Agent Data
  const risks = [
    {
      id: 'RISK-001',
      type: 'Delivery Risk',
      category: 'Supply Chain',
      supplier: 'IndustrialX Manufacturing',
      description: 'High probability of delivery delay due to supplier capacity constraints and recent performance decline.',
      
      // Risk Metrics
      riskScore: 78,
      probability: 'High',
      impact: 'Critical',
      probabilityValue: 78,
      impactValue: 85,
      
      // Timeline
      detectionDate: '2024-01-12',
      expectedOccurrence: '2024-01-25',
      
      // Affected Items
      affectedItems: [
        { name: 'Steel Sheets', quantity: 29550, requiredDate: '2024-01-25' },
      ],
      
      // AI Analysis
      aiPrediction: '78% probability of delivery delay. Supplier showing capacity constraints with 82% on-time delivery rate. Recent quality issues indicate operational problems. Recommend immediate diversification.',
      aiConfidence: 88,
      recommendedActions: [
        'Identify alternative suppliers immediately',
        'Split order between multiple suppliers',
        'Increase safety stock for critical items',
        'Implement supplier performance monitoring',
      ],
      
      // Business Impact
      businessImpact: 'Production line stoppage risk. Multiple assembly lines affected. Estimated loss: ₹2.5M if not mitigated.',
    },
    {
      id: 'RISK-002',
      type: 'Inventory Risk',
      category: 'Inventory',
      supplier: 'Multiple',
      description: 'Critical inventory shortage for Electronic Control Units. Current stock insufficient for Q1 production requirements.',
      
      riskScore: 85,
      probability: 'Very High',
      impact: 'Critical',
      probabilityValue: 92,
      impactValue: 88,
      
      detectionDate: '2024-01-12',
      expectedOccurrence: '2024-01-28',
      
      affectedItems: [
        { name: 'Electronic Control Unit', quantity: 7000, requiredDate: '2024-01-28' },
      ],
      
      aiPrediction: '92% probability of stockout. Current inventory (3,000) vs requirement (10,000). Demand 15% above forecast. Recommend expedited procurement.',
      aiConfidence: 94,
      recommendedActions: [
        'Expedite RFQ process',
        'Consider premium pricing for faster delivery',
        'Review demand forecast accuracy',
        'Implement automated reorder points',
      ],
      
      businessImpact: 'Production line stoppage risk. Customer order delays. Estimated loss: ₹3.2M if not mitigated.',
    },
    {
      id: 'RISK-003',
      type: 'Supplier Financial Risk',
      category: 'Financial',
      supplier: 'GlobalSupply Co.',
      description: 'Supplier showing signs of financial stress with increased debt ratio and payment delays.',
      
      riskScore: 65,
      probability: 'Medium',
      impact: 'High',
      probabilityValue: 65,
      impactValue: 75,
      
      detectionDate: '2024-01-10',
      expectedOccurrence: '2024-03-15',
      
      affectedItems: [
        { name: 'General Supplies', quantity: 50000, requiredDate: '2024-02-15' },
      ],
      
      aiPrediction: '65% probability of supplier financial distress. Debt ratio increased 15% in Q4. Payment delays observed. Recommend reduce dependency.',
      aiConfidence: 82,
      recommendedActions: [
        'Reduce order volumes gradually',
        'Identify backup suppliers',
        'Monitor financial health weekly',
        'Implement payment terms protection',
      ],
      
      businessImpact: 'Supply disruption risk. Potential quality decline. Estimated loss: ₹1.2M if not mitigated.',
    },
    {
      id: 'RISK-004',
      type: 'Quality Risk',
      category: 'Quality',
      supplier: 'IndustrialX Manufacturing',
      description: 'Increasing quality issues with recent batches showing defect rate above acceptable threshold.',
      
      riskScore: 55,
      probability: 'Medium',
      impact: 'Medium',
      probabilityValue: 55,
      impactValue: 60,
      
      detectionDate: '2024-01-08',
      expectedOccurrence: '2024-02-01',
      
      affectedItems: [
        { name: 'Steel Sheets', quantity: 15000, requiredDate: '2024-02-01' },
      ],
      
      aiPrediction: '55% probability of quality issues. Defect rate increased from 2% to 5%. Recent quality complaints. Recommend quality audit.',
      aiConfidence: 78,
      recommendedActions: [
        'Conduct quality audit',
        'Implement stricter QC protocols',
        'Review supplier quality certifications',
        'Consider quality penalty clauses',
      ],
      
      businessImpact: 'Production rework costs. Customer returns. Estimated loss: ₹800K if not mitigated.',
    },
    {
      id: 'RISK-005',
      type: 'Market Risk',
      category: 'Market',
      supplier: 'Multiple',
      description: 'Raw material price volatility expected due to global supply chain disruptions.',
      
      riskScore: 45,
      probability: 'Low',
      impact: 'High',
      probabilityValue: 45,
      impactValue: 70,
      
      detectionDate: '2024-01-05',
      expectedOccurrence: '2024-04-01',
      
      affectedItems: [
        { name: 'Raw Materials', quantity: 100000, requiredDate: '2024-04-01' },
      ],
      
      aiPrediction: '45% probability of price increase. Global supply chain disruptions affecting raw material availability. Recommend hedging strategy.',
      aiConfidence: 72,
      recommendedActions: [
        'Implement price hedging',
        'Increase inventory buffer',
        'Diversify supplier base',
        'Monitor market trends weekly',
      ],
      
      businessImpact: 'Cost increase risk. Margin pressure. Estimated loss: ₹1.5M if not mitigated.',
    },
  ]

  const getRiskBadge = (risk) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      'very high': 'danger',
    }
    return <Badge variant={variants[risk]}>{risk.charAt(0).toUpperCase() + risk.slice(1)}</Badge>
  }

  const getRiskScoreColor = (score) => {
    if (score >= 70) return 'text-danger-600'
    if (score >= 50) return 'text-warning-600'
    return 'text-success-600'
  }

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskFilter === 'all' || risk.probability === riskFilter
    return matchesSearch && matchesRisk
  })

  // Risk Trend Data
  const riskTrend = [
    { month: 'Sep', delivery: 45, inventory: 55, financial: 30, quality: 25 },
    { month: 'Oct', delivery: 52, inventory: 62, financial: 35, quality: 28 },
    { month: 'Nov', delivery: 58, inventory: 70, financial: 40, quality: 32 },
    { month: 'Dec', delivery: 65, inventory: 78, financial: 45, quality: 38 },
    { month: 'Jan', delivery: 72, inventory: 85, financial: 50, quality: 42 },
  ]

  // Risk Distribution
  const riskDistribution = [
    { name: 'Delivery', value: 3, color: '#ef4444' },
    { name: 'Inventory', value: 2, color: '#f59e0b' },
    { name: 'Financial', value: 1, color: '#3367d6' },
    { name: 'Quality', value: 1, color: '#22c55e' },
    { name: 'Market', value: 1, color: '#8b5cf6' },
  ]

  // Probability vs Impact
  const probabilityImpact = [
    { name: 'RISK-001', probability: 78, impact: 85 },
    { name: 'RISK-002', probability: 92, impact: 88 },
    { name: 'RISK-003', probability: 65, impact: 75 },
    { name: 'RISK-004', probability: 55, impact: 60 },
    { name: 'RISK-005', probability: 45, impact: 70 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Risk Prediction Agent</h1>
          <p className="text-gray-600 mt-1">AI-powered risk analysis and prediction</p>
        </div>
        <Button onClick={handleRunRiskAnalysis} disabled={isAnalyzing}>
          <Brain className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Run Risk Analysis'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Risks</p>
                <p className="text-2xl font-bold text-navy-900">{risks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-danger-100 rounded-lg">
                <Zap className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Risks</p>
                <p className="text-2xl font-bold text-danger-600">{risks.filter(r => r.impact === 'Critical').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Activity className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Risk Score</p>
                <p className="text-2xl font-bold text-navy-900">{Math.round(risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent-100 rounded-lg">
                <Brain className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Confidence</p>
                <p className="text-2xl font-bold text-navy-900">{Math.round(risks.reduce((sum, r) => sum + r.aiConfidence, 0) / risks.length)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="delivery" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Area type="monotone" dataKey="inventory" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Area type="monotone" dataKey="financial" stackId="1" stroke="#3367d6" fill="#3367d6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
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
            <CardTitle>Probability vs Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={probabilityImpact}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="probability" fill="#ef4444" name="Probability" />
                <Bar dataKey="impact" fill="#3367d6" name="Impact" />
              </BarChart>
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
                  placeholder="Search risk type, supplier, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All Probabilities</option>
                <option value="very high">Very High</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Predictions</CardTitle>
          <CardDescription>{filteredRisks.length} identified risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Risk ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Supplier</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Risk Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Probability</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Impact</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.map((risk) => (
                  <tr key={risk.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-navy-900">{risk.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{risk.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{risk.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{risk.supplier}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold ${getRiskScoreColor(risk.riskScore)}`}>{risk.riskScore}</span>
                    </td>
                    <td className="py-3 px-4">
                      {getRiskBadge(risk.probability)}
                    </td>
                    <td className="py-3 px-4">
                      {getRiskBadge(risk.impact)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setSelectedRisk(risk)}>
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

      {/* Risk Detail Modal */}
      {selectedRisk && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedRisk.type}</CardTitle>
                  <CardDescription>{selectedRisk.id} • {selectedRisk.category}</CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setSelectedRisk(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{selectedRisk.description}</p>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Risk Score</p>
                  <p className={`text-2xl font-bold ${getRiskScoreColor(selectedRisk.riskScore)}`}>{selectedRisk.riskScore}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Probability</p>
                  <p className="text-2xl font-bold text-navy-900">{selectedRisk.probabilityValue}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Impact</p>
                  <p className="text-2xl font-bold text-navy-900">{selectedRisk.impactValue}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">AI Confidence</p>
                  <p className="text-2xl font-bold text-accent-600">{selectedRisk.aiConfidence}%</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Detection Date</p>
                  <p className="font-medium text-navy-900">{selectedRisk.detectionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Expected Occurrence</p>
                  <p className="font-medium text-navy-900">{selectedRisk.expectedOccurrence}</p>
                </div>
              </div>

              {/* Affected Items */}
              <div>
                <h4 className="font-semibold text-navy-900 mb-3">Affected Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4 font-semibold text-sm">Item</th>
                        <th className="text-right py-2 px-4 font-semibold text-sm">Quantity</th>
                        <th className="text-left py-2 px-4 font-semibold text-sm">Required Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRisk.affectedItems.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-4">{item.name}</td>
                          <td className="py-2 px-4 text-right">{item.quantity.toLocaleString()}</td>
                          <td className="py-2 px-4">{item.requiredDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Business Impact */}
              <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-danger-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-danger-900 mb-1">Business Impact</p>
                    <p className="text-sm text-danger-800">{selectedRisk.businessImpact}</p>
                  </div>
                </div>
              </div>

              {/* AI Prediction */}
              <Card className="border-2 border-accent-500 bg-accent-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-900">
                    <Brain className="w-5 h-5 text-accent-600" />
                    AI Risk Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-accent-800">{selectedRisk.aiPrediction}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{selectedRisk.aiConfidence}% AI Confidence</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Actions */}
              <div>
                <h4 className="font-semibold text-navy-900 mb-3">Recommended Actions</h4>
                <div className="space-y-2">
                  {selectedRisk.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="primary" className="flex-1" onClick={() => handleMitigateRisk(selectedRisk)}>
                  <Shield className="w-4 h-4 mr-2" />
                  Mitigate Risk
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => handleCreateActionPlan(selectedRisk)}>
                  <Target className="w-4 h-4 mr-2" />
                  Create Action Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  )
}

export default RiskPrediction
