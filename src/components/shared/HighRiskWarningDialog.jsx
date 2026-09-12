import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import RiskBadge from './RiskBadge'

const HighRiskWarningDialog = ({ isOpen, onClose, onProceed, supplierName, riskReason, riskLevel }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="High Supplier Risk Detected" size="md">
      <div className="space-y-4 py-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-900 mb-2">
            This supplier has a High Delivery Risk.
          </p>
          <p className="text-sm text-red-700">
            <span className="font-semibold">Primary reason:</span> {riskReason}
          </p>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Risk Level:</span>
          <RiskBadge level={riskLevel} />
        </div>

        <p className="text-xs text-gray-500">
          You can still proceed with this supplier, but we recommend reviewing the risk analysis first.
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Risk Analysis
        </Button>
        <Button 
          variant="destructive" 
          onClick={onProceed}
        >
          Proceed Anyway
        </Button>
      </div>
    </Modal>
  )
}

export default HighRiskWarningDialog
