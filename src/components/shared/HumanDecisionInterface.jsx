import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Radio } from 'lucide-react'

const HumanDecisionInterface = ({ 
  selectedRecommendation,
  decisionNotes,
  onDecisionChange,
  onNotesChange,
  onConfirm
}) => {
  const decisionOptions = [
    { id: 'accept', label: 'Accept Recommended Action', description: 'Proceed with the recommended solution' },
    { id: 'alternative', label: 'Choose Alternative Recommendation', description: 'Select a different recommended action' },
    { id: 'proceed', label: 'Proceed With Current Supplier', description: 'Continue with the original supplier despite risk' },
    { id: 'select_alternative', label: 'Select Alternative Supplier', description: 'Choose a different supplier' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">FINAL PROCUREMENT DECISION</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">Options:</p>
          <div className="space-y-3">
            {decisionOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedRecommendation === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value={option.id}
                  checked={selectedRecommendation === option.id}
                  onChange={(e) => onDecisionChange(e.target.value)}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Decision Notes:
          </label>
          <Input
            type="text"
            value={decisionNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add any additional notes or context..."
            className="w-full"
          />
        </div>

        <Button
          variant="primary"
          onClick={onConfirm}
          className="w-full"
          disabled={!selectedRecommendation}
        >
          Confirm Final Decision
        </Button>
      </CardContent>
    </Card>
  )
}

export default HumanDecisionInterface
