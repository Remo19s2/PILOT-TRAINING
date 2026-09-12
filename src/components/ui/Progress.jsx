import { cn } from '../../lib/utils'

const Progress = ({ value = 0, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    danger: 'bg-danger-600',
  }

  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2.5', className)}>
      <div
        className={cn('h-2.5 rounded-full transition-all duration-300', variants[variant])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export { Progress }
