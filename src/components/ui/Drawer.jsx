import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const Drawer = ({ isOpen, onClose, title, children, className, position = 'right' }) => {
  if (!isOpen) return null

  const positions = {
    right: 'right-0',
    left: 'left-0',
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        'fixed top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-xl',
        positions[position],
        className
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-6">
          {children}
        </div>
      </div>
    </>
  )
}

export { Drawer }
