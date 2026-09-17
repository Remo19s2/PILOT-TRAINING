import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { Package, AlertTriangle, TrendingUp, Calendar, Target, ClipboardList, BarChart3, Plus, Filter, Search, ArrowRight, Brain, FileText, Eye, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { triggerInventoryShortage } from '../api/events'

const PlanningInventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sendingShortageId, setSendingShortageId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      // Fire shortage events for all critical/high items
      const criticalItems = requirements.filter(r => ['critical', 'high'].includes(r.urgencyLevel))
      await Promise.all(criticalItems.map(item =>
        triggerInventoryShortage({
          component_id:      item.componentId,
          current_inventory: item.availableInventory,
          required_quantity: item.requiredQuantity,
          shortage_quantity: item.shortageQuantity,
          required_date:     item.requiredDate,
          priority:          item.urgencyLevel === 'critical' ? 'CRITICAL' : 'HIGH',
        })
      ))
      showToast(`✅ AI Analysis triggered — ${criticalItems.length} shortage event(s) sent to n8n`, true)
    } catch (err) {
      showToast(`❌ Failed: ${err.message}`, false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReportShortage = async (item) => {
    setSendingShortageId(item.id)
    try {
      await triggerInventoryShortage({
        component_id:      item.componentId,
        current_inventory: item.availableInventory,
        required_quantity: item.requiredQuantity,
        shortage_quantity: item.shortageQuantity,
        required_date:     item.requiredDate,
        priority:          item.urgencyLevel === 'critical' ? 'CRITICAL' : item.urgencyLevel === 'high' ? 'HIGH' : 'MEDIUM',
      })
      showToast(`✅ Shortage reported: ${item.componentName}`, true)
    } catch (err) {
      showToast(`❌ Failed: ${err.message}`, false)
    } finally {
      setSendingShortageId(null)
    }
  }

  const handleGenerateRFQs = () => {
    alert('RFQs generated for critical shortages!')
  }

  const handleExportAnalysis = () => {
    alert('Analysis exported to CSV!')
  }

  // Planning & Inventory Agent Data
  const requirements = [
    {
      id: 'COMP-001',
      componentName: 'Electronic Control Unit',
      componentId: 'ECU-2024-X1',
      requiredQuantity: 10000,
      availableInventory: 3000,
      shortageQuantity: 7000,
      requiredDate: '2024-01-28',
      urgencyLevel: 'high',
      productionImpact: 'Production line stoppage risk if not procured by required date',
      
      // AI Analysis Data
      customerDemand: 9500,
      productionRequirement: 10000,
      bomRequirement: 10000,
      currentInventory: 3000,
      procurementRequirement: 7000,
    },
    {
      id: 'COMP-002',
      componentName: 'Steel Sheets - Grade A',
      componentId: 'SS-2024-A1',
      requiredQuantity: 30000,
      availableInventory: 450,
      shortageQuantity: 29550,
      requiredDate: '2024-01-25',
      urgencyLevel: 'critical',
      productionImpact: 'Critical production halt - multiple assembly lines affected',
      
      // AI Analysis Data
      customerDemand: 28000,
      productionRequirement: 30000,
      bomRequirement: 30000,
      currentInventory: 450,
      procurementRequirement: 29550,
    },
    {
      id: 'COMP-003',
      componentName: 'Circuit Board - Type B',
      componentId: 'CB-2024-B2',
      requiredQuantity: 5500,
      availableInventory: 1200,
      shortageQuantity: 4300,
      requiredDate: '2024-01-30',
      urgencyLevel: 'high',
      productionImpact: 'Customer order delays if not procured on time',
      
      // AI Analysis Data
      customerDemand: 5000,
      productionRequirement: 5500,
      bomRequirement: 5500,
      currentInventory: 1200,
      procurementRequirement: 4300,
    },
    {
      id: 'COMP-004',
      componentName: 'Packaging Materials',
      componentId: 'PM-2024-C1',
      requiredQuantity: 8000,
      availableInventory: 6500,
      shortageQuantity: 1500,
      requiredDate: '2024-02-05',
      urgencyLevel: 'medium',
      productionImpact: 'Minor impact - can use existing stock temporarily',
      
      // AI Analysis Data
      customerDemand: 7500,
      productionRequirement: 8000,
      bomRequirement: 8000,
      currentInventory: 6500,
      procurementRequirement: 1500,
    },
    {
      id: 'COMP-005',
      componentName: 'Fasteners - M8 Bolts',
      componentId: 'FB-2024-M8',
      requiredQuantity: 50000,
      availableInventory: 42000,
      shortageQuantity: 8000,
      requiredDate: '2024-02-10',
      urgencyLevel: 'low',
      productionImpact: 'No immediate impact - sufficient buffer stock',
      
      // AI Analysis Data
      customerDemand: 45000,
      productionRequirement: 50000,
      bomRequirement: 50000,
      currentInventory: 42000,
      procurementRequirement: 8000,
    },
  ]

  const getUrgencyBadge = (urgency) => {
    const variants = {
      critical: 'danger',
      high: 'warning',
      medium: 'primary',
      low: 'success',
    }
    return <Badge variant={variants[urgency]}>{urgency.charAt(0).toUpperCase() + urgency.slice(1)}</Badge>
  }

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.componentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUrgency = urgencyFilter === 'all' || req.urgencyLevel === urgencyFilter
    return matchesSearch && matchesUrgency
  })

  // Chart Data
  const demandAnalysis = [
    { name: 'ECU', customer: 9500, production: 10000, inventory: 3000 },
    { name: 'Steel', customer: 28000, production: 30000, inventory: 450 },
    { name: 'Circuit', customer: 5000, production: 5500, inventory: 1200 },
    { name: 'Packaging', customer: 7500, production: 8000, inventory: 6500 },
    { name: 'Fasteners', customer: 45000, production: 50000, inventory: 42000 },
  ]

  const urgencyDistribution = [
    { name: 'Critical', value: 1, color: '#ef4444' },
    { name: 'High', value: 2, color: '#f59e0b' },
    { name: 'Medium', value: 1, color: '#3367d6' },
    { name: 'Low', value: 1, color: '#22c55e' },
  ]

  const procurementTrend = [
    { month: 'Sep', value: 120 },
    { month: 'Oct', value: 145 },
    { month: 'Nov', value: 132 },
    { month: 'Dec', value: 168 },
    { month: 'Jan', value: 185 },
  ]

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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Planning & Inventory Control</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Brain className="w-3 h-3 mr-1 text-indigo-500" />
              BOM Explosion & Demand Forecast
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Automated shortage detection, buffer threshold tracking, and replenishment planning</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={handleRunAIAnalysis} 
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Analyzing Requirements...</>
            ) : (
              <><Brain className="w-3.5 h-3.5 mr-1.5" />Run AI Shortage Analysis</>
            )}
          </Button>
        </div>
      </div>

      {/* Compact KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Tracked Components</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{requirements.length}</p>
          </div>
          <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-rose-100 bg-rose-50/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Critical Shortages</p>
            <p className="text-xl font-bold text-rose-600 mt-0.5">{requirements.filter(r => r.urgencyLevel === 'critical').length}</p>
          </div>
          <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-amber-100 bg-amber-50/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Deficit Units</p>
            <p className="text-xl font-bold text-amber-600 mt-0.5">{requirements.reduce((sum, r) => sum + r.shortageQuantity, 0).toLocaleString()}</p>
          </div>
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Model Accuracy</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">94.8%</p>
          </div>
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Search by component name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
          />
        </div>
        <div className="w-40">
          <Select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="h-8 text-xs"
          >
            <option value="all">All Urgency Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
      </div>

      {/* High-Density Requirements & Shortage Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Procurement Deficit Ledger</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{filteredRequirements.length} component requirements calculated from active production orders</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleExportAnalysis} className="h-7 text-xs px-2.5">
            <FileText className="w-3.5 h-3.5 mr-1" /> Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Component & Code</th>
                <th className="py-2.5 px-3.5 text-right">Required</th>
                <th className="py-2.5 px-3.5 text-right">In Stock</th>
                <th className="py-2.5 px-3.5 text-right">Shortage</th>
                <th className="py-2.5 px-3.5">Stock Coverage</th>
                <th className="py-2.5 px-3.5">Due Date</th>
                <th className="py-2.5 px-3.5">Urgency</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequirements.map((req) => {
                const coverage = Math.min(100, Math.round((req.availableInventory / req.requiredQuantity) * 100))
                const isCritical = req.urgencyLevel === 'critical'
                const isHigh = req.urgencyLevel === 'high'

                return (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5">
                      <p className="font-semibold text-slate-900">{req.componentName}</p>
                      <span className="text-[11px] text-slate-400 font-mono">{req.componentId}</span>
                    </td>
                    <td className="py-3 px-3.5 text-right font-medium text-slate-700">
                      {req.requiredQuantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right font-medium text-slate-700">
                      {req.availableInventory.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right font-bold text-rose-600">
                      -{req.shortageQuantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 min-w-[130px]">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>{coverage}% covered</span>
                      </div>
                      <Progress 
                        value={coverage} 
                        className="h-1.5"
                        variant={coverage >= 75 ? 'success' : coverage >= 30 ? 'warning' : 'danger'}
                      />
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 font-medium">
                      {req.requiredDate}
                    </td>
                    <td className="py-3 px-3.5">
                      {getUrgencyBadge(req.urgencyLevel)}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={sendingShortageId === req.id}
                          onClick={() => handleReportShortage(req)}
                          className="h-7 text-[11px] px-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                        >
                          {sendingShortageId === req.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <><AlertTriangle className="w-3 h-3 mr-1" />Report Shortage</>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compact AI Strategy & Prescriptive Actions */}
      <div className="bg-white rounded-xl border border-indigo-100 p-4 shadow-sm bg-gradient-to-r from-indigo-50/40 via-white to-indigo-50/20">
        <div className="flex items-center justify-between mb-3 border-b border-indigo-100 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Planning & Sourcing Recommendations</h3>
          </div>
          <Button 
            size="sm" 
            onClick={handleGenerateRFQs}
            className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3"
          >
            <Brain className="w-3.5 h-3.5 mr-1" /> Generate Replenishment RFQs
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Prioritize Steel Sheets Expedited Order
            </div>
            <p className="text-[11px] text-slate-600">Critical shortage of 29,550 units with 5-day lead time window. Immediate replenishment RFQ advised.</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Split Micro-Actuator Demand (60/40)
            </div>
            <p className="text-[11px] text-slate-600">Allocate 60% to TechCorp and 40% to secondary qualified source to mitigate single-source dependency.</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Dynamic Safety Stock Rebalancing
            </div>
            <p className="text-[11px] text-slate-600">Increase safety buffer by +20% on fast-moving fasteners to absorb assembly spikes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanningInventory
