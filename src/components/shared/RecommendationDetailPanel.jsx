import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { CheckCircle, AlertTriangle, Package } from 'lucide-react'

const RecommendationDetailPanel = ({ 
  title,
  reason,
  expectedOutcome,
  affectedProcurement,
  onConfirm,
  onChooseAnother
}) => {
  return (
    <Card className="border-2 border-primary-200 bg-primary-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary-600" />
          SELECTED RECOMMENDED ACTION
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Why this is recommended:</p>
            <p className="text-sm text-gray-600">{reason}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Expected Outcome:</p>
            <p className="text-sm text-gray-600">{expectedOutcome}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-primary-600" />
              <p className="text-sm font-semibold text-gray-700">Affected Procurement:</p>
            </div>
            <p className="text-sm text-gray-900">{affectedProcurement}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="primary" onClick={onConfirm} className="flex-1">
            Confirm Action
          </Button>
          <Button variant="outline" onClick={onChooseAnother}>
            Choose Another Option
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecommendationDetailPanel
