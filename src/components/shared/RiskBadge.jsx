import { cn } from '../../lib/utils'

const RiskBadge = ({ level, size = 'md' }) => {
  const riskConfig = {
    low: {
      label: 'Low Risk',
      color: 'bg-green-100 text-green-800 border-green-200',
      dotColor: 'bg-green-500'
    },
    medium: {
      label: 'Medium Risk',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dotColor: 'bg-yellow-500'
    },
    high: {
      label: 'High Risk',
      color: 'bg-red-100 text-red-800 border-red-200',
      dotColor: 'bg-red-500'
    },
    critical: {
      label: 'Critical Risk',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      dotColor: 'bg-purple-500'
    }
  }

  const config = riskConfig[level?.toLowerCase()] || riskConfig.low

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-medium',
      config.color,
      sizeClasses[size]
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  )
}

export default RiskBadge
