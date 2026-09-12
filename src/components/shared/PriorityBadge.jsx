import { cn } from '../../lib/utils'

const PriorityBadge = ({ priority, size = 'md' }) => {
  const variants = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  const labels = {
    high: 'HIGH PRIORITY',
    medium: 'MEDIUM PRIORITY',
    low: 'LOW PRIORITY',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border rounded-full',
        variants[priority],
        sizes[size]
      )}
    >
      {labels[priority]}
    </span>
  )
}

export default PriorityBadge
