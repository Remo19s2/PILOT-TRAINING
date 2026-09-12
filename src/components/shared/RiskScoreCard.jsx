import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { cn } from '../../lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const RiskScoreCard = ({ title, score, level, explanation, isHighestRisk = false }) => {
  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      case 'critical':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const getLevelBgColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'bg-green-50 border-green-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'high':
        return 'bg-red-50 border-red-200'
      case 'critical':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTrendIcon = (score) => {
    if (score >= 70) return <TrendingUp className="w-4 h-4 text-red-500" />
    if (score >= 40) return <Minus className="w-4 h-4 text-yellow-500" />
    return <TrendingDown className="w-4 h-4 text-green-500" />
  }

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      isHighestRisk && 'ring-2 ring-red-500 shadow-md',
      getLevelBgColor(level)
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          {title}
          {getTrendIcon(score)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{score}</span>
            <span className={cn('text-sm font-medium', getLevelColor(level))}>
              {level?.toUpperCase() || 'N/A'}
            </span>
          </div>
          {explanation && (
            <p className="text-xs text-gray-600 leading-relaxed">
              {explanation}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RiskScoreCard
