import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { CheckCircle, AlertTriangle, User, Clock } from 'lucide-react'
import RiskBadge from './RiskBadge'

const DecisionConfirmation = ({ 
  selectedAction,
  riskType,
  riskLevel,
  decisionMaker,
  status,
  onContinue
}) => {
  return (
    <Card className="border-2 border-green-300 bg-green-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-green-900">
          <CheckCircle className="w-6 h-6" />
          Decision Confirmed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Selected Action</p>
            <p className="font-semibold text-gray-900">{selectedAction}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Risk</p>
            <p className="font-semibold text-gray-900">{riskType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Risk Level</p>
            <RiskBadge level={riskLevel} size="sm" />
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Status</p>
            <p className="font-semibold text-green-700">{status}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <User className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-xs text-gray-600">Decision Made By</p>
            <p className="font-semibold text-gray-900">{decisionMaker}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-xs text-gray-600">Timestamp</p>
            <p className="font-semibold text-gray-900">{new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button variant="primary" onClick={onContinue} className="w-full">
            Continue Procurement Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DecisionConfirmation
