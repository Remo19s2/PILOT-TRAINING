import { cn } from '../../lib/utils'

const Select = ({ children, className, ...props }) => {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'text-sm text-gray-900 bg-white',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
