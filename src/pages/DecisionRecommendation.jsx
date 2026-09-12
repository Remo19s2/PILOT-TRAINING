import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { Target, Search, Filter, TrendingUp, CheckCircle, X, Send, Brain, BarChart3, ArrowRight, Eye, AlertTriangle, Lightbulb, Edit, User, Clock, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const DecisionRecommendation = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateRecommendations = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      alert('Recommendations generated successfully!')
    }, 2000)
  }

  const handleApprove = (decision) => {
    alert(`Decision ${decision.id} approved!`)
    setSelectedDecision(null)
  }

  const handleModify = (decision) => {
    alert(`Decision ${decision.id} sent for modification!`)
    setSelectedDecision(null)
  }

  const handleReject = (decision) => {
    alert(`Decision ${decision.id} rejected!`)
    setSelectedDecision(null)
  }

  const handleSendForFinance = (decision) => {
    alert(`Decision ${decision.id} sent for finance approval!`)
    setSelectedDecision(null)
  }

  // Decision & Recommendation Agent Data
  const decisions = [
    {
      id: 'DEC-001',
      title: 'Electronic Control Unit Supplier Selection',
      category: 'Electronics',
      priority: 'critical',
      status: 'pending',
      timestamp: '2024-01-12 14:30',
      
      // Problem Detected
      problem: 'Critical shortage of Electronic Control Units (ECU) with only 3,000 units available against requirement of 10,000 units. Production line stoppage risk if not procured by January 28, 2024.',
      
      // Root Cause Analysis
      rootCause: 'Combination of increased customer demand (15% above forecast) and supplier capacity constraints. Current primary supplier (TechCorp) operating at 95% capacity.',
      
      // Candidate Actions
      candidateActions: [
        {
          id: 1,
          action: 'Select Supplier A (TechCorp Industries)',
          cost: 970000,
          delivery: 14,
          quality: 95,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Highest quality and fastest delivery, but single-source dependency risk.',
        },
        {
          id: 2,
          action: 'Select Supplier C (AutoParts Premium)',
          cost: 910000,
          delivery: 12,
          quality: 90,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Fastest delivery and lower cost, but slightly lower quality score.',
        },
        {
          id: 3,
          action: 'Split order between Supplier A and Supplier C',
          cost: 940000,
          delivery: 13,
          quality: 93,
          risk: 'very low',
          productionImpact: 'minimal',
          tradeoffs: 'Balanced approach with reduced single-source dependency risk.',
        },
      ],
      
      // AI Recommended Decision
      recommendedAction: {
        action: 'Split order between Supplier A (TechCorp Industries) and Supplier C (AutoParts Premium)',
        aiConfidence: 94,
        expectedRiskReduction: '35%',
        expectedCostImpact: '+2.8%',
        reasoning: 'This approach balances cost, delivery speed, and risk reduction. Splitting the order reduces single-source dependency risk by 35% while maintaining quality standards. Although there is a 2.8% cost increase compared to lowest option, the risk reduction and supply chain resilience justify the additional cost.',
        risksReduced: ['Single supplier dependency', 'Production stoppage risk', 'Quality variance'],
        tradeoffs: 'Slightly higher cost (2.8%) but significantly lower risk profile. Delivery time is optimal at 13 days average.',
        nextSteps: ['Approve split order strategy', 'Allocate 60% to TechCorp Industries', 'Allocate 40% to AutoParts Premium', 'Set up milestone tracking for both suppliers'],
      },
    },
    {
      id: 'DEC-002',
      title: 'Steel Sheets Procurement Strategy',
      category: 'Raw Materials',
      priority: 'critical',
      status: 'pending',
      timestamp: '2024-01-12 11:00',
      
      problem: 'Critical shortage of Steel Sheets with only 450 units available against requirement of 30,000 units. Multiple assembly lines at risk of halt.',
      
      rootCause: 'Supplier (IndustrialX) showing performance decline with 82% on-time delivery rate and increased quality issues. Recent operational problems affecting capacity.',
      
      candidateActions: [
        {
          id: 1,
          action: 'Continue with IndustrialX Manufacturing',
          cost: 217500,
          delivery: 18,
          quality: 80,
          risk: 'high',
          productionImpact: 'high',
          tradeoffs: 'Lowest cost but high risk of delays and quality issues.',
        },
        {
          id: 2,
          action: 'Switch to Alternative Supplier (GlobalSupply)',
          cost: 262500,
          delivery: 25,
          quality: 70,
          risk: 'high',
          productionImpact: 'medium',
          tradeoffs: 'Higher cost and longer delivery, but diversifies supplier base.',
        },
        {
          id: 3,
          action: 'Split order between IndustrialX and GlobalSupply',
          cost: 240000,
          delivery: 21,
          quality: 75,
          risk: 'medium',
          productionImpact: 'medium',
          tradeoffs: 'Balanced approach with reduced risk but longer delivery time.',
        },
      ],
      
      recommendedAction: {
        action: 'Identify new supplier and split order (60% IndustrialX, 40% new supplier)',
        aiConfidence: 88,
        expectedRiskReduction: '25%',
        expectedCostImpact: '+5.2%',
        reasoning: 'IndustrialX performance decline requires immediate action. Splitting order reduces dependency while maintaining relationship. Need to identify new supplier with better performance metrics to replace IndustrialX long-term.',
        risksReduced: ['Single supplier dependency', 'Delivery delays', 'Quality issues'],
        tradeoffs: '5.2% cost increase and 3 days longer delivery, but significantly reduced risk profile.',
        nextSteps: ['Identify new suppliers', 'Conduct supplier evaluation', 'Split initial order', 'Phase out IndustrialX gradually'],
      },
    },
    {
      id: 'DEC-003',
      title: 'Circuit Board Procurement Decision',
      category: 'Electronics',
      priority: 'high',
      status: 'approved',
      timestamp: '2024-01-10 09:30',
      
      problem: 'Shortage of Circuit Boards Type B with 1,200 units available against requirement of 5,500 units. Customer order delays risk.',
      
      rootCause: 'Unexpected increase in customer orders for products requiring Type B circuit boards.',
      
      candidateActions: [
        {
          id: 1,
          action: 'Select TechCorp Industries',
          cost: 258000,
          delivery: 14,
          quality: 95,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'High quality but higher cost.',
        },
        {
          id: 2,
          action: 'Select AutoParts Premium',
          cost: 236500,
          delivery: 12,
          quality: 90,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Lower cost and faster delivery, slightly lower quality.',
        },
      ],
      
      recommendedAction: {
        action: 'Select AutoParts Premium for faster delivery',
        aiConfidence: 92,
        expectedRiskReduction: '15%',
        expectedCostImpact: '-8.3%',
        reasoning: 'AutoParts Premium offers faster delivery (12 days vs 14 days) and lower cost. Quality score of 90 is acceptable for this component. Cost savings of 8.3% and faster delivery justify the slight quality difference.',
        risksReduced: ['Customer order delays', 'Production bottlenecks'],
        tradeoffs: 'Slightly lower quality (90 vs 95) but significant cost and delivery benefits.',
        nextSteps: ['Approve AutoParts Premium selection', 'Place order immediately', 'Monitor quality closely'],
      },
    },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      modified: 'accent',
    }
    const labels = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      modified: 'Modified',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      critical: 'danger',
      high: 'warning',
      medium: 'primary',
      low: 'success',
    }
    return <Badge variant={variants[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>
  }

  const filteredDecisions = decisions.filter(decision => {
    const matchesSearch = decision.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         decision.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || decision.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Option Comparison Chart Data
  const optionComparisonData = [
    { option: 'Option 1', cost: 97, delivery: 14, quality: 95, risk: 20 },
    { option: 'Option 2', cost: 91, delivery: 12, quality: 90, risk: 20 },
    { option: 'Option 3', cost: 94, delivery: 13, quality: 93, risk: 10 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Decision & Recommendation Agent</h1>
          <p className="text-gray-600 mt-1">AI-powered decision support and recommendations</p>
        </div>
        <Button onClick={handleGenerateRecommendations} disabled={isGenerating}>
          <Brain className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Recommendations'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Decisions</p>
                <p className="text-2xl font-bold text-navy-900">{decisions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-warning-600">{decisions.filter(d => d.status === 'pending').length}</p>
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
                <p className="text-sm text-gray-600">Critical Priority</p>
                <p className="text-2xl font-bold text-danger-600">{decisions.filter(d => d.priority === 'critical').length}</p>
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
                <p className="text-sm text-gray-600">Avg AI Confidence</p>
                <p className="text-2xl font-bold text-navy-900">{Math.round(decisions.reduce((sum, d) => sum + d.recommendedAction.aiConfidence, 0) / decisions.length)}%</p>
              </div>
            </div>
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
                  placeholder="Search decision title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="modified">Modified</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDecisions.map((decision) => (
          <Card key={decision.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedDecision(decision)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{decision.title}</CardTitle>
                  <CardDescription>{decision.category}</CardDescription>
                </div>
                {getPriorityBadge(decision.priority)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{decision.timestamp}</span>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">AI Confidence</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent-600">{decision.recommendedAction.aiConfidence}%</span>
                  {getStatusBadge(decision.status)}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <span className="font-medium">Expected Impact:</span> {decision.recommendedAction.expectedCostImpact} cost, {decision.recommendedAction.expectedRiskReduction} risk reduction
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decision Detail Modal */}
      {selectedDecision && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedDecision.title}</CardTitle>
                  <CardDescription>{selectedDecision.id} • {selectedDecision.category} • {selectedDecision.timestamp}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(selectedDecision.priority)}
                  {getStatusBadge(selectedDecision.status)}
                  <Button variant="secondary" size="sm" onClick={() => setSelectedDecision(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Problem Detected */}
              <Card className="border-2 border-danger-200 bg-danger-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-danger-900">
                    <AlertTriangle className="w-5 h-5 text-danger-600" />
                    Problem Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-danger-800">{selectedDecision.problem}</p>
                </CardContent>
              </Card>

              {/* Root Cause Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Root Cause Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{selectedDecision.rootCause}</p>
                </CardContent>
              </Card>

              {/* Candidate Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedDecision.candidateActions.map((action) => (
                      <div key={action.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-navy-900">{action.action}</h4>
                          <Badge variant={action.id === 3 ? 'success' : 'default'}>
                            {action.id === 3 ? 'Recommended' : `Option ${action.id}`}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Cost</span>
                            <p className="font-medium">₹{action.cost.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Delivery</span>
                            <p className="font-medium">{action.delivery} days</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Quality</span>
                            <p className="font-medium">{action.quality}/100</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Risk</span>
                            <p className="font-medium capitalize">{action.risk}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Impact</span>
                            <p className="font-medium capitalize">{action.productionImpact}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{action.tradeoffs}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Option Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Option Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={optionComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="option" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#3367d6" name="Cost (₹K)" />
                      <Bar dataKey="delivery" fill="#22c55e" name="Delivery (Days)" />
                      <Bar dataKey="quality" fill="#f59e0b" name="Quality Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AI Recommended Decision */}
              <Card className="border-2 border-accent-500 bg-accent-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-900">
                    <Brain className="w-5 h-5 text-accent-600" />
                    AI Recommended Decision
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-accent-200">
                    <p className="font-semibold text-accent-900 mb-2">{selectedDecision.recommendedAction.action}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">AI Confidence</span>
                        <p className="text-xl font-bold text-accent-600">{selectedDecision.recommendedAction.aiConfidence}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Risk Reduction</span>
                        <p className="text-xl font-bold text-success-600">{selectedDecision.recommendedAction.expectedRiskReduction}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cost Impact</span>
                        <p className={`text-xl font-bold ${selectedDecision.recommendedAction.expectedCostImpact.startsWith('-') ? 'text-success-600' : 'text-danger-600'}`}>
                          {selectedDecision.recommendedAction.expectedCostImpact}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent-900 mb-2">AI Reasoning</h4>
                    <p className="text-sm text-accent-800">{selectedDecision.recommendedAction.reasoning}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-accent-900 mb-2">Risks Reduced</h4>
                      <ul className="space-y-1">
                        {selectedDecision.recommendedAction.risksReduced.map((risk, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-accent-800">
                            <CheckCircle className="w-4 h-4 text-success-600" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-accent-900 mb-2">Trade-offs</h4>
                      <p className="text-sm text-accent-800">{selectedDecision.recommendedAction.tradeoffs}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent-900 mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {selectedDecision.recommendedAction.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-accent-800">
                          <ArrowRight className="w-4 h-4 text-accent-600" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Human Decision Notice */}
              <Card className="border-2 border-primary-500 bg-primary-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary-900 mb-1">Human Final Decision</p>
                      <p className="text-sm text-primary-800">AI provides recommendations based on data analysis, but humans make the final decision. Please review the recommendation and take appropriate action.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {selectedDecision.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="success" className="flex-1" onClick={() => handleApprove(selectedDecision)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Recommendation
                  </Button>
                  <Button variant="warning" className="flex-1" onClick={() => handleModify(selectedDecision)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Modify Recommendation
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleReject(selectedDecision)}>
                    <X className="w-4 h-4 mr-2" />
                    Reject Recommendation
                  </Button>
                </div>
              )}

              {selectedDecision.status === 'pending' && (
                <Button variant="secondary" className="w-full" onClick={() => handleSendForFinance(selectedDecision)}>
                  <Send className="w-4 h-4 mr-2" />
                  Send for Finance Approval
                </Button>
              )}
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  )
}

export default DecisionRecommendation
