import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Brain, Target, CheckCircle, AlertTriangle, TrendingUp, ArrowRight, Zap, BarChart3, Lightbulb, FileText, Clock, DollarSign, Shield, User, Send, Edit, X } from 'lucide-react'

const AIDecisionCenter = () => {
  const [selectedDecision, setSelectedDecision] = useState(null)

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
      problem: 'Critical shortage of Electronic Control Units (ECU) required for Q1 production. Current inventory will be depleted in 5 days, risking production line stoppage and customer order delays.',
      
      // Root Cause Analysis
      rootCause: 'Combination of increased customer demand (15% above forecast), supplier delivery delays from TechCorp, and insufficient safety stock levels. Historical data shows similar pattern in Q4 2023.',
      
      // Candidate Actions
      candidateActions: [
        {
          id: 1,
          action: 'Select Supplier A (TechCorp Industries)',
          cost: 125000,
          delivery: 14,
          quality: 95,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Highest quality and fastest delivery, but premium pricing',
        },
        {
          id: 2,
          action: 'Select Supplier C (AutoParts Premium)',
          cost: 132000,
          delivery: 12,
          quality: 90,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Fastest delivery but higher cost and slightly lower quality',
        },
        {
          id: 3,
          action: 'Split order between Supplier A and Supplier C',
          cost: 128500,
          delivery: 13,
          quality: 93,
          risk: 'very low',
          productionImpact: 'minimal',
          tradeoffs: 'Balanced approach with reduced single-source dependency',
        },
      ],
      
      // AI Recommended Decision
      recommendedAction: {
        action: 'Split order between Supplier A (TechCorp Industries) and Supplier C (AutoParts Premium)',
        aiConfidence: 94,
        expectedRiskReduction: '35%',
        expectedCostImpact: '+2.8%',
        reasoning: 'This approach balances cost, delivery speed, and risk reduction. By splitting the order, we reduce single-source dependency risk while maintaining quality standards and meeting the critical delivery timeline.',
        risksReduced: ['Single supplier dependency', 'Production stoppage risk', 'Quality variance'],
        tradeoffs: 'Slightly higher cost (2.8%) but significantly lower risk profile and better supply chain resilience',
        nextSteps: [
          'Approve split order strategy',
          'Allocate 60% to TechCorp Industries',
          'Allocate 40% to AutoParts Premium',
          'Set up milestone tracking for both suppliers',
        ],
      },
    },
  ]

  const getPriorityBadge = (priority) => {
    const variants = {
      critical: 'danger',
      high: 'warning',
      medium: 'primary',
      low: 'success',
    }
    return <Badge variant={variants[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'default',
      in_progress: 'primary',
      completed: 'success',
      rejected: 'danger',
    }
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      rejected: 'Rejected',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      'very low': 'success',
    }
    return <Badge variant={variants[risk]}>{risk.charAt(0).toUpperCase() + risk.slice(1)}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">AI Decision Center</h1>
          <p className="text-gray-600 mt-1">Decision & Recommendation Agent - AI-powered procurement decisions</p>
        </div>
        <Button>
          <Brain className="w-4 h-4 mr-2" />
          Run Analysis
        </Button>
      </div>

      {/* AI-Human Collaboration Notice */}
      <Card className="border-2 border-accent-500 bg-accent-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-accent-600" />
            <div>
              <p className="font-semibold text-accent-900">AI-Assisted Decision Making</p>
              <p className="text-sm text-accent-800">AI provides recommendations based on comprehensive analysis. Humans make the final decision.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.map((decision) => (
          <Card key={decision.id} className={decision.priority === 'critical' ? 'border-2 border-danger-500' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{decision.title}</CardTitle>
                    {getPriorityBadge(decision.priority)}
                    {getStatusBadge(decision.status)}
                  </div>
                  <CardDescription>{decision.category} • {decision.id} • {decision.timestamp}</CardDescription>
                </div>
                <Badge variant="accent">{decision.recommendedAction.aiConfidence}% AI Confidence</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 1. Problem Detected */}
              <Card className="bg-danger-50 border-danger-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-danger-900">
                    <AlertTriangle className="w-5 h-5 text-danger-600" />
                    Problem Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-danger-800">{decision.problem}</p>
                </CardContent>
              </Card>

              {/* 2. Root Cause Analysis */}
              <Card className="bg-warning-50 border-warning-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-warning-900">
                    <Lightbulb className="w-5 h-5 text-warning-600" />
                    Root Cause Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-warning-800">{decision.rootCause}</p>
                </CardContent>
              </Card>

              {/* 3. Candidate Actions */}
              <div>
                <h4 className="font-semibold text-navy-900 mb-3">Candidate Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {decision.candidateActions.map((action) => (
                    <Card key={action.id} className="border-2 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-navy-900">Option {action.id}</h5>
                          {getRiskBadge(action.risk)}
                        </div>
                        <p className="text-sm text-gray-700 mb-3 font-medium">{action.action}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Cost</span>
                            <span className="font-medium">${action.cost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Delivery</span>
                            <span className="font-medium">{action.delivery} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Quality</span>
                            <span className="font-medium">{action.quality}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Production Impact</span>
                            <span className="font-medium">{action.productionImpact}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">{action.tradeoffs}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 4. Option Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Option Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-semibold">Metric</th>
                          <th className="text-center py-2 px-3 font-semibold">Option 1</th>
                          <th className="text-center py-2 px-3 font-semibold">Option 2</th>
                          <th className="text-center py-2 px-3 font-semibold">Option 3</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-medium">Cost</td>
                          <td className="text-center py-2 px-3">${decision.candidateActions[0].cost.toLocaleString()}</td>
                          <td className="text-center py-2 px-3">${decision.candidateActions[1].cost.toLocaleString()}</td>
                          <td className="text-center py-2 px-3">${decision.candidateActions[2].cost.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-medium">Delivery</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[0].delivery} days</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[1].delivery} days</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[2].delivery} days</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-medium">Quality</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[0].quality}</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[1].quality}</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[2].quality}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-3 font-medium">Risk</td>
                          <td className="text-center py-2 px-3">{getRiskBadge(decision.candidateActions[0].risk)}</td>
                          <td className="text-center py-2 px-3">{getRiskBadge(decision.candidateActions[1].risk)}</td>
                          <td className="text-center py-2 px-3">{getRiskBadge(decision.candidateActions[2].risk)}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-medium">Production Impact</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[0].productionImpact}</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[1].productionImpact}</td>
                          <td className="text-center py-2 px-3">{decision.candidateActions[2].productionImpact}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* 5. AI Recommended Decision */}
              <Card className="border-2 border-success-500 bg-success-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-success-900">
                    <Brain className="w-6 h-6 text-success-600" />
                    AI Recommended Decision
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-500">Recommended Action</p>
                      <p className="text-sm font-semibold text-navy-900 mt-1">{decision.recommendedAction.action}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-500">AI Confidence</p>
                      <p className="text-2xl font-bold text-success-600 mt-1">{decision.recommendedAction.aiConfidence}%</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-500">Expected Risk Reduction</p>
                      <p className="text-2xl font-bold text-success-600 mt-1">{decision.recommendedAction.expectedRiskReduction}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-500">Expected Cost Impact</p>
                      <p className="text-2xl font-bold text-warning-600 mt-1">{decision.recommendedAction.expectedCostImpact}</p>
                    </div>
                  </div>

                  {/* 6. AI Explanation */}
                  <div className="p-4 bg-white rounded-lg border border-success-200">
                    <h4 className="font-semibold text-success-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      AI Explanation
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">{decision.recommendedAction.reasoning}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Risks Reduced:</p>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                          {decision.recommendedAction.risksReduced.map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Trade-offs:</p>
                        <p className="text-sm text-gray-700">{decision.recommendedAction.tradeoffs}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button variant="success" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Recommendation
                    </Button>
                    <Button variant="warning" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Modify Recommendation
                    </Button>
                    <Button variant="danger" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Reject Recommendation
                    </Button>
                    <Button variant="primary" className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Send for Finance Approval
                    </Button>
                  </div>

                  {/* Human Decision Notice */}
                  <div className="p-3 bg-accent-100 rounded-lg border border-accent-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-accent-600" />
                      <p className="text-xs text-accent-800">
                        <strong>Human Final Decision:</strong> AI provides recommendations based on data analysis. The final decision rests with the procurement manager.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AIDecisionCenter
