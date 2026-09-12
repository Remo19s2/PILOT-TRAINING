import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { 
  FileText, 
  Send, 
  MessageSquare, 
  Package, 
  CheckCircle, 
  Calendar,
  Upload,
  Truck,
  Home,
  LogOut,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react'

const SupplierLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/supplier-dashboard', icon: Home },
    { name: 'View RFQs', href: '/supplier-rfqs', icon: FileText },
    { name: 'Submit Quotations', href: '/supplier-quotations', icon: Send },
    { name: 'Negotiations', href: '/supplier-negotiations', icon: MessageSquare },
    { name: 'Purchase Orders', href: '/supplier-pos', icon: Package },
    { name: 'Milestones', href: '/supplier-milestones', icon: Calendar },
    { name: 'Delivery Status', href: '/supplier-deliveries', icon: Truck },
    { name: 'Documents', href: '/supplier-documents', icon: Upload },
  ]

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-transform duration-300',
        'w-64 overflow-y-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-0'
      )}>
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Supplier Portal</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-blue-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-2">TechCorp Industries</p>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-white text-blue-600 font-medium' 
                    : 'text-blue-100 hover:bg-blue-500/50'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-500 mt-auto">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-500/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Portal</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Welcome, TechCorp Industries</h2>
                <p className="text-sm text-gray-500">Supplier Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-600 rounded-full" />
              </button>

              <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  TC
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">TechCorp</p>
                  <p className="text-xs text-gray-500">Supplier</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default SupplierLayout
