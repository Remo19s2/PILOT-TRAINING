import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Brain, Target, CheckCircle, AlertTriangle, TrendingUp, ArrowRight, Zap, BarChart3, Lightbulb, FileText, Clock, DollarSign, Shield, User, Send, Edit, X, Sparkles, Check } from 'lucide-react'

const AIDecisionCenter = () => {
  const [decisions, setDecisions] = useState([
    {
      id: 'DEC-001',
      title: 'Electronic Control Unit Supplier Selection',
      category: 'Electronics',
      priority: 'critical',
      status: 'pending',
      timestamp: 'Today, 14:30',
      
      // Problem Detected
      problem: 'Critical shortage of Electronic Control Units (ECU) required for Q1 production. Current inventory will deplete in 5 days, risking line stoppage.',
      
      // Root Cause Analysis
      rootCause: 'Surge in Q1 production run (+15% above forecast), supplier delivery delays from TechCorp, and depleted safety stock buffer.',
      
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
        reasoning: 'Balances cost, delivery cadence, and risk mitigation. Reduces single-source dependency risk while maintaining high QA standards and meeting the 14-day production window.',
        risksReduced: ['Single supplier dependency', 'Production stoppage risk', 'Quality variance'],
        tradeoffs: 'Slightly higher unit cost (+2.8%) with significantly reduced supply shock vulnerability.',
        nextSteps: [
          'Approve split order strategy (60% TechCorp / 40% AutoParts)',
          'Issue expedited PO allocations to both vendors',
          'Set up automated lead-time milestone monitoring'
        ],
      },
    },
  ])

  const [notification, setNotification] = useState(null)

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleApprove = (decId) => {
    setDecisions(prev => prev.map(d => d.id === decId ? { ...d, status: 'completed' } : d))
    showNotification(`✅ Recommendation approved for ${decId}. Purchase order draft created.`)
  }

  const handleModify = (decId) => {
    showNotification(`ℹ️ Decision ${decId} queued for parameter adjustments.`, 'info')
  }

  const handleReject = (decId) => {
    setDecisions(prev => prev.map(d => d.id === decId ? { ...d, status: 'rejected' } : d))
    showNotification(`❌ Decision ${decId} rejected.`, 'error')
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      critical: 'danger',
      high: 'warning',
      medium: 'primary',
      low: 'success',
    }
    return <Badge variant={variants[priority]} className="text-[10px]">{priority.toUpperCase()}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'default',
      in_progress: 'primary',
      completed: 'success',
      rejected: 'danger',
    }
    const labels = {
      pending: 'Pending Review',
      in_progress: 'In Progress',
      completed: 'Approved & Executed',
      rejected: 'Declined',
    }
    return <Badge variant={variants[status]} className="text-[10px]">{labels[status] || status}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      'very low': 'success',
    }
    return <Badge variant={variants[risk]} className="text-[10px]">{risk.toUpperCase()}</Badge>
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between shadow-2xs ${
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          notification.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
          'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span>{notification.msg}</span>
          <button onClick={() => setNotification(null)} className="underline text-[11px] ml-4">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Prescriptive AI Decision Center
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Autonomous multi-objective optimization, candidate trade-off matrix & human-in-the-loop sign-off
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="accent" className="text-xs bg-purple-50 text-purple-800 border-purple-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Claude & Gemini Co-Pilot Active
          </Badge>
        </div>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.map((decision) => (
          <Card key={decision.id} className="border border-gray-200 shadow-2xs bg-white">
            <CardHeader className="p-4 border-b border-gray-100 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-navy-900">{decision.title}</h2>
                    {getPriorityBadge(decision.priority)}
                    {getStatusBadge(decision.status)}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {decision.category} &bull; {decision.id} &bull; {decision.timestamp}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    {decision.recommendedAction.aiConfidence}% AI Confidence
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Problem & Root Cause 2-column strip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-red-50/60 border border-red-200">
                  <span className="text-[11px] font-bold text-red-900 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Problem Detected
                  </span>
                  <p className="text-xs text-red-800 leading-relaxed">{decision.problem}</p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    Root Cause Analysis
                  </span>
                  <p className="text-xs text-amber-800 leading-relaxed">{decision.rootCause}</p>
                </div>
              </div>

              {/* Candidate Actions 3-card grid */}
              <div>
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Candidate Strategies Analyzed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {decision.candidateActions.map((action) => (
                    <div
                      key={action.id}
                      className={`p-3 rounded-xl border transition-all ${
                        action.id === 3
                          ? 'bg-purple-50/40 border-purple-300 ring-1 ring-purple-300'
                          : 'bg-gray-50/70 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-navy-900">
                          Option {action.id} {action.id === 3 && '★ AI Choice'}
                        </span>
                        {getRiskBadge(action.risk)}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mb-2">{action.action}</p>

                      <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-white p-2 rounded-lg border border-gray-100">
                        <div>
                          <span className="text-gray-400 block text-[10px]">Cost</span>
                          <span className="font-bold text-gray-800">₹{action.cost.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Lead Time</span>
                          <span className="font-bold text-blue-700">{action.delivery} Days</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">QA Score</span>
                          <span className="font-bold text-emerald-700">{action.quality}/100</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Impact</span>
                          <span className="font-bold text-gray-700">{action.productionImpact}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 italic line-clamp-1">{action.tradeoffs}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option Comparison Matrix Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold text-gray-600">Comparison Metric</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-600">Option 1 (TechCorp)</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-600">Option 2 (AutoParts)</th>
                      <th className="text-center py-2 px-3 font-semibold text-purple-900 bg-purple-50/70">Option 3 (Split Strategy)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2 px-3 font-medium text-gray-600">Cost Impact</td>
                      <td className="text-center py-2 px-3">₹{decision.candidateActions[0].cost.toLocaleString()}</td>
                      <td className="text-center py-2 px-3">₹{decision.candidateActions[1].cost.toLocaleString()}</td>
                      <td className="text-center py-2 px-3 font-bold text-purple-900 bg-purple-50/30">₹{decision.candidateActions[2].cost.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-gray-600">Delivery Lead Time</td>
                      <td className="text-center py-2 px-3">{decision.candidateActions[0].delivery} days</td>
                      <td className="text-center py-2 px-3">{decision.candidateActions[1].delivery} days</td>
                      <td className="text-center py-2 px-3 font-bold text-purple-900 bg-purple-50/30">{decision.candidateActions[2].delivery} days</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-gray-600">Quality Score</td>
                      <td className="text-center py-2 px-3">{decision.candidateActions[0].quality}/100</td>
                      <td className="text-center py-2 px-3">{decision.candidateActions[1].quality}/100</td>
                      <td className="text-center py-2 px-3 font-bold text-emerald-700 bg-purple-50/30">{decision.candidateActions[2].quality}/100</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-gray-600">Supply Shock Risk</td>
                      <td className="text-center py-2 px-3">{getRiskBadge(decision.candidateActions[0].risk)}</td>
                      <td className="text-center py-2 px-3">{getRiskBadge(decision.candidateActions[1].risk)}</td>
                      <td className="text-center py-2 px-3 bg-purple-50/30">{getRiskBadge(decision.candidateActions[2].risk)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Prescriptive Recommendation Banner */}
              <div className="p-4 rounded-xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-2xs">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">
                        Prescribed Strategy: {decision.recommendedAction.action}
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        {decision.recommendedAction.reasoning}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 block">Risk Reduction</span>
                      <span className="text-sm font-extrabold text-emerald-700">{decision.recommendedAction.expectedRiskReduction}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 block">Cost Delta</span>
                      <span className="text-sm font-extrabold text-amber-700">{decision.recommendedAction.expectedCostImpact}</span>
                    </div>
                  </div>
                </div>

                {/* Human in the loop action buttons */}
                {decision.status === 'pending' && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(decision.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Approve & Execute PO
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleModify(decision.id)}
                      className="text-xs font-semibold h-8"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Modify Parameters
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReject(decision.id)}
                      className="text-red-600 hover:bg-red-50 text-xs font-semibold h-8"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AIDecisionCenter
