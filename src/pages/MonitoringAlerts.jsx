import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { 
  Bell, AlertTriangle, CheckCircle, Clock, Truck, Package, Users, 
  Activity, Search, Filter, RefreshCw, Zap, Eye, XCircle, Loader2,
  ChevronDown, ChevronUp, ShieldAlert, Sparkles
} from 'lucide-react'
import { fireMonitoringEvent, fireEvent } from '../api/events'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const MonitoringAlerts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sendingId, setSendingId] = useState(null)
  const [toast, setToast] = useState(null)
  const [expandedAlerts, setExpandedAlerts] = useState({})

  const toggleExpand = (id) => {
    setExpandedAlerts(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  /** Map alert type → API event_type */
  const alertTypeToEvent = {
    delivery_delay:        'SUPPLIER_DELAY',
    inventory_shortage:    'INVENTORY_SHORTAGE',
    supplier_performance:  'SUPPLIER_PERFORMANCE_REVIEW',
    shipment_disruption:   'PRODUCTION_DISRUPTION',
    price_increase:        'SUPPLIER_PRICE_CHANGE',
    supplier_risk:         'SUPPLIER_CAPACITY_RISK',
  }

  const handleTriggerAlert = async (alert) => {
    const eventType = alertTypeToEvent[alert.type] || 'OTHER'
    const priority = alert.severity === 'critical' ? 'CRITICAL' : alert.severity === 'high' ? 'HIGH' : 'MEDIUM'
    setSendingId(alert.id)
    try {
      await fireMonitoringEvent(eventType, priority, {}, {
        alert_id: alert.id,
        alert_title: alert.title,
        description: alert.description,
        entity: alert.entity,
        supplier: alert.supplier,
        impact: alert.impact,
        suggested_action: alert.suggestedAction,
      })
      showToast(`✅ Event dispatched to Agent Orchestrator: ${alert.title}`, true)
    } catch (err) {
      showToast(`❌ Failed to send event: ${err.message}`, false)
    } finally {
      setSendingId(null)
    }
  }

  const handleTriggerReAnalysis = async () => {
    setSendingId('reanalysis')
    try {
      await fireEvent('OTHER', 'HIGH', {}, { trigger: 'manual_reanalysis', source_page: 'MonitoringAlerts' })
      showToast('✅ Re-analysis triggered — Master Agent workflow started', true)
    } catch (err) {
      showToast(`❌ Failed: ${err.message}`, false)
    } finally {
      setSendingId(null)
    }
  }

  // Monitoring & Alert Agent Data
  const alerts = [
    {
      id: 'ALERT-001',
      type: 'delivery_delay',
      severity: 'critical',
      status: 'active',
      timestamp: '2024-01-12 14:30',
      title: 'Steel Sheets Delivery Delay',
      description: 'IndustrialX Manufacturing reported 5-day delay for PO-2024-0045 due to capacity constraints.',
      entity: 'PO-2024-0045',
      supplier: 'IndustrialX Manufacturing',
      impact: 'Production line stoppage risk',
      actionRequired: true,
      suggestedAction: 'Activate backup supplier. Expedite partial shipment.',
      triggeredBy: 'Monitoring Agent',
    },
    {
      id: 'ALERT-002',
      type: 'inventory_shortage',
      severity: 'critical',
      status: 'active',
      timestamp: '2024-01-12 12:15',
      title: 'Critical Inventory Shortage - Steel Sheets',
      description: 'Current inventory (450 kg) below minimum threshold (500 kg). Stock-out expected in 5 days.',
      entity: 'Steel Sheets - Grade A',
      supplier: null,
      impact: 'Production halt risk',
      actionRequired: true,
      suggestedAction: 'Urgent procurement required. Activate emergency ordering process.',
      triggeredBy: 'Monitoring Agent',
    },
    {
      id: 'ALERT-003',
      type: 'supplier_performance',
      severity: 'warning',
      status: 'active',
      timestamp: '2024-01-12 10:00',
      title: 'Supplier Quality Decline - GlobalSupply Co.',
      description: 'Quality score dropped from 82 to 78 in last month. 3 quality failures reported in recent shipments.',
      entity: 'GlobalSupply Co.',
      supplier: 'GlobalSupply Co.',
      impact: 'Increased defect risk',
      actionRequired: true,
      suggestedAction: 'Initiate quality review. Consider reducing order volumes.',
      triggeredBy: 'Monitoring Agent',
    },
    {
      id: 'ALERT-004',
      type: 'shipment_disruption',
      severity: 'high',
      status: 'active',
      timestamp: '2024-01-11 16:45',
      title: 'Logistics Disruption - Asian Port Congestion',
      description: 'Port congestion in Shanghai affecting multiple shipments. Estimated 3-5 day delay for 5 active orders.',
      entity: 'Multiple POs',
      supplier: 'GlobalSupply Co.',
      impact: 'Delivery delays across multiple orders',
      actionRequired: true,
      suggestedAction: 'Activate air freight contingency. Reroute through alternative ports.',
      triggeredBy: 'Monitoring Agent',
    },
    {
      id: 'ALERT-005',
      type: 'price_increase',
      severity: 'warning',
      status: 'active',
      timestamp: '2024-01-11 09:30',
      title: 'Market Price Increase - Steel Raw Materials',
      description: 'Steel prices increased by 9.1% due to global demand surge. May impact procurement budget.',
      entity: 'Steel Raw Materials',
      supplier: null,
      impact: 'Budget variance risk',
      actionRequired: false,
      suggestedAction: 'Monitor market trends. Consider forward contracts.',
      triggeredBy: 'Monitoring Agent',
    },
    {
      id: 'ALERT-006',
      type: 'supplier_risk',
      severity: 'critical',
      status: 'resolved',
      timestamp: '2024-01-10 14:00',
      title: 'Financial Risk - EasternParts Ltd',
      description: 'Debt-to-equity ratio increased to 85%. Bankruptcy risk elevated. Credit rating downgraded.',
      entity: 'EasternParts Ltd',
      supplier: 'EasternParts Ltd',
      impact: 'Supply chain disruption risk',
      actionRequired: true,
      suggestedAction: 'Suspend new orders. Activate supplier replacement process.',
      triggeredBy: 'Monitoring Agent',
    },
  ]

  const monitoringMetrics = [
    { category: 'Inventory', monitored: 156, alerts: 12, health: 92 },
    { category: 'Suppliers', monitored: 45, alerts: 8, health: 85 },
    { category: 'Purchase Orders', monitored: 89, alerts: 15, health: 88 },
    { category: 'Shipments', monitored: 67, alerts: 10, health: 90 },
  ]

  const alertTrendData = [
    { date: 'Jan 7', critical: 2, high: 3, warning: 5, info: 8 },
    { date: 'Jan 8', critical: 3, high: 4, warning: 6, info: 7 },
    { date: 'Jan 9', critical: 2, high: 5, warning: 4, info: 9 },
    { date: 'Jan 10', critical: 4, high: 3, warning: 7, info: 6 },
    { date: 'Jan 11', critical: 3, high: 4, warning: 5, info: 8 },
    { date: 'Jan 12', critical: 2, high: 2, warning: 4, info: 7 },
  ]

  const getSeverityBadge = (severity) => {
    const variants = {
      critical: 'danger',
      high: 'warning',
      warning: 'primary',
      info: 'default',
    }
    return <Badge variant={variants[severity]} className="text-xs px-2 py-0.5">{severity.toUpperCase()}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'danger',
      resolved: 'success',
      acknowledged: 'primary',
    }
    return <Badge variant={variants[status]} className="text-xs px-2 py-0.5">{status.toUpperCase()}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      delivery_delay: Truck,
      inventory_shortage: Package,
      supplier_performance: Users,
      shipment_disruption: Activity,
      price_increase: AlertTriangle,
      supplier_risk: ShieldAlert,
    }
    return icons[type] || AlertTriangle
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (alert.entity && alert.entity.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesType = typeFilter === 'all' || alert.type === typeFilter
    return matchesSearch && matchesSeverity && matchesType
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-xl text-white text-sm font-semibold transition-all flex items-center gap-2 ${toast.ok ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Monitoring & Alerts Center</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Automated multi-tier supply chain anomaly detection and exception handling</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleTriggerReAnalysis} disabled={sendingId === 'reanalysis'} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {sendingId === 'reanalysis'
              ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Analyzing...</>
              : <><Zap className="w-3.5 h-3.5 mr-1.5" />Trigger Re-Analysis</>
            }
          </Button>
        </div>
      </div>

      {/* Compact Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Active Alerts</p>
            <p className="text-2xl font-bold text-rose-600 mt-0.5">{alerts.filter(a => a.status === 'active').length}</p>
          </div>
          <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-amber-100 bg-amber-50/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Critical Severity</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{alerts.filter(a => a.severity === 'critical').length}</p>
          </div>
          <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg">
            <Bell className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Resolved Today</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{alerts.filter(a => a.status === 'resolved').length}</p>
          </div>
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Monitored Entities</p>
            <p className="text-2xl font-bold text-indigo-700 mt-0.5">{monitoringMetrics.reduce((sum, m) => sum + m.monitored, 0)}</p>
          </div>
          <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Health Mini-Cards & Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Monitoring Categories */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Health by Category</h3>
            <span className="text-[11px] text-slate-400">Live Status</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {monitoringMetrics.map((m) => (
              <div key={m.category} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">{m.category}</span>
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${m.health >= 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {m.health}%
                  </span>
                </div>
                <Progress value={m.health} className="h-1.5" />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                  <span>{m.monitored} tracked</span>
                  <span className="font-semibold text-rose-500">{m.alerts} alerts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Area Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alert Trend (Last 6 Days)</h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>Critical</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>Warning</span>
            </div>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={alertTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="#fee2e2" strokeWidth={1.5} />
                <Area type="monotone" dataKey="high" stroke="#f59e0b" fill="#fef3c7" strokeWidth={1.5} />
                <Area type="monotone" dataKey="warning" stroke="#6366f1" fill="#e0e7ff" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Search alerts by component, supplier, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="w-32 h-8 text-xs">
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="warning">Warning</option>
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-36 h-8 text-xs">
            <option value="all">All Event Types</option>
            <option value="delivery_delay">Delivery Delay</option>
            <option value="inventory_shortage">Inventory Shortage</option>
            <option value="supplier_performance">Supplier Quality</option>
            <option value="shipment_disruption">Shipment Disruption</option>
            <option value="price_increase">Price Surge</option>
            <option value="supplier_risk">Financial Risk</option>
          </Select>
        </div>
      </div>

      {/* Streamlined High-Density Alerts Feed */}
      <div className="space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
            No alerts match your current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = getTypeIcon(alert.type)
            const isExpanded = expandedAlerts[alert.id]
            const isCritical = alert.severity === 'critical'
            const isHigh = alert.severity === 'high'

            return (
              <div 
                key={alert.id} 
                className={`bg-white rounded-xl border transition-all duration-150 overflow-hidden shadow-sm ${
                  isCritical ? 'border-rose-300 hover:border-rose-400' : isHigh ? 'border-amber-300 hover:border-amber-400' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Main Alert Summary Bar */}
                <div className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isCritical ? 'bg-rose-100 text-rose-600' : isHigh ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-slate-900 truncate">{alert.title}</span>
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                        <span className="text-[11px] text-slate-400 ml-auto md:ml-0">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{alert.description}</p>
                      
                      {/* Compact Entity Chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          Entity: <strong className="text-slate-900">{alert.entity}</strong>
                        </span>
                        {alert.supplier && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            Supplier: <strong className="text-slate-900">{alert.supplier}</strong>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100 font-medium">
                          Impact: {alert.impact}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs px-2.5 text-slate-600"
                      onClick={() => toggleExpand(alert.id)}
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
                      {isExpanded ? 'Less' : 'Details'}
                    </Button>

                    {alert.actionRequired && (
                      <Button
                        size="sm"
                        disabled={sendingId === alert.id}
                        onClick={() => handleTriggerAlert(alert)}
                        className="h-8 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3"
                      >
                        {sendingId === alert.id ? (
                          <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Dispatching...</>
                        ) : (
                          <><Zap className="w-3.5 h-3.5 mr-1.5 text-amber-400" />Take Action</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Collapsible Deep Details */}
                {isExpanded && (
                  <div className="bg-slate-50/70 p-3.5 border-t border-slate-100 space-y-2.5 text-xs">
                    {alert.suggestedAction && (
                      <div className="p-2.5 bg-indigo-50/60 border border-indigo-200 rounded-lg flex items-start gap-2 text-indigo-900">
                        <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-indigo-950">AI Prescriptive Recommendation</p>
                          <p className="text-indigo-800 mt-0.5">{alert.suggestedAction}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Source Engine: <strong>{alert.triggeredBy}</strong></span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] px-2 text-slate-500">
                          <Clock className="w-3 h-3 mr-1" /> Snooze (2h)
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] px-2 text-slate-500">
                          <CheckCircle className="w-3 h-3 mr-1" /> Acknowledge
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MonitoringAlerts
