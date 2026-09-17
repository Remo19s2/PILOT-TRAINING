import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  MessageSquare,
  Sparkles,
  Home
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
      { name: 'Negotiation Center', href: '/negotiation-center', icon: MessageSquare },
    ]
  },
  {
    title: 'Decisions',
    items: [
      { name: 'Recommendations', href: '/recommendations', icon: Brain },
      { name: 'Finance Approvals', href: '/approval-status', icon: CheckSquare },
      { name: 'Purchase Orders', href: '/purchase-orders', icon: Truck },
    ]
  },
  {
    title: 'Monitoring & Intelligence',
    items: [
      { name: 'Monitoring & Alerts', href: '/monitoring-alerts', icon: Bell },
      { name: 'Supplier Risk Analysis', href: '/risk-analysis', icon: Shield },
      { name: 'Suppliers Directory', href: '/suppliers', icon: Users },
    ]
  },
  {
    title: 'Reports',
    items: [
      { name: 'Procurement Reports', href: '/reports', icon: BarChart3 },
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
    title: 'RFQs & Deals',
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
    title: 'History & Analytics',
    items: [
      { name: 'Approval History', href: '/approval-history', icon: Activity },
      { name: 'Finance Reports', href: '/finance-reports', icon: BarChart3 },
    ]
  },
]

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate()
  const [expandedGroups, setExpandedGroups] = useState({
    Overview: true,
    Procurement: true,
    Decisions: true,
    'Monitoring & Intelligence': true,
    'RFQs & Deals': true,
    Reports: true,
    RFQs: true,
    Alerts: true,
    Approvals: true,
    'Procurement Details': true,
    'History & Analytics': true,
  })
  const location = useLocation()
  const { currentUser, logout } = useWorkflow()

  // Get navigation based on user role
  const getNavigation = () => {
    const role = (currentUser?.role || '').toLowerCase()
    if (role === 'supplier' || role.includes('supplier')) {
      return supplierNavigation
    }
    if (role === 'finance_approver' || role.includes('finance')) {
      return financeApproverNavigation
    }
    if (role === 'procurement_manager' || role.includes('procurement') || role.includes('manager')) {
      return procurementManagerNavigation
    }

    // Smart fallback based on current URL path
    const path = location.pathname.toLowerCase()
    if (path.includes('supplier') && !path.includes('supplier-comparison') && !path.includes('supplier-risk')) {
      return supplierNavigation
    }
    if (path.includes('finance') || path.includes('pending-approvals') || path.includes('approved-requests') || path.includes('rejected-requests')) {
      return financeApproverNavigation
    }
    return procurementManagerNavigation
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
          'flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all',
          isActive 
            ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30' 
            : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
        )}
      >
        <item.icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
        <span>{item.name}</span>
      </Link>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full bg-navy-950 text-white transition-transform duration-300 border-r border-navy-800/80',
        'w-64 overflow-y-auto scrollbar-thin',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo and Brand */}
        <div className="p-4 border-b border-navy-800/80">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-600/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-primary-200" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1">
                  PRISM
                  <span className="text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.2 rounded bg-primary-950 text-primary-400 border border-primary-800">
                    AI
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">Autonomous Procurement</p>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>



        <nav className="p-4 space-y-5">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
              >
                <span>{group.title}</span>
                {expandedGroups[group.title] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              
              {expandedGroups[group.title] && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink key={item.name} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {currentUser && (
            <div className="pt-4 border-t border-navy-800/80">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

