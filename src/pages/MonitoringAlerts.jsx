import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { Bell, AlertTriangle, CheckCircle, Clock, Truck, Package, Users, Activity, Search, Filter, RefreshCw, Zap, Eye, XCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'

const MonitoringAlerts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

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
    return <Badge variant={variants[severity]}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'danger',
      resolved: 'success',
      acknowledged: 'primary',
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      delivery_delay: Truck,
      inventory_shortage: Package,
      supplier_performance: Users,
      shipment_disruption: Activity,
      price_increase: AlertTriangle,
      supplier_risk: AlertTriangle,
    }
    return icons[type] || AlertTriangle
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesType = typeFilter === 'all' || alert.type === typeFilter
    return matchesSearch && matchesSeverity && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Monitoring & Alerts</h1>
          <p className="text-gray-600 mt-1">Monitoring & Alert Agent - Real-time monitoring and intelligent alerting</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Trigger Re-Analysis
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-danger-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-danger-600">{alerts.filter(a => a.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-danger-100 rounded-lg">
                <Bell className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-danger-600">{alerts.filter(a => a.severity === 'critical').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-success-600">{alerts.filter(a => a.status === 'resolved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Activity className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monitored Entities</p>
                <p className="text-2xl font-bold text-navy-900">{monitoringMetrics.reduce((sum, m) => sum + m.monitored, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Health by Category</CardTitle>
          <CardDescription>Real-time monitoring status across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {monitoringMetrics.map((metric) => (
              <Card key={metric.category} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-navy-900">{metric.category}</h4>
                    <Badge variant={metric.health >= 90 ? 'success' : metric.health >= 80 ? 'warning' : 'danger'}>
                      {metric.health}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monitored</span>
                      <span className="font-medium">{metric.monitored}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Alerts</span>
                      <span className="font-medium text-danger-600">{metric.alerts}</span>
                    </div>
                    <Progress value={metric.health} variant={metric.health >= 90 ? 'success' : metric.health >= 80 ? 'warning' : 'danger'} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Trend (Last 6 Days)</CardTitle>
          <CardDescription>Alert volume by severity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={alertTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Critical" />
              <Area type="monotone" dataKey="high" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="High" />
              <Area type="monotone" dataKey="warning" stackId="1" stroke="#3367d6" fill="#3367d6" fillOpacity={0.6} name="Warning" />
              <Area type="monotone" dataKey="info" stackId="1" stroke="#6b7280" fill="#6b7280" fillOpacity={0.6} name="Info" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="w-40">
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </Select>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-40">
              <option value="all">All Types</option>
              <option value="delivery_delay">Delivery Delay</option>
              <option value="inventory_shortage">Inventory Shortage</option>
              <option value="supplier_performance">Supplier Performance</option>
              <option value="shipment_disruption">Shipment Disruption</option>
              <option value="price_increase">Price Increase</option>
              <option value="supplier_risk">Supplier Risk</option>
            </Select>
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const Icon = getTypeIcon(alert.type)
          return (
            <Card key={alert.id} className={alert.severity === 'critical' ? 'border-2 border-danger-500' : alert.severity === 'high' ? 'border-2 border-warning-500' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${alert.severity === 'critical' ? 'bg-danger-100' : alert.severity === 'high' ? 'bg-warning-100' : 'bg-primary-100'}`}>
                      <Icon className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-danger-600' : alert.severity === 'high' ? 'text-warning-600' : 'text-primary-600'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-navy-900">{alert.title}</h4>
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                      </div>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    <p className="text-xs text-gray-400 mt-1">Triggered by {alert.triggeredBy}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Entity</p>
                    <p className="text-sm font-medium text-navy-900">{alert.entity}</p>
                  </div>
                  {alert.supplier && (
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Supplier</p>
                      <p className="text-sm font-medium text-navy-900">{alert.supplier}</p>
                    </div>
                  )}
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Impact</p>
                    <p className="text-sm font-medium text-navy-900">{alert.impact}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Action Required</p>
                    <p className={`text-sm font-medium ${alert.actionRequired ? 'text-danger-600' : 'text-success-600'}`}>
                      {alert.actionRequired ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {alert.suggestedAction && (
                  <div className="p-3 bg-accent-50 border border-accent-200 rounded-lg mb-3">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-accent-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-accent-900">Suggested Action</p>
                        <p className="text-sm text-accent-800">{alert.suggestedAction}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {alert.actionRequired && (
                      <Button variant="secondary" size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === 'active' && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Snooze
                        </Button>
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Acknowledge
                        </Button>
                      </>
                    )}
                    {alert.status === 'active' && (
                      <Button variant="ghost" size="sm">
                        <XCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default MonitoringAlerts
