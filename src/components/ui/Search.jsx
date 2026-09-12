import { Search } from 'lucide-react'
import { cn } from '../../lib/utils'

const SearchInput = ({ placeholder = 'Search...', className, ...props }) => {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'text-sm text-gray-900 placeholder-gray-400'
        )}
        {...props}
      />
    </div>
  )
}

export { SearchInput }
