import { AlertTriangle, X } from 'lucide-react'
import { Button } from '../ui/Button'

const RiskNotification = ({ supplier, riskType, component, onReview, onDismiss }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-red-900 text-sm">⚠ NEW HIGH-RISK ALERT</h4>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="font-semibold text-red-800 mt-1">{supplier}</p>
          <p className="text-sm text-red-700">{riskType} Detected</p>
          <div className="mt-2 pt-2 border-t border-red-200">
            <p className="text-xs text-red-600">Potential impact on:</p>
            <p className="text-sm text-red-800 font-medium">{component}</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onReview}
            className="mt-3"
          >
            Review Risk
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RiskNotification
