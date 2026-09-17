import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Target, Search, Filter, TrendingUp, CheckCircle, X, Send, Brain, BarChart3, ArrowRight, Eye, AlertTriangle, Lightbulb, Edit, User, Clock, DollarSign, Sparkles, Check } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DecisionRecommendation = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleGenerateRecommendations = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      showNotification('✅ Fresh AI recommendations computed across open shortfalls.')
    }, 1200)
  }

  const handleApprove = (decision) => {
    setDecisions(prev => prev.map(d => d.id === decision.id ? { ...d, status: 'approved' } : d))
    showNotification(`✅ Decision ${decision.id} approved! Order dispatched.`)
    setSelectedDecision(null)
  }

  const handleModify = (decision) => {
    showNotification(`ℹ️ Decision ${decision.id} queued for parameter adjustments.`, 'info')
    setSelectedDecision(null)
  }

  const handleReject = (decision) => {
    setDecisions(prev => prev.map(d => d.id === decision.id ? { ...d, status: 'rejected' } : d))
    showNotification(`❌ Decision ${decision.id} declined.`, 'error')
    setSelectedDecision(null)
  }

  const handleSendForFinance = (decision) => {
    showNotification(`📩 Decision ${decision.id} submitted for executive finance sign-off.`)
    setSelectedDecision(null)
  }

  // Decision Data
  const [decisions, setDecisions] = useState([
    {
      id: 'DEC-001',
      title: 'Electronic Control Unit Supplier Selection',
      category: 'Electronics',
      priority: 'critical',
      status: 'pending',
      timestamp: 'Today, 14:30',
      
      problem: 'Critical shortage of Electronic Control Units (ECU) with only 3,000 units available against 10,000 required. Line halt risk in 5 days.',
      rootCause: 'Surge in Q1 orders (+15% vs forecast) and primary supplier capacity ceiling.',
      
      candidateActions: [
        {
          id: 1,
          action: 'Select TechCorp Industries',
          cost: 970000,
          delivery: 14,
          quality: 95,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Highest quality and fast delivery; single-source exposure.',
        },
        {
          id: 2,
          action: 'Select AutoParts Premium',
          cost: 910000,
          delivery: 12,
          quality: 90,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Fastest delivery and lower cost, slightly lower QA rating.',
        },
        {
          id: 3,
          action: 'Split order between TechCorp (60%) and AutoParts (40%)',
          cost: 940000,
          delivery: 13,
          quality: 93,
          risk: 'very low',
          productionImpact: 'minimal',
          tradeoffs: 'Optimal resilience and dual-source buffer.',
        },
      ],
      
      recommendedAction: {
        action: 'Split order between TechCorp (60%) and AutoParts (40%)',
        aiConfidence: 94,
        expectedRiskReduction: '35%',
        expectedCostImpact: '+2.8%',
        reasoning: 'Reduces single-supplier shock exposure by 35% while sustaining strict QA thresholds and fulfilling critical 14-day production deadlines.',
        risksReduced: ['Single supplier dependency', 'Production stoppage risk', 'Quality variance'],
        tradeoffs: 'Nominal 2.8% cost increase against lowest bid, offset by zero assembly disruption risk.',
        nextSteps: ['Approve dual-allocation PO', 'Dispatch binding contracts', 'Enable telemetry milestones'],
      },
    },
    {
      id: 'DEC-002',
      title: 'Steel Sheets Procurement Strategy',
      category: 'Raw Materials',
      priority: 'critical',
      status: 'pending',
      timestamp: 'Today, 11:00',
      
      problem: 'Shortage of Steel Sheets with only 450 units on hand vs requirement of 30,000 units.',
      rootCause: 'Primary vendor performance slump (82% on-time rate) and production bottlenecks.',
      
      candidateActions: [
        {
          id: 1,
          action: 'Continue with IndustrialX Manufacturing',
          cost: 217500,
          delivery: 18,
          quality: 80,
          risk: 'high',
          productionImpact: 'high',
          tradeoffs: 'Lowest cost but high delay risk.',
        },
        {
          id: 2,
          action: 'Switch to GlobalSupply',
          cost: 262500,
          delivery: 25,
          quality: 70,
          risk: 'high',
          productionImpact: 'medium',
          tradeoffs: 'Higher cost, longer lead time.',
        },
        {
          id: 3,
          action: 'Split order between IndustrialX and GlobalSupply',
          cost: 240000,
          delivery: 21,
          quality: 75,
          risk: 'medium',
          productionImpact: 'medium',
          tradeoffs: 'Mitigates supplier concentration.',
        },
      ],
      
      recommendedAction: {
        action: 'Split order (60% IndustrialX, 40% GlobalSupply) with milestone audit',
        aiConfidence: 88,
        expectedRiskReduction: '25%',
        expectedCostImpact: '+5.2%',
        reasoning: 'Isolates supplier decline while preventing sudden single-source cutoff during peak assembly cycle.',
        risksReduced: ['Supply interruption', 'Lead time uncertainty'],
        tradeoffs: '+5.2% premium with controlled risk exposure.',
        nextSteps: ['Qualify secondary batch', 'Audit IndustrialX QA line'],
      },
    },
    {
      id: 'DEC-003',
      title: 'Circuit Board Type B Allocation',
      category: 'Electronics',
      priority: 'high',
      status: 'approved',
      timestamp: 'Yesterday, 09:30',
      
      problem: 'Requirement of 5,500 units vs 1,200 in stock.',
      rootCause: 'Sudden demand ramp-up from Q1 sales sprint.',
      
      candidateActions: [
        {
          id: 1,
          action: 'Select TechCorp Industries',
          cost: 258000,
          delivery: 14,
          quality: 95,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Premium pricing.',
        },
        {
          id: 2,
          action: 'Select AutoParts Premium',
          cost: 236500,
          delivery: 12,
          quality: 90,
          risk: 'low',
          productionImpact: 'minimal',
          tradeoffs: 'Fast turnaround, 8.3% lower cost.',
        },
      ],
      
      recommendedAction: {
        action: 'Select AutoParts Premium for expedited 12-day delivery',
        aiConfidence: 92,
        expectedRiskReduction: '15%',
        expectedCostImpact: '-8.3%',
        reasoning: 'Fastest delivery with 8.3% direct cost reduction meets production cutoff with acceptable QA score.',
        risksReduced: ['Production bottleneck', 'Excessive premium expense'],
        tradeoffs: 'QA score 90 vs 95.',
        nextSteps: ['PO executed', 'Delivery scheduled'],
      },
    },
  ])

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      modified: 'accent',
    }
    const labels = {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Declined',
      modified: 'Modified',
    }
    return <Badge variant={variants[status]} className="text-[10px]">{labels[status] || status}</Badge>
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

  const filteredDecisions = decisions.filter(decision => {
    const matchesSearch = decision.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         decision.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || decision.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const optionComparisonData = [
    { option: 'Option 1', cost: 97, delivery: 14, quality: 95 },
    { option: 'Option 2', cost: 91, delivery: 12, quality: 90 },
    { option: 'Option 3', cost: 94, delivery: 13, quality: 93 },
  ]

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
            Decision & Prescriptive Recommendations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Multi-criteria procurement trade-off models and autonomous candidate optimization
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleGenerateRecommendations}
          disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold h-8 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          {isGenerating ? 'Analyzing...' : 'Re-run Prescriptive AI'}
        </Button>
      </div>

      {/* Compact Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500 block">Total Decisions</span>
          <p className="text-xl font-bold text-navy-900 mt-0.5">{decisions.length}</p>
        </div>
        <div className="p-3 bg-white border border-amber-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-amber-700 block">Pending Review</span>
          <p className="text-xl font-bold text-amber-600 mt-0.5">{decisions.filter(d => d.status === 'pending').length}</p>
        </div>
        <div className="p-3 bg-white border border-red-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-red-700 block">Critical Priority</span>
          <p className="text-xl font-bold text-red-600 mt-0.5">{decisions.filter(d => d.priority === 'critical').length}</p>
        </div>
        <div className="p-3 bg-white border border-purple-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-purple-700 block">Avg AI Confidence</span>
          <p className="text-xl font-bold text-purple-700 mt-0.5">
            {Math.round(decisions.reduce((sum, d) => sum + d.recommendedAction.aiConfidence, 0) / decisions.length)}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search decision title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Declined</option>
          </Select>
        </div>
      </div>

      {/* Decisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDecisions.map((decision) => (
          <Card
            key={decision.id}
            className="border border-gray-200 hover:border-blue-400 transition-all hover:shadow-md cursor-pointer bg-white"
            onClick={() => setSelectedDecision(decision)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-navy-900 truncate">{decision.title}</h3>
                  <p className="text-[11px] text-gray-500">{decision.category} &bull; {decision.id}</p>
                </div>
                {getPriorityBadge(decision.priority)}
              </div>

              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">AI Recommendation</span>
                  <span className="text-xs font-bold text-navy-900 line-clamp-1">{decision.recommendedAction.action}</span>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 shrink-0 ml-2">
                  {decision.recommendedAction.aiConfidence}%
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                {getStatusBadge(decision.status)}
                <span className="text-blue-600 font-semibold text-[11px] flex items-center gap-1 hover:underline">
                  Inspect Trade-offs
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decision Detail Modal */}
      {selectedDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-200">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-navy-900">{selectedDecision.title}</h2>
                  {getPriorityBadge(selectedDecision.priority)}
                  {getStatusBadge(selectedDecision.status)}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {selectedDecision.id} &bull; {selectedDecision.category} &bull; {selectedDecision.timestamp}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDecision(null)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-5 space-y-4">
              {/* Problem / Root Cause */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs">
                  <span className="font-bold text-red-900 block mb-1 uppercase tracking-wider text-[10px]">
                    Identified Shortage
                  </span>
                  <p className="text-red-800">{selectedDecision.problem}</p>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
                  <span className="font-bold text-amber-900 block mb-1 uppercase tracking-wider text-[10px]">
                    Root Cause
                  </span>
                  <p className="text-amber-800">{selectedDecision.rootCause}</p>
                </div>
              </div>

              {/* Candidate Strategies */}
              <div>
                <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Strategy Options Evaluated
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedDecision.candidateActions.map(action => (
                    <div
                      key={action.id}
                      className={`p-3 rounded-xl border text-xs ${
                        action.id === 3 ? 'bg-purple-50/50 border-purple-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <span className="font-bold text-navy-900 block mb-1">
                        Option {action.id} {action.id === 3 && '★ AI Choice'}
                      </span>
                      <p className="text-gray-700 font-medium mb-2">{action.action}</p>
                      <div className="space-y-1 text-[11px] bg-white p-2 rounded-lg border border-gray-100">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Cost:</span>
                          <span className="font-bold">₹{action.cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delivery:</span>
                          <span className="font-bold text-blue-700">{action.delivery} Days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">QA Score:</span>
                          <span className="font-bold text-emerald-700">{action.quality}/100</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation Box */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-emerald-700" />
                    AI Prescriptive Recommendation
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {selectedDecision.recommendedAction.aiConfidence}% Confidence
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-900">{selectedDecision.recommendedAction.action}</p>
                <p className="text-xs text-emerald-800 leading-relaxed">{selectedDecision.recommendedAction.reasoning}</p>
              </div>

              {/* Action Buttons */}
              {selectedDecision.status === 'pending' && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(selectedDecision)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Approve & Issue PO
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleModify(selectedDecision)}
                    className="text-xs font-semibold h-8"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Modify
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReject(selectedDecision)}
                    className="text-red-600 hover:bg-red-50 text-xs font-semibold h-8"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendForFinance(selectedDecision)}
                    className="text-xs font-semibold h-8 ml-auto"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Finance Sign-off
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DecisionRecommendation
