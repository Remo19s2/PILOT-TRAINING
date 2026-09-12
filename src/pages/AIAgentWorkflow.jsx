import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Network, Brain, Package, Users, AlertTriangle, Target, TrendingUp, Bell, CheckCircle, Clock, ArrowRight, Play, Pause, RefreshCw, Zap, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const AIAgentWorkflow = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)

  // Master Procurement Agent Orchestration Data
  const workflows = [
    {
      id: 'WF-001',
      title: 'Steel Sheets Procurement - Critical Shortage',
      status: 'active',
      priority: 'critical',
      startTime: '2024-01-12 14:00',
      estimatedCompletion: '2024-01-12 16:00',
      progress: 65,
      
      // Agent Execution Flow
      agentSequence: [
        {
          agent: 'Planning & Inventory Agent',
          icon: Package,
          status: 'completed',
          startTime: '14:00',
          endTime: '14:15',
          output: {
            demand: 28000,
            shortage: 27550,
            urgency: 'critical',
            procurementQuantity: 30000,
          },
        },
        {
          agent: 'Supplier Intelligence Agent',
          icon: Users,
          status: 'completed',
          startTime: '14:15',
          endTime: '14:30',
          output: {
            recommendedSupplier: 'IndustrialX Manufacturing',
            alternatives: ['PrimeMfg Solutions', 'AutoParts Premium'],
            priceAnalysis: '$85,000 - $95,000',
            capacityAssessment: 'Limited capacity, high demand',
          },
        },
        {
          agent: 'Risk Prediction Agent',
          icon: AlertTriangle,
          status: 'completed',
          startTime: '14:30',
          endTime: '14:45',
          output: {
            overallRisk: 'high',
            deliveryRisk: 78,
            capacityRisk: 65,
            businessImpact: 'Production line stoppage in 5 days',
          },
        },
        {
          agent: 'Decision & Recommendation Agent',
          icon: Target,
          status: 'in_progress',
          startTime: '14:45',
          endTime: null,
          output: {
            recommendedAction: 'Split order between IndustrialX and PrimeMfg',
            confidence: 92,
            reasoning: 'Balances cost, delivery, and risk',
          },
        },
        {
          agent: 'Negotiation Agent',
          icon: TrendingUp,
          status: 'pending',
          startTime: null,
          endTime: null,
          output: null,
        },
        {
          agent: 'Monitoring & Alert Agent',
          icon: Bell,
          status: 'pending',
          startTime: null,
          endTime: null,
          output: null,
        },
      ],
      
      // Master Agent Coordination
      masterAgentActions: [
        { time: '14:00', action: 'Triggered Planning & Inventory Agent', type: 'trigger' },
        { time: '14:15', action: 'Received inventory analysis', type: 'receive' },
        { time: '14:15', action: 'Triggered Supplier Intelligence Agent', type: 'trigger' },
        { time: '14:30', action: 'Received supplier analysis', type: 'receive' },
        { time: '14:30', action: 'Triggered Risk Prediction Agent', type: 'trigger' },
        { time: '14:45', action: 'Received risk analysis', type: 'receive' },
        { time: '14:45', action: 'Triggered Decision & Recommendation Agent', type: 'trigger' },
        { time: '14:55', action: 'Awaiting recommendation output', type: 'wait' },
      ],
      
      // Aggregated Output
      aggregatedOutput: {
        recommendation: 'Split order between IndustrialX (60%) and PrimeMfg (40%)',
        expectedCost: '$90,000',
        expectedDelivery: '22 days',
        riskLevel: 'medium',
        confidence: 92,
        nextSteps: [
          'Await decision agent final recommendation',
          'Trigger negotiation agent upon approval',
          'Set up monitoring for order execution',
        ],
      },
    },
    {
      id: 'WF-002',
      title: 'Circuit Boards Supplier Selection',
      status: 'completed',
      priority: 'high',
      startTime: '2024-01-11 10:00',
      estimatedCompletion: '2024-01-11 11:30',
      progress: 100,
      
      agentSequence: [
        {
          agent: 'Planning & Inventory Agent',
          icon: Package,
          status: 'completed',
          startTime: '10:00',
          endTime: '10:15',
          output: {
            demand: 5500,
            shortage: 4300,
            urgency: 'high',
            procurementQuantity: 5000,
          },
        },
        {
          agent: 'Supplier Intelligence Agent',
          icon: Users,
          status: 'completed',
          startTime: '10:15',
          endTime: '10:30',
          output: {
            recommendedSupplier: 'TechCorp Industries',
            alternatives: ['GlobalSupply Co.'],
            priceAnalysis: '$220,000 - $245,000',
          },
        },
        {
          agent: 'Risk Prediction Agent',
          icon: AlertTriangle,
          status: 'completed',
          startTime: '10:30',
          endTime: '10:45',
          output: {
            overallRisk: 'medium',
            deliveryRisk: 45,
            businessImpact: 'Customer order delay',
          },
        },
        {
          agent: 'Decision & Recommendation Agent',
          icon: Target,
          status: 'completed',
          startTime: '10:45',
          endTime: '11:00',
          output: {
            recommendedAction: 'Select TechCorp Industries',
            confidence: 88,
          },
        },
        {
          agent: 'Negotiation Agent',
          icon: TrendingUp,
          status: 'completed',
          startTime: '11:00',
          endTime: '11:15',
          output: {
            targetPrice: '$225,000',
            strategy: 'Volume discount negotiation',
          },
        },
        {
          agent: 'Monitoring & Alert Agent',
          icon: Bell,
          status: 'completed',
          startTime: '11:15',
          endTime: '11:30',
          output: {
            monitoringSetup: 'Delivery tracking activated',
            alertsConfigured: true,
          },
        },
      ],
      
      masterAgentActions: [
        { time: '10:00', action: 'Triggered Planning & Inventory Agent', type: 'trigger' },
        { time: '10:15', action: 'Triggered Supplier Intelligence Agent', type: 'trigger' },
        { time: '10:30', action: 'Triggered Risk Prediction Agent', type: 'trigger' },
        { time: '10:45', action: 'Triggered Decision & Recommendation Agent', type: 'trigger' },
        { time: '11:00', action: 'Triggered Negotiation Agent', type: 'trigger' },
        { time: '11:15', action: 'Triggered Monitoring & Alert Agent', type: 'trigger' },
        { time: '11:30', action: 'Workflow completed successfully', type: 'complete' },
      ],
      
      aggregatedOutput: {
        recommendation: 'Selected TechCorp Industries at $225,000',
        expectedCost: '$225,000',
        expectedDelivery: '12 days',
        riskLevel: 'low',
        confidence: 88,
        nextSteps: ['Order placed', 'Monitoring active'],
      },
    },
  ]

  const agentPerformanceData = [
    { agent: 'Planning & Inventory', avgDuration: 15, successRate: 98 },
    { agent: 'Supplier Intelligence', avgDuration: 18, successRate: 95 },
    { agent: 'Risk Prediction', avgDuration: 12, successRate: 97 },
    { agent: 'Decision & Recommendation', avgDuration: 20, successRate: 94 },
    { agent: 'Negotiation', avgDuration: 25, successRate: 89 },
    { agent: 'Monitoring & Alert', avgDuration: 10, successRate: 99 },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      active: 'primary',
      completed: 'success',
      pending: 'default',
      failed: 'danger',
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
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

  const getAgentStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      in_progress: 'primary',
      pending: 'default',
      failed: 'danger',
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">AI Agent Workflow</h1>
          <p className="text-gray-600 mt-1">Master Procurement Agent - Orchestration and coordination of AI agents</p>
        </div>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Network className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-navy-900">{workflows.filter(w => w.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-success-600">{workflows.filter(w => w.status === 'completed').length}</p>
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
                <p className="text-sm text-gray-600">Agents Active</p>
                <p className="text-2xl font-bold text-navy-900">6</p>
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
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-navy-900">1.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Metrics</CardTitle>
          <CardDescription>Average execution time and success rate by agent</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agentPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDuration" fill="#3367d6" name="Avg Duration (min)" />
              <Bar dataKey="successRate" fill="#22c55e" name="Success Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Workflows */}
      <div className="space-y-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className={workflow.priority === 'critical' ? 'border-2 border-danger-500' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{workflow.title}</CardTitle>
                    {getStatusBadge(workflow.status)}
                    {getPriorityBadge(workflow.priority)}
                  </div>
                  <CardDescription>
                    {workflow.id} • Started: {workflow.startTime} • Est. Completion: {workflow.estimatedCompletion}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="text-2xl font-bold text-navy-900">{workflow.progress}%</p>
                  </div>
                </div>
              </div>
              <Progress value={workflow.progress} variant={workflow.status === 'completed' ? 'success' : 'primary'} />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agent Execution Flow */}
              <div>
                <h4 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5 text-primary-600" />
                  Agent Execution Flow
                </h4>
                <div className="space-y-3">
                  {workflow.agentSequence.map((agent, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${agent.status === 'completed' ? 'bg-success-100' : agent.status === 'in_progress' ? 'bg-primary-100' : 'bg-gray-100'}`}>
                        <agent.icon className={`w-5 h-5 ${agent.status === 'completed' ? 'text-success-600' : agent.status === 'in_progress' ? 'text-primary-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-navy-900">{agent.agent}</h5>
                          {getAgentStatusBadge(agent.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {agent.startTime && <span>Start: {agent.startTime}</span>}
                          {agent.endTime && <span>End: {agent.endTime}</span>}
                        </div>
                        {agent.output && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <p className="text-gray-700">{JSON.stringify(agent.output, null, 2)}</p>
                          </div>
                        )}
                      </div>
                      {index < workflow.agentSequence.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-gray-400 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Agent Coordination */}
              <div>
                <h4 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent-600" />
                  Master Agent Coordination Log
                </h4>
                <div className="space-y-2">
                  {workflow.masterAgentActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-500 w-20">{action.time}</span>
                      <Badge variant={action.type === 'trigger' ? 'primary' : action.type === 'complete' ? 'success' : 'default'} className="text-xs">
                        {action.type}
                      </Badge>
                      <span className="text-sm text-gray-700">{action.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aggregated Output */}
              <Card className="border-2 border-success-500 bg-success-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="w-5 h-5 text-success-600" />
                    Aggregated Output & Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Recommendation</p>
                      <p className="text-sm font-medium text-navy-900">{workflow.aggregatedOutput.recommendation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Expected Cost</p>
                      <p className="text-sm font-medium text-navy-900">{workflow.aggregatedOutput.expectedCost}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Expected Delivery</p>
                      <p className="text-sm font-medium text-navy-900">{workflow.aggregatedOutput.expectedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Confidence</p>
                      <p className="text-sm font-medium text-success-600">{workflow.aggregatedOutput.confidence}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Next Steps</p>
                    <ul className="space-y-1">
                      {workflow.aggregatedOutput.nextSteps.map((step, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-success-600">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {workflow.status === 'active' && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="success" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Workflow
                      </Button>
                      <Button variant="secondary">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AIAgentWorkflow
