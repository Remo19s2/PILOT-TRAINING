import { Bell, Search, User, Settings, LogOut, Menu, Brain, Activity, ExternalLink, Home } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useWorkflow } from '../../context/WorkflowContext'
import { Badge } from '../ui/Badge'
import { listNotifications, markNotificationRead } from '../../api/notifications'

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { currentUser, logout } = useWorkflow()

  useEffect(() => {
    let active = true
    const loadNotifications = async () => {
      const token = localStorage.getItem('mycelia_access_token')
      if (!token) {
        if (active) setNotifications([])
        return
      }
      try {
        const data = await listNotifications()
        if (active) setNotifications(data)
      } catch {
        if (active) setNotifications([])
      }
    }
    if (currentUser) {
      loadNotifications()
      const interval = setInterval(loadNotifications, 30000)
      return () => {
        active = false
        clearInterval(interval)
      }
    }
    return () => { active = false }
  }, [currentUser])

  const roleLabels = {
    procurement_manager: 'Procurement Manager',
    supplier: 'Supplier Partner',
    finance_approver: 'Finance Approver',
  }

  const roleKey = (currentUser?.role || '').toLowerCase()
  const displayRole = roleLabels[roleKey] || currentUser?.roleName || (currentUser?.role ? currentUser.role.replace(/_/g, ' ') : 'Procurement Manager')
  const displayName = currentUser?.name || currentUser?.full_name || currentUser?.display_name || currentUser?.username || 'User'

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowProfile(false)
  }

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-1.5 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search RFQs, parts, suppliers..."
              className="pl-9 pr-4 py-1.5 w-64 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 hover:bg-white focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Return to Landing Page */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg border border-slate-200 hover:border-primary-200 transition-all"
            title="Return to PRISM Landing Page"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </Link>

          {/* AI System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-accent-50/80 border border-accent-200/70 rounded-lg">
            <Brain className="w-3.5 h-3.5 text-accent-600" />
            <span className="text-xs font-bold text-accent-900">Agent Core</span>
            <Badge variant="success" className="text-[10px] py-0 px-2">Active</Badge>
            <Activity className="w-3.5 h-3.5 text-success-600 animate-pulse" />
          </div>

          {/* Current Role Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200/80 text-primary-700 rounded-lg text-xs font-bold">
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{displayRole}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className="relative p-2 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200" 
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(notification => !notification.is_read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 font-bold text-xs text-navy-950 uppercase tracking-wider bg-slate-50/70">
                  Notifications & Alerts
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-xs text-slate-500 text-center">No active notifications</p>
                  ) : notifications.slice(0, 8).map(notification => (
                    <button
                      key={notification.id}
                      onClick={async () => {
                        if (!notification.is_read) {
                          await markNotificationRead(notification.id)
                          setNotifications(current => current.map(item => item.id === notification.id ? { ...item, is_read: true } : item))
                        }
                      }}
                      className={`block w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${notification.is_read ? 'bg-white' : 'bg-primary-50/50'}`}
                    >
                      <p className="text-xs font-bold text-navy-950">{notification.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{notification.message}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-7 h-7 bg-gradient-to-tr from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-navy-950 leading-tight">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">{displayRole}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-navy-950">{displayName}</p>
                  <p className="text-[10px] text-slate-500">{currentUser?.email || 'user@prism.com'}</p>
                </div>
                <Link to="/" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  Landing Page
                </Link>
                <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  Platform Settings
                </a>
                <hr className="my-1 border-slate-100" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-danger-600 hover:bg-danger-50 w-full text-left transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
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

