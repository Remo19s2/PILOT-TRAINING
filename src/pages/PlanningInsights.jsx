import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import StatusBadge from '../components/shared/StatusBadge'
import { Package, Search, Filter } from 'lucide-react'

const PlanningInsights = () => {
  const navigate = useNavigate()
  const { requirements, updateRequirementStatus } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')

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
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Planning & Inventory Insights</h1>
        <p className="text-gray-600 mt-1">Review procurement requirements generated from inventory analysis</p>
      </div>

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
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => handleProceedToRFQ(requirement)}>
                    Create RFQ
                  </Button>
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
