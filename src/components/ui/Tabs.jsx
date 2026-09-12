import { useState } from 'react'
import { cn } from '../../lib/utils'

const Tabs = ({ children, defaultValue, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={cn('w-full', className)}>
      {typeof children === 'function' 
        ? children({ activeTab, setActiveTab })
        : children.map((child, index) => {
            if (child.type === TabsList) {
              return <child.type key={index} {...child.props} activeTab={activeTab} setActiveTab={setActiveTab} />
            }
            if (child.type === TabsContent) {
              return child.props.value === activeTab 
                ? <child.type key={index} {...child.props} />
                : null
            }
            return child
          })
      }
    </div>
  )
}

const TabsList = ({ children, activeTab, setActiveTab, className }) => {
  return (
    <div className={cn('flex border-b border-gray-200', className)}>
      {children.map((child, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(child.props.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
            activeTab === child.props.value
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          {child.props.children}
        </button>
      ))}
    </div>
  )
}

const TabsContent = ({ children, className }) => {
  return (
    <div className={cn('py-4', className)}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsContent }
