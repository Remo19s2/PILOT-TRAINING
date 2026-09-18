import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import StatusBadge from '../components/shared/StatusBadge'
import { Package, Search, Filter, Brain, Sparkles, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { triggerInventoryShortage, triggerInventoryPlanningAnalysis } from '../api/events'

const PlanningInsights = () => {
  const navigate = useNavigate()
  const { requirements, updateRequirementStatus } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sendingId, setSendingId] = useState(null)
  const [notification, setNotification] = useState(null)

  const showNotification = (msg, isError = false) => {
    setNotification({ msg, isError })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const itemsToTrigger = requirements.filter(r => priorityFilter === 'all' ? true : r.priority === priorityFilter)
      if (itemsToTrigger.length === 0) {
        showNotification('No inventory requirements found matching the current filter.', true)
        return
      }
      // Dispatch a single consolidated workflow event instead of parallel multi-event triggers
      await triggerInventoryPlanningAnalysis({
        items: itemsToTrigger,
        priority: itemsToTrigger.some(i => i.priority === 'critical') ? 'CRITICAL' : 'HIGH',
      })
      showNotification(`✅ Inventory planning analysis triggered for ${itemsToTrigger.length} component(s)! Master Agent workflow started.`)
    } catch (err) {
      showNotification(`❌ Failed to trigger workflow: ${err.message}`, true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReportShortage = async (requirement) => {
    setSendingId(requirement.id)
    try {
      await triggerInventoryShortage({
        component_id:      requirement.id,
        component_name:    requirement.componentName,
        current_inventory: requirement.currentInventory,
        required_quantity: requirement.requiredQuantity,
        shortage_quantity: requirement.shortageQuantity,
        required_date:     requirement.requiredDeliveryDate,
        priority:          requirement.priority === 'critical' ? 'CRITICAL' : requirement.priority === 'high' ? 'HIGH' : 'MEDIUM',
      })
      showNotification(`✅ Shortage workflow triggered for ${requirement.componentName}! Sent to SNS Workbench.`)
    } catch (err) {
      showNotification(`❌ Failed to trigger workflow: ${err.message}`, true)
    } finally {
      setSendingId(null)
    }
  }

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.componentCategory.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter
    const isNewRequirement = req.status === 'new'
    return matchesSearch && matchesPriority && isNewRequirement
  })

  const handleProceedToRFQ = (requirement) => {
    updateRequirementStatus(requirement.id, 'under_review')
    navigate('/create-rfq', { state: { requirement } })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Planning & Inventory Insights</h1>
          <p className="text-gray-600 mt-1">Review procurement requirements generated from inventory analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunAIAnalysis}
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Triggering AI Workflow...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Trigger Inventory AI Workflow
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between shadow-xs ${
          notification.isError ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            {notification.isError ? <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
            <span>{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs underline ml-4 hover:opacity-80">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequirements.map((requirement) => (
          <Card key={requirement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{requirement.componentName}</CardTitle>
                  <p className="text-sm text-gray-600">{requirement.componentCategory}</p>
                </div>
                <StatusBadge status={requirement.priority} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Required</span>
                  <p className="font-medium">{requirement.requiredQuantity.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">In Stock</span>
                  <p className="font-medium">{requirement.currentInventory.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Shortage</span>
                  <p className={`font-medium ${requirement.shortageQuantity > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                    {requirement.shortageQuantity.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Required By</span>
                  <p className="font-medium">{requirement.requiredDeliveryDate}</p>
                </div>
                <div>
                  <span className="text-gray-600">Urgency</span>
                  <p className="font-medium capitalize">{requirement.priority}</p>
                </div>
                <div>
                  <span className="text-gray-600">Recommended</span>
                  <p className="font-medium">{requirement.recommendedQuantity?.toLocaleString() || requirement.shortageQuantity.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <span className="text-xs text-gray-600">Reason for Need</span>
                <p className="text-sm text-gray-800 mt-1">{requirement.reason || 'Insufficient stock for production requirements'}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>{requirement.id}</span>
              </div>

              <div className="flex gap-2 pt-2">
                {requirement.status === 'new' && (
                  <>
                    <Button variant="primary" size="sm" className="flex-1 font-semibold" onClick={() => handleProceedToRFQ(requirement)}>
                      Create RFQ
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      disabled={sendingId === requirement.id}
                      className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold flex items-center justify-center gap-1.5" 
                      onClick={() => handleReportShortage(requirement)}
                    >
                      {sendingId === requirement.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                      Trigger Workflow
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PlanningInsights
