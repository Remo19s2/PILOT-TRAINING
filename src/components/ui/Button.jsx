import { cn } from '../../lib/utils'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow active:scale-[0.99] focus:ring-primary-500',
    secondary: 'bg-white text-navy-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm active:scale-[0.99] focus:ring-primary-500',
    success: 'bg-success-600 text-white hover:bg-success-700 shadow-sm active:scale-[0.99] focus:ring-success-500',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 shadow-sm active:scale-[0.99] focus:ring-danger-500',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 shadow-sm active:scale-[0.99] focus:ring-accent-500',
    ghost: 'bg-transparent text-navy-700 hover:bg-slate-100 hover:text-navy-900 focus:ring-primary-500',
    outline: 'bg-transparent border border-slate-300 text-navy-700 hover:bg-slate-50 hover:text-navy-900 focus:ring-primary-500',
  }

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-5 py-2.5 text-base font-semibold',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }

