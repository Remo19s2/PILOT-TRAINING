import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

const RiskExplanationPanel = ({ riskAnalysis }) => {
  const {
    primaryRisk,
    riskLevel,
    contributingFactors,
    explanation
  } = riskAnalysis

  const getIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getBgColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-50 border-red-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'low':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className={getBgColor(riskLevel)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {getIcon(riskLevel)}
          Why was this risk predicted?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Risk */}
        <div className="p-4 bg-white rounded-lg border">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            {getIcon(riskLevel)}
            {primaryRisk} Predicted
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Contributing Factors */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Key contributing factors:</h4>
          <ul className="space-y-2">
            {contributingFactors?.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default RiskExplanationPanel
