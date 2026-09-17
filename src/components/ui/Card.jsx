import { cn } from '../../lib/utils'

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-card border border-slate-200/80 transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100', className)}>
      {children}
    </div>
  )
}

const CardContent = ({ children, className }) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

const CardTitle = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg font-bold text-navy-900 tracking-tight', className)}>
      {children}
    </h3>
  )
}

const CardDescription = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-slate-500 mt-1', className)}>
      {children}
    </p>
  )
}

export { Card, CardHeader, CardContent, CardTitle, CardDescription }

