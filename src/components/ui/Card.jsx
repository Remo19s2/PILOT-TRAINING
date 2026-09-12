import { cn } from '../../lib/utils'

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-card border border-gray-200',
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
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
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
    <h3 className={cn('text-lg font-semibold text-navy-900', className)}>
      {children}
    </h3>
  )
}

const CardDescription = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)}>
      {children}
    </p>
  )
}

export { Card, CardHeader, CardContent, CardTitle, CardDescription }
