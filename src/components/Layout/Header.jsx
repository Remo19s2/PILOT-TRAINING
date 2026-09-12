import { Bell, Search, User, Settings, LogOut, Menu, Brain, Activity, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useWorkflow } from '../../context/WorkflowContext'
import { Badge } from '../ui/Badge'

const Header = ({ onMenuClick }) => {
  const [showProfile, setShowProfile] = useState(false)
  const { currentUser, logout } = useWorkflow()

  const roleLabels = {
    procurement_manager: 'Procurement Manager',
    supplier: 'Supplier',
    finance_approver: 'Finance Approver',
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-48 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* AI System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-accent-50 border border-accent-200 rounded-md">
            <Brain className="w-4 h-4 text-accent-600" />
            <span className="text-xs font-medium text-accent-900">AI System</span>
            <Badge variant="success" className="text-xs">Online</Badge>
            <Activity className="w-4 h-4 text-success-600" />
          </div>

          {/* Current Role Display */}
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-md text-sm font-medium">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{roleLabels[currentUser.role]}</span>
            </div>
          )}

          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-600 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{currentUser?.role ? roleLabels[currentUser.role] : 'Guest'}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="w-4 h-4" />
                  Profile
                </a>
                <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="w-4 h-4" />
                  Settings
                </a>
                <hr className="my-1" />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
