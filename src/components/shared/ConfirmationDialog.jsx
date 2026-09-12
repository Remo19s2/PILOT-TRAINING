import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { AlertTriangle } from 'lucide-react'

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="bg-white w-full max-w-md m-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-danger-600' : 'text-warning-600'}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex gap-3">
            <Button variant={variant} onClick={onConfirm} className="flex-1">
              {confirmText}
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1">
              {cancelText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfirmationDialog
