import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import PriorityBadge from './PriorityBadge'
import { CheckCircle, Clock, TrendingDown } from 'lucide-react'

const RecommendationCard = ({ 
  id,
  title, 
  description, 
  expectedBenefit,
  priority,
  riskReduction,
  expectedImpact,
  actionTime,
  onSelect,
  onViewAlternatives,
  isSelected 
}) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${isSelected ? 'border-2 border-primary-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <PriorityBadge priority={priority} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Description</p>
          <p className="text-sm text-gray-900">{description}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Expected Benefit</p>
          <p className="text-sm text-gray-900">{expectedBenefit}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Risk Reduction</p>
              <p className="text-sm font-semibold">{riskReduction}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Impact</p>
              <p className="text-sm font-semibold">{expectedImpact}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-xs text-gray-500">Action Time</p>
              <p className="text-sm font-semibold">{actionTime}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          {onSelect && (
            <Button 
              onClick={() => onSelect(id)}
              variant={isSelected ? 'primary' : 'outline'}
              className="flex-1"
              size="sm"
            >
              {isSelected ? 'Selected' : 'Select This Option'}
            </Button>
          )}
          {onViewAlternatives && (
            <Button 
              onClick={onViewAlternatives}
              variant="ghost"
              size="sm"
            >
              View Alternatives
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecommendationCard
