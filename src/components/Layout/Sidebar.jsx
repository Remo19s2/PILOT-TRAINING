import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWorkflow } from '../../context/WorkflowContext'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  AlertTriangle, 
  CheckSquare, 
  Settings, 
  Bell,
  Shield,
  TrendingUp,
  Truck,
  Package,
  BarChart3,
  FileCheck,
  Brain,
  GitBranch,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ClipboardList,
  Target,
  Activity,
  Zap,
  Network,
  DollarSign,
  Building,
  LogOut,
  Eye,
  Send,
  CheckCircle,
  Star,
  Radar,
  RefreshCw,
  MessageSquare
} from 'lucide-react'
import { cn } from '../../lib/utils'

// Role-based navigation configurations
const procurementManagerNavigation = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/procurement-dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Procurement',
    items: [
      { name: 'Planning & Inventory', href: '/planning-insights', icon: Package },
      { name: 'Create RFQ', href: '/create-rfq', icon: FileText },
      { name: 'RFQs & Quotations', href: '/rfqs', icon: FileCheck },
      { name: 'Negotiation', href: '/negotiation-center', icon: MessageSquare },
    ]
  },
  {
    title: 'Decisions',
    items: [
      { name: 'Recommendations', href: '/risk-recommendations', icon: Brain },
      { name: 'Finance Approvals', href: '/approval-status', icon: CheckSquare },
      { name: 'Orders', href: '/purchase-orders', icon: Truck },
    ]
  },
  {
    title: 'Monitoring',
    items: [
      { name: 'Monitoring & Alerts', href: '/monitoring-alerts', icon: Bell },
    ]
  },
  {
    title: 'Reports',
    items: [
      { name: 'Reports', href: '/reports', icon: BarChart3 },
    ]
  },
]

const supplierNavigation = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/supplier-dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'RFQs',
    items: [
      { name: 'Received RFQs', href: '/new-rfqs', icon: FileText },
      { name: 'My Quotations', href: '/submitted-quotations', icon: FileCheck },
      { name: 'Negotiations', href: '/supplier-negotiations', icon: MessageSquare },
      { name: 'Final Decisions', href: '/final-decisions', icon: CheckCircle },
    ]
  },
  {
    title: 'Alerts',
    items: [
      { name: 'Alerts', href: '/supplier-alerts', icon: Bell },
    ]
  },
]

const financeApproverNavigation = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/finance-dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Approvals',
    items: [
      { name: 'Pending Approvals', href: '/pending-approvals', icon: CheckSquare },
      { name: 'Approved', href: '/approved-requests', icon: CheckCircle },
      { name: 'Rejected', href: '/rejected-requests', icon: X },
    ]
  },
  {
    title: 'Procurement Details',
    items: [
      { name: 'Procurement Details', href: '/procurement-details', icon: FileText },
    ]
  },
  {
    title: 'History',
    items: [
      { name: 'Approval History', href: '/approval-history', icon: Activity },
    ]
  },
]

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [expandedGroups, setExpandedGroups] = useState({
    Overview: true,
    Procurement: true,
    Decisions: true,
    Monitoring: true,
    Reports: true,
    RFQs: true,
    Alerts: true,
    Approvals: true,
    'Procurement Details': true,
    History: true,
  })
  const location = useLocation()
  const { currentUser, logout } = useWorkflow()

  // Get navigation based on user role
  const getNavigation = () => {
    if (!currentUser) return []
    switch (currentUser.role) {
      case 'procurement_manager':
        return procurementManagerNavigation
      case 'supplier':
        return supplierNavigation
      case 'finance_approver':
        return financeApproverNavigation
      default:
        return []
    }
  }

  const navigationGroups = getNavigation()

  const toggleGroup = (title) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.href
    return (
      <Link
        to={item.href}
        onClick={() => setIsOpen(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
          isActive 
            ? 'bg-primary-100 text-primary-700 font-medium' 
            : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        <item.icon className="w-4 h-4" />
        <span>{item.name}</span>
      </Link>
    )
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full bg-navy-900 text-white transition-transform duration-300',
        'w-64 overflow-y-auto scrollbar-thin',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-4 border-b border-navy-800">
          <div className="flex items-center h-16 relative">
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="text-gray-400 hover:text-white transition-colors absolute left-0"
              title={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">PRISM</h1>
          </div>
        </div>

        <nav className="p-4 space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
              >
                <span>{group.title}</span>
                {expandedGroups[group.title] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {expandedGroups[group.title] && (
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <NavLink key={item.name} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {currentUser && (
            <div className="pt-6 border-t border-navy-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-gray-400 hover:text-white hover:bg-gray-800 w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
