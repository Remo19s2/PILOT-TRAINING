import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { Timeline } from '../components/ui/Timeline'
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, Send, Calendar, Package, FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, ArrowUpDown } from 'lucide-react'

const RFQManagementComplete = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [showComparison, setShowComparison] = useState(false)

  const rfqStatuses = {
    draft: { label: 'Draft', color: 'default', icon: FileText },
    sent: { label: 'Sent', color: 'primary', icon: Send },
    partially_responded: { label: 'Partially Responded', color: 'warning', icon: Clock },
    completed: { label: 'Completed', color: 'success', icon: CheckCircle },
    closed: { label: 'Closed', color: 'default', icon: CheckCircle },
  }

  const rfqs = [
    { 
      id: 'RFQ-2024-001', 
      component: 'Electronic Control Unit',
      quantity: 10000,
      suppliersInvited: ['TechCorp Industries', 'IndustrialX Manufacturing', 'AutoParts Premium'],
      responsesReceived: 3,
      status: 'completed',
      deadline: '2024-01-15',
      requiredDeliveryDate: '2024-01-28',
      qualityRequirements: 'ISO 9001 certified, RoHS compliant',
      notes: 'High priority for Q1 production',
    },
    { 
      id: 'RFQ-2024-002', 
      component: 'Steel Sheets - Grade A',
      quantity: 30000,
      suppliersInvited: ['IndustrialX Manufacturing', 'GlobalSupply Co.'],
      responsesReceived: 2,
      status: 'completed',
      deadline: '2024-01-18',
      requiredDeliveryDate: '2024-02-05',
      qualityRequirements: 'ASTM A36, Grade 50',
      notes: 'Critical inventory shortage',
    },
    { 
      id: 'RFQ-2024-003', 
      component: 'Packaging Boxes - Large',
      quantity: 18000,
      suppliersInvited: ['GlobalSupply Co.', 'PrimeMfg Solutions', 'EcoPack Ltd'],
      responsesReceived: 1,
      status: 'partially_responded',
      deadline: '2024-01-20',
      requiredDeliveryDate: '2024-02-10',
      qualityRequirements: 'Recyclable materials, FDA approved',
      notes: 'Sustainable packaging initiative',
    },
    { 
      id: 'RFQ-2024-004', 
      component: 'Circuit Boards - Model X',
      quantity: 5500,
      suppliersInvited: ['AutoParts Premium', 'TechCorp Industries'],
      responsesReceived: 0,
      status: 'sent',
      deadline: '2024-01-25',
      requiredDeliveryDate: '2024-02-05',
      qualityRequirements: 'IPC Class 2 standards',
      notes: 'Customer order deadline',
    },
    { 
      id: 'RFQ-2024-005', 
      component: 'Automotive Fasteners',
      quantity: 7000,
      suppliersInvited: ['PrimeMfg Solutions', 'GlobalSupply Co.'],
      responsesReceived: 0,
      status: 'draft',
      deadline: '2024-01-30',
      requiredDeliveryDate: '2024-02-20',
      qualityRequirements: 'ISO 898-1',
      notes: 'Standard procurement',
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = rfqStatuses[status]
    return <Badge variant={statusConfig.color}>{statusConfig.label}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success',
    }
    return <Badge variant={variants[priority]}>{priority}</Badge>
  }

  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = rfq.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.deadline) - new Date(a.deadline)
    return 0
  })

  const handleViewRFQ = (rfq) => {
    setSelectedRFQ(rfq)
    setShowViewModal(true)
  }

  const handleCreateRFQ = () => {
    setShowCreateModal(true)
  }

  const handleSendRFQ = (rfqId) => {
    console.log('Send RFQ:', rfqId)
  }

  const QuotationComparison = ({ quotations }) => (
    <div className="space-y-4">
      <h4 className="font-semibold text-navy-900">Supplier Quotation Comparison</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Terms</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quot, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{quot.supplier}</TableCell>
              <TableCell className="font-semibold">${quot.price.toLocaleString()}</TableCell>
              <TableCell>{quot.delivery}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${quot.score >= 90 ? 'bg-success-600' : quot.score >= 80 ? 'bg-primary-600' : 'bg-warning-600'}`}
                      style={{ width: `${quot.score}%` }}
                    />
                  </div>
                  <span className="text-sm">{quot.score}</span>
                </div>
              </TableCell>
              <TableCell>{quot.terms}</TableCell>
              <TableCell>
                <Button variant="success" size="sm">Select</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">RFQ Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and track requests for quotations</p>
        </div>
        <Button onClick={handleCreateRFQ}>
          <Plus className="w-4 h-4 mr-2" />
          Create RFQ
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total RFQs</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">{rfqs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Draft</p>
            <p className="text-2xl font-bold text-gray-500 mt-1">{rfqs.filter(r => r.status === 'draft').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Sent</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">{rfqs.filter(r => r.status === 'sent' || r.status === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Under Review</p>
            <p className="text-2xl font-bold text-accent-600 mt-1">{rfqs.filter(r => r.status === 'evaluation' || r.status === 'negotiation').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-success-600 mt-1">{rfqs.filter(r => r.status === 'approved' || r.status === 'closed').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
              <option value="all">All Status</option>
              {Object.entries(rfqStatuses).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </Select>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-40">
              <option value="date">Sort by Date</option>
              <option value="deadline">Sort by Deadline</option>
              <option value="value">Sort by Value</option>
            </Select>
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RFQ Table */}
      <Card>
        <CardHeader>
          <CardTitle>RFQ Management</CardTitle>
          <CardDescription>View, create, edit, send, and track supplier responses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ ID</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Suppliers Invited</TableHead>
                <TableHead>Responses Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFQs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">{rfq.id}</TableCell>
                  <TableCell>{rfq.component}</TableCell>
                  <TableCell>{rfq.quantity.toLocaleString()}</TableCell>
                  <TableCell>{rfq.suppliersInvited.length}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{rfq.responsesReceived}/{rfq.suppliersInvited.length}</span>
                      {rfq.responsesReceived === rfq.suppliersInvited.length && rfq.suppliersInvited.length > 0 && (
                        <CheckCircle className="w-4 h-4 text-success-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                  <TableCell>{rfq.deadline}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {rfq.status === 'draft' && (
                        <Button variant="success" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View RFQ Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title={selectedRFQ?.id}
        size="xl"
      >
        {selectedRFQ && (
          <div className="space-y-6">
            {/* RFQ Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy-900">{selectedRFQ.title}</h3>
                <p className="text-gray-600 mt-1">{selectedRFQ.description}</p>
              </div>
              {getStatusBadge(selectedRFQ.status)}
            </div>

            {/* RFQ Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-navy-900">{selectedRFQ.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-medium text-navy-900">{selectedRFQ.quantity} {selectedRFQ.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-medium text-navy-900">{selectedRFQ.deadline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Value</p>
                <p className="font-medium text-navy-900">${selectedRFQ.estimatedValue.toLocaleString()}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Technical Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{selectedRFQ.technicalRequirements}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delivery Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{selectedRFQ.deliveryRequirements}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">BOM Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{selectedRFQ.bomRequirements}</p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">RFQ Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline items={selectedRFQ.timeline} />
              </CardContent>
            </Card>

            {/* Quotations */}
            {selectedRFQ.quotations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Received Quotations</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuotationComparison quotations={selectedRFQ.quotations} />
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              {selectedRFQ.status === 'draft' && (
                <Button variant="primary">
                  <Send className="w-4 h-4 mr-2" />
                  Send RFQ
                </Button>
              )}
              {selectedRFQ.status === 'evaluation' && (
                <>
                  <Button variant="secondary">
                    Request Revision
                  </Button>
                  <Button variant="warning">
                    Start Negotiation
                  </Button>
                  <Button variant="success">
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Create RFQ Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New RFQ"
        size="xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Component</label>
            <Select>
              <option value="">Select component</option>
              <option value="ecu">Electronic Control Unit</option>
              <option value="steel">Steel Sheets - Grade A</option>
              <option value="circuit">Circuit Boards - Model X</option>
              <option value="packaging">Packaging Boxes - Large</option>
              <option value="fasteners">Automotive Fasteners</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <Input type="number" placeholder="Enter quantity" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Delivery Date</label>
              <Input type="date" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality Requirements</label>
            <Input placeholder="Enter quality requirements (e.g., ISO 9001 certified)" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selected Suppliers</label>
            <Select>
              <option value="">Select suppliers</option>
              <option value="techcorp">TechCorp Industries</option>
              <option value="industrialx">IndustrialX Manufacturing</option>
              <option value="autoparts">AutoParts Premium</option>
              <option value="globalsupply">GlobalSupply Co.</option>
              <option value="primemfg">PrimeMfg Solutions</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Input placeholder="Enter additional notes" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Save as Draft
            </Button>
            <Button variant="success">
              <Send className="w-4 h-4 mr-2" />
              Send RFQ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default RFQManagementComplete
