import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Progress } from '../ui/Progress'

const RiskBreakdownChart = ({ risks }) => {
  const getRiskColor = (score) => {
    if (score >= 70) return 'bg-red-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getRiskLevel = (score) => {
    if (score >= 70) return 'High'
    if (score >= 40) return 'Medium'
    return 'Low'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Risk Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {risks?.map((risk, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{risk.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{risk.score}%</span>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full font-medium
                  ${risk.score >= 70 ? 'bg-red-100 text-red-800' :
                    risk.score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}
                `}>
                  {getRiskLevel(risk.score)}
                </span>
              </div>
            </div>
            <Progress 
              value={risk.score} 
              className="h-3"
              indicatorClassName={getRiskColor(risk.score)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default RiskBreakdownChart
