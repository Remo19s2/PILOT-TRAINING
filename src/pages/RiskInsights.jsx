import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { AlertTriangle, Shield, Activity, Brain, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const RiskInsights = () => {
  const overallRisk = {
    level: 'high',
    score: 68,
    trend: 'up',
    change: '+5%',
  }

  const riskCategories = [
    {
      name: 'Delivery Risk',
      score: 78,
      level: 'high',
      probability: 72,
      impact: 'Production delays, missed customer deadlines',
    },
    {
      name: 'Inventory Risk',
      score: 65,
      level: 'medium',
      probability: 58,
      impact: 'Stock-outs, increased carrying costs',
    },
    {
      name: 'Supplier Capacity Risk',
      score: 82,
      level: 'high',
      probability: 75,
      impact: 'Unable to meet demand, quality issues',
    },
    {
      name: 'Quality Risk',
      score: 45,
      level: 'low',
      probability: 35,
      impact: 'Defects, rework costs, customer dissatisfaction',
    },
  ]

  const aiRiskExplanation = {
    supplier: 'IndustrialX Manufacturing',
    explanation: 'IndustrialX Manufacturing has a high probability of delivery delay (78% risk score) due to historical delays in Q4 and current capacity utilization at 92%. The supplier is operating near maximum capacity with 3 major orders pending, increasing the likelihood of schedule slippage.',
  }

  const businessImpacts = [
    {
      type: 'Production Delay',
      probability: 72,
      impact: 'High',
      description: 'Potential 5-7 day production line stoppage if delivery delays occur',
    },
    {
      type: 'Inventory Shortage',
      probability: 58,
      impact: 'Medium',
      description: 'Stock-out risk for critical components affecting 3 product lines',
    },
    {
      type: 'Increased Procurement Cost',
      probability: 45,
      impact: 'Medium',
      description: 'Expedited shipping and alternative supplier premiums may increase costs by 15-20%',
    },
    {
      type: 'Quality Disruption',
      probability: 35,
      impact: 'Low',
      description: 'Potential quality issues from rushed production at alternative suppliers',
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

  const getImpactBadge = (impact) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
    }
    return <Badge variant={variants[impact]}>{impact.charAt(0).toUpperCase() + impact.slice(1)}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Risk Insights</h1>
        <p className="text-gray-600 mt-1">Risk Prediction Agent - AI-powered risk analysis and forecasting</p>
      </div>

      {/* Overall Procurement Risk */}
      <Card className={`border-2 ${overallRisk.level === 'critical' ? 'border-danger-500 bg-danger-50' : overallRisk.level === 'high' ? 'border-danger-500 bg-danger-50' : overallRisk.level === 'medium' ? 'border-warning-500 bg-warning-50' : 'border-success-500 bg-success-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-danger-600" />
            Overall Procurement Risk
          </CardTitle>
          <CardDescription>Current risk level across all procurement activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                {getRiskLevelBadge(overallRisk.level)}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                <p className="text-4xl font-bold text-navy-900">{overallRisk.score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Trend</p>
                <div className={`flex items-center gap-1 ${overallRisk.trend === 'up' ? 'text-danger-600' : 'text-success-600'}`}>
                  {overallRisk.trend === 'up' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  <span className="text-lg font-semibold">{overallRisk.change}</span>
                </div>
              </div>
            </div>
            <div className="w-64">
              <Progress value={overallRisk.score} variant={overallRisk.level === 'critical' || overallRisk.level === 'high' ? 'danger' : overallRisk.level === 'medium' ? 'warning' : 'success'} />
              <p className="text-xs text-gray-500 mt-2 text-center">Risk Score: {overallRisk.score}/100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Categories</CardTitle>
          <CardDescription>Detailed risk analysis by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskCategories.map((category) => (
              <div key={category.name} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-navy-900">{category.name}</h4>
                  {getRiskLevelBadge(category.level)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Risk Score</p>
                    <p className="text-lg font-bold text-navy-900">{category.score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Probability</p>
                    <p className="text-lg font-bold text-navy-900">{category.probability}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Possible Impact</p>
                    <p className="text-sm text-gray-700">{category.impact}</p>
                  </div>
                </div>
                <Progress value={category.score} variant={category.level === 'high' ? 'danger' : category.level === 'medium' ? 'warning' : 'success'} className="mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Risk Explanation */}
      <Card className="border-2 border-accent-500 bg-accent-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent-600" />
            AI Risk Explanation
          </CardTitle>
          <CardDescription>AI-generated risk analysis and reasoning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning-600" />
                <p className="text-sm font-semibold text-navy-900">High-Risk Supplier: {aiRiskExplanation.supplier}</p>
              </div>
              <p className="text-sm text-gray-700">{aiRiskExplanation.explanation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Potential Business Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Potential Business Impact</CardTitle>
          <CardDescription>Projected impact on business operations if risks materialize</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {businessImpacts.map((impact) => (
              <div key={impact.type} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-navy-900">{impact.type}</h4>
                  <div className="flex items-center gap-3">
                    {getImpactBadge(impact.impact)}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Probability</p>
                      <p className="text-sm font-bold text-navy-900">{impact.probability}%</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{impact.description}</p>
                <Progress value={impact.probability} variant={impact.impact === 'high' ? 'danger' : impact.impact === 'medium' ? 'warning' : 'success'} className="mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RiskInsights
