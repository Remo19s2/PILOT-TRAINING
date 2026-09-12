import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Clock, FileText } from 'lucide-react'

const QuotationHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return null
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      'submitted': 'bg-blue-100 text-blue-700',
      'revised': 'bg-yellow-100 text-yellow-700',
      'negotiated': 'bg-purple-100 text-purple-700',
      'accepted': 'bg-green-100 text-green-700'
    }
    const style = statusStyles[status] || 'bg-gray-100 text-gray-700'
    return (
      <span className={`text-xs px-2 py-1 rounded ${style}`}>
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Quotation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((version, index) => (
            <div key={version.version} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-0">
              <div className="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full -translate-x-1/2"></div>
              <div className="mb-2">
                <span className="text-sm font-medium">Version {version.version}</span>
                <span className="ml-2">{getStatusBadge(version.status)}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-1 font-medium">₹{version.unitPrice}/unit</span>
                </div>
                <div>
                  <span className="text-gray-600">Delivery:</span>
                  <span className="ml-1 font-medium">{version.deliveryTime} Days</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-1">{version.submittedDate}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Changed by: <span className="font-medium capitalize">{version.changedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuotationHistory
