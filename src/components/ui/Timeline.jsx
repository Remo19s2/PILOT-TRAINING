import { cn } from '../../lib/utils'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

const Timeline = ({ items, className }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-warning-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-danger-600" />
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            {getStatusIcon(item.status)}
            {index < items.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-navy-900">{item.title}</h4>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
            {item.description && (
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export { Timeline }
