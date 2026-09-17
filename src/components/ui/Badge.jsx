import { cn } from '../../lib/utils'

const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200/80',
    primary: 'bg-primary-50 text-primary-700 border-primary-200/70',
    success: 'bg-success-50 text-success-700 border-success-200/70',
    warning: 'bg-warning-50 text-warning-700 border-warning-200/70',
    danger: 'bg-danger-50 text-danger-700 border-danger-200/70',
    accent: 'bg-accent-50 text-accent-700 border-accent-200/70',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide transition-colors',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  )
}

export { Badge }

