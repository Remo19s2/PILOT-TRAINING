import { AlertTriangle } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { Button } from '../ui/Button'

const RiskAlertBanner = ({ supplier, component, riskType, riskLevel, riskScore, description, onViewDetails, onViewRecommendations }) => {
  return (
    <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-900 mb-2">⚠ SUPPLIER RISK DETECTED</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Supplier</p>
              <p className="font-semibold text-gray-900">{supplier}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Component</p>
              <p className="font-semibold text-gray-900">{component}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Risk Type</p>
              <p className="font-semibold text-gray-900">{riskType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Risk Score</p>
              <p className="font-semibold text-gray-900">{riskScore}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">Risk Level:</span>
            <RiskBadge level={riskLevel} size="md" />
          </div>

          <div className="bg-white border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Potential Issue:</span> {description}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onViewDetails} size="sm">
              View Risk Details
            </Button>
            <Button variant="primary" onClick={onViewRecommendations} size="sm">
              View Recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskAlertBanner
