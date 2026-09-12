import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import WorkflowTracker from '../components/shared/WorkflowTracker'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MessageSquare, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  X,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  User,
  Building,
  Calendar,
  FileText
} from 'lucide-react'

const NegotiationCenterNew = () => {
  const navigate = useNavigate()
  const { negotiationId } = useParams()
  const { negotiations, rfqs, suppliers } = useWorkflow()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedNegotiation, setSelectedNegotiation] = useState(null)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [offerData, setOfferData] = useState({
    proposedPrice: '',
    quantity: '',
    delivery: '',
    terms: '',
    message: ''
  })

  // If negotiationId is provided, select that negotiation
  if (negotiationId && !selectedNegotiation) {
    const negotiation = negotiations.find(n => n.id === negotiationId)
    if (negotiation) {
      setSelectedNegotiation(negotiation)
    }
  }

  const getStatusVariant = (status) => {
    const variants = {
      'negotiation_active': 'primary',
      'counter_offer_received': 'warning',
      'awaiting_supplier': 'accent',
      'deal_agreed': 'success',
      'deal_declined': 'danger',
      'negotiation_closed': 'default'
    }
    return variants[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'negotiation_active': 'Negotiation Active',
      'counter_offer_received': 'Counter Offer Received',
      'awaiting_supplier': 'Awaiting Supplier',
      'deal_agreed': 'Deal Agreed',
      'deal_declined': 'Deal Declined',
      'negotiation_closed': 'Negotiation Closed'
    }
    return labels[status] || status
  }

  const filteredNegotiations = negotiations.filter(neg => {
    const matchesSearch = neg.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         neg.component?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         neg.rfqId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || neg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenNegotiation = (negotiation) => {
    setSelectedNegotiation(negotiation)
    navigate(`/negotiation-center/${negotiation.id}`)
  }

  const handleBackToList = () => {
    setSelectedNegotiation(null)
    navigate('/negotiation-center')
  }

  const handleSendOffer = () => {
    if (!selectedNegotiation) return
    
    // Add new history entry
    const newHistory = {
      id: `NH-${Date.now()}`,
      participant: 'procurement',
      action: 'offer_sent',
      message: offerData.message || `Proposed price of ₹${offerData.proposedPrice}/unit`,
      price: parseFloat(offerData.proposedPrice),
      timestamp: new Date().toLocaleString()
    }

    // Update negotiation (in real app, this would be an API call)
    const updatedNegotiation = {
      ...selectedNegotiation,
      currentOffer: parseFloat(offerData.proposedPrice),
      status: 'awaiting_supplier',
      lastUpdated: new Date().toLocaleString(),
      negotiationHistory: [...selectedNegotiation.negotiationHistory, newHistory]
    }

    setSelectedNegotiation(updatedNegotiation)
    setShowOfferForm(false)
    setOfferData({ proposedPrice: '', quantity: '', delivery: '', terms: '', message: '' })
    alert('Negotiation offer sent successfully.')
  }

  const handleAcceptOffer = () => {
    if (!selectedNegotiation) return
    
    const newHistory = {
      id: `NH-${Date.now()}`,
      participant: 'procurement',
      action: 'offer_accepted',
      message: 'Accepted supplier offer',
      price: selectedNegotiation.currentOffer,
      timestamp: new Date().toLocaleString()
    }

    const updatedNegotiation = {
      ...selectedNegotiation,
      status: 'deal_agreed',
      dealStatus: 'agreed',
      finalAgreedPrice: selectedNegotiation.currentOffer,
      finalDelivery: selectedNegotiation.deliveryRequirement,
      totalSavings: (selectedNegotiation.originalPrice - selectedNegotiation.currentOffer) * selectedNegotiation.quantity,
      lastUpdated: new Date().toLocaleString(),
      negotiationHistory: [...selectedNegotiation.negotiationHistory, newHistory]
    }

    setSelectedNegotiation(updatedNegotiation)
    setShowConfirmDialog(false)
    alert('Deal successfully agreed!')
  }

  const handleCounterOffer = () => {
    if (!selectedNegotiation) return
    setShowOfferForm(true)
    setOfferData({
      proposedPrice: selectedNegotiation.currentOffer?.toString() || '',
      quantity: selectedNegotiation.quantity?.toString() || '',
      delivery: selectedNegotiation.deliveryRequirement?.toString() || '',
      terms: selectedNegotiation.paymentTerms || '',
      message: ''
    })
  }

  const handleProceedToApproval = () => {
    // Navigate to Supplier Comparison for final selection
    navigate(`/supplier-comparison/${selectedNegotiation.rfqId}`)
  }

  // List View
  if (!selectedNegotiation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Negotiation Center</h1>
            <p className="text-gray-600 mt-1">Manage supplier negotiations and finalize deals</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search negotiations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="negotiation_active">Negotiation Active</option>
                  <option value="counter_offer_received">Counter Offer Received</option>
                  <option value="awaiting_supplier">Awaiting Supplier</option>
                  <option value="deal_agreed">Deal Agreed</option>
                  <option value="deal_declined">Deal Declined</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Negotiations List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Negotiations</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNegotiations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Current Quote</TableHead>
                    <TableHead>Target Price</TableHead>
                    <TableHead>Latest Offer</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNegotiations.map((neg) => (
                    <TableRow key={neg.id}>
                      <TableCell className="font-medium">{neg.rfqId}</TableCell>
                      <TableCell>{neg.supplierName}</TableCell>
                      <TableCell>{neg.component}</TableCell>
                      <TableCell>₹{neg.revisedPrice}/unit</TableCell>
                      <TableCell>₹{neg.targetPrice}/unit</TableCell>
                      <TableCell className="font-semibold">₹{neg.currentOffer}/unit</TableCell>
                      <TableCell>{neg.deliveryRequirement} Days</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(neg.status)}>
                          {getStatusLabel(neg.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{neg.lastUpdated}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleOpenNegotiation(neg)}
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No negotiations found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Negotiation Workspace View
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={handleBackToList}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Negotiation Workspace</h1>
          <p className="text-gray-600 mt-1">{selectedNegotiation.rfqId} - {selectedNegotiation.supplierName}</p>
        </div>
      </div>

      {/* Workflow Tracker */}
      <WorkflowTracker 
        currentStatus={selectedNegotiation.dealStatus === 'agreed' ? 'supplier_selected' : 'quotation_submitted'} 
        workflowType="procurement"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Quotation Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Supplier Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Supplier Name</span>
                <p className="font-medium">{selectedNegotiation.supplierName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">RFQ ID</span>
                <p className="font-medium">{selectedNegotiation.rfqId}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Component</span>
                <p className="font-medium">{selectedNegotiation.component}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Quantity</span>
                <p className="font-medium">{selectedNegotiation.quantity} Units</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Original Quote</span>
                <span className="font-medium">₹{selectedNegotiation.originalPrice}/unit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revised Quote</span>
                <span className="font-medium">₹{selectedNegotiation.revisedPrice}/unit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target Price</span>
                <span className="font-medium text-green-600">₹{selectedNegotiation.targetPrice}/unit</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Offer</span>
                  <span className="font-bold text-primary-600">₹{selectedNegotiation.currentOffer}/unit</span>
                </div>
              </div>
              
              {/* Price Comparison */}
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-2">Price Progression</p>
                <div className="flex items-center gap-2 text-sm">
                  <span>₹{selectedNegotiation.originalPrice}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span>₹{selectedNegotiation.revisedPrice}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">₹{selectedNegotiation.currentOffer}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-green-600">₹{selectedNegotiation.targetPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Delivery & Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Delivery</span>
                <span className="font-medium">{selectedNegotiation.deliveryRequirement} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Terms</span>
                <span className="font-medium">{selectedNegotiation.paymentTerms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={getStatusVariant(selectedNegotiation.status)}>
                  {getStatusLabel(selectedNegotiation.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Negotiation Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Counter Offer Alert */}
          {selectedNegotiation.status === 'counter_offer_received' && (
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900">Counter Offer Received</h3>
                    <p className="text-sm text-yellow-800 mt-1">
                      Supplier proposes: <strong>₹{selectedNegotiation.currentOffer}/unit</strong>
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                      "{selectedNegotiation.supplierMessage}"
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" onClick={() => setShowConfirmDialog(true)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Offer
                      </Button>
                      <Button size="sm" variant="secondary" onClick={handleCounterOffer}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Counter Offer
                      </Button>
                      <Button size="sm" variant="danger">
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Deal Summary */}
          <Card className={selectedNegotiation.dealStatus === 'agreed' ? 'border-2 border-green-200 bg-green-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedNegotiation.dealStatus === 'agreed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                {selectedNegotiation.dealStatus === 'agreed' ? 'Final Negotiated Deal' : 'Current Deal'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Supplier</span>
                  <p className="font-medium">{selectedNegotiation.supplierName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Component</span>
                  <p className="font-medium">{selectedNegotiation.component}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Quantity</span>
                  <p className="font-medium">{selectedNegotiation.quantity} Units</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Delivery</span>
                  <p className="font-medium">{selectedNegotiation.deliveryRequirement} Days</p>
                </div>
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Current Agreed Price</span>
                    <p className="text-xl font-bold text-primary-600">₹{selectedNegotiation.currentOffer}/unit</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Total Value</span>
                    <p className="text-xl font-bold">₹{(selectedNegotiation.currentOffer * selectedNegotiation.quantity).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Deal Status</span>
                    <Badge variant={selectedNegotiation.dealStatus === 'agreed' ? 'success' : 'primary'}>
                      {selectedNegotiation.dealStatus === 'agreed' ? 'Deal Agreed' : 'Under Negotiation'}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedNegotiation.dealStatus === 'agreed' && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Negotiation Completed</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Final negotiated terms have been agreed with the supplier.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Original Price:</span> ₹{selectedNegotiation.originalPrice}/unit
                    </div>
                    <div>
                      <span className="text-green-700">Final Price:</span> ₹{selectedNegotiation.finalAgreedPrice}/unit
                    </div>
                    <div>
                      <span className="text-green-700">Savings:</span> ₹{selectedNegotiation.originalPrice - selectedNegotiation.finalAgreedPrice}/unit
                    </div>
                    <div>
                      <span className="text-green-700">Total Savings:</span> ₹{selectedNegotiation.totalSavings?.toLocaleString()}
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleProceedToApproval}>
                    Proceed to Approval
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Make Offer Form */}
          {showOfferForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Make Offer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Unit Price (₹)</label>
                    <Input
                      type="number"
                      value={offerData.proposedPrice}
                      onChange={(e) => setOfferData({...offerData, proposedPrice: e.target.value})}
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <Input
                      type="number"
                      value={offerData.quantity}
                      onChange={(e) => setOfferData({...offerData, quantity: e.target.value})}
                      placeholder={selectedNegotiation.quantity?.toString()}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Requirement (Days)</label>
                  <Input
                    type="number"
                    value={offerData.delivery}
                    onChange={(e) => setOfferData({...offerData, delivery: e.target.value})}
                    placeholder={selectedNegotiation.deliveryRequirement?.toString()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Terms</label>
                  <textarea
                    value={offerData.terms}
                    onChange={(e) => setOfferData({...offerData, terms: e.target.value})}
                    placeholder="Enter any additional terms..."
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Negotiation Message</label>
                  <textarea
                    value={offerData.message}
                    onChange={(e) => setOfferData({...offerData, message: e.target.value})}
                    placeholder="Enter your negotiation message..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSendOffer} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send Offer
                  </Button>
                  <Button variant="secondary" onClick={() => setShowOfferForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {selectedNegotiation.dealStatus !== 'agreed' && !showOfferForm && (
            <Card>
              <CardHeader>
                <CardTitle>Negotiation Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedNegotiation.status === 'negotiation_active' || selectedNegotiation.status === 'awaiting_supplier' ? (
                  <Button onClick={() => setShowOfferForm(true)} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send New Offer
                  </Button>
                ) : null}
                {selectedNegotiation.status === 'counter_offer_received' && (
                  <div className="flex gap-2">
                    <Button onClick={() => setShowConfirmDialog(true)} className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Offer
                    </Button>
                    <Button variant="secondary" onClick={handleCounterOffer} className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Counter Offer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Negotiation History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Negotiation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedNegotiation.negotiationHistory?.map((history, index) => (
                  <div key={history.id} className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      history.participant === 'procurement' ? 'bg-primary-100' :
                      history.participant === 'supplier' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {history.participant === 'procurement' && <User className="w-5 h-5 text-primary-600" />}
                      {history.participant === 'supplier' && <Building className="w-5 h-5 text-blue-600" />}
                      {history.participant === 'system' && <Clock className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div className={`flex-1 p-3 rounded-lg ${
                      history.participant === 'procurement' ? 'bg-primary-50 border border-primary-200' :
                      history.participant === 'supplier' ? 'bg-blue-50 border border-blue-200' :
                      'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {history.participant === 'procurement' ? 'Procurement Manager' :
                           history.participant === 'supplier' ? 'Supplier' :
                           'System'}
                        </span>
                        <span className="text-xs text-gray-500">{history.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700">{history.message}</p>
                      {history.price && (
                        <div className="mt-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">₹{history.price}/unit</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Deal Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirm Deal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Supplier:</span>
                  <span className="font-medium">{selectedNegotiation.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Final Price:</span>
                  <span className="font-medium">₹{selectedNegotiation.currentOffer}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quantity:</span>
                  <span className="font-medium">{selectedNegotiation.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery:</span>
                  <span className="font-medium">{selectedNegotiation.deliveryRequirement} Days</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="font-bold">₹{(selectedNegotiation.currentOffer * selectedNegotiation.quantity).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowConfirmDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAcceptOffer} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Deal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default NegotiationCenterNew
