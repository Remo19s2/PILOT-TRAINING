import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { FileText, Plus, Eye, Edit, Send, CheckCircle, Clock, AlertTriangle, Package, Truck, Calendar, DollarSign, Search, Filter, MoreVertical, X } from 'lucide-react'

const PurchaseOrders = () => {
  const [selectedPO, setSelectedPO] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleViewPO = (po) => {
    setSelectedPO(po)
  }

  const handleEditPO = (po) => {
    alert(`Editing PO ${po.id}`)
  }

  const handleSendForShipment = (po) => {
    alert(`PO ${po.id} sent for shipment!`)
  }

  const handleCreatePO = () => {
    alert('Purchase Order created successfully!')
    setShowCreateModal(false)
  }

  const handleDownloadPDF = (po) => {
    alert(`Downloading PDF for ${po.id}`)
  }

  const handleCancelPO = (po) => {
    if (confirm(`Are you sure you want to cancel ${po.id}?`)) {
      alert(`PO ${po.id} cancelled!`)
      setSelectedPO(null)
    }
  }

  const purchaseOrders = [
    {
      id: 'PO-2024-001',
      supplier: 'TechCorp Industries',
      supplierId: 'SUP-001',
      items: [
        { name: 'Electronic Control Units', quantity: 10000, unitPrice: 97, total: 970000 },
      ],
      totalAmount: 970000,
      status: 'pending_acknowledgement',
      orderDate: '2024-01-12',
      expectedDelivery: '2024-01-26',
      deliveryAddress: 'Main Warehouse, Industrial Zone',
      paymentTerms: 'Net 45',
      notes: 'Split order - 60% TechCorp, 40% AutoParts',
    },
    {
      id: 'PO-2024-002',
      supplier: 'IndustrialX Manufacturing',
      supplierId: 'SUP-002',
      items: [
        { name: 'Steel Sheets', quantity: 12000, unitPrice: 7.25, total: 87000 },
      ],
      totalAmount: 87000,
      status: 'acknowledged',
      orderDate: '2024-01-11',
      expectedDelivery: '2024-01-29',
      deliveryAddress: 'Main Warehouse, Industrial Zone',
      paymentTerms: 'Net 30',
      notes: 'Volume commitment: 12,000 kg',
    },
    {
      id: 'PO-2024-003',
      supplier: 'AutoParts Premium',
      supplierId: 'SUP-003',
      items: [
        { name: 'Packaging Materials', quantity: 5000, unitPrice: 8.4, total: 42000 },
      ],
      totalAmount: 42000,
      status: 'in_transit',
      orderDate: '2024-01-05',
      expectedDelivery: '2024-01-15',
      deliveryAddress: 'Main Warehouse, Industrial Zone',
      paymentTerms: 'Net 30',
      notes: '12-month quarterly commitment',
    },
    {
      id: 'PO-2024-004',
      supplier: 'PrimeMfg Solutions',
      supplierId: 'SUP-004',
      items: [
        { name: 'Logistics Services', quantity: 1, unitPrice: 76000, total: 76000 },
      ],
      totalAmount: 76000,
      status: 'delivered',
      orderDate: '2024-01-02',
      expectedDelivery: '2024-01-10',
      deliveryAddress: 'Main Warehouse, Industrial Zone',
      paymentTerms: 'Net 30',
      notes: 'Business hours support (8am-6pm)',
    },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      pending_acknowledgement: 'warning',
      acknowledged: 'primary',
      in_transit: 'accent',
      delivered: 'success',
      cancelled: 'danger',
    }
    const labels = {
      pending_acknowledgement: 'Pending Acknowledgement',
      acknowledged: 'Acknowledged',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Purchase Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track purchase orders</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total POs</p>
                <p className="text-2xl font-bold text-navy-900">{purchaseOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Acknowledgement</p>
                <p className="text-2xl font-bold text-warning-600">{purchaseOrders.filter(po => po.status === 'pending_acknowledgement').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent-100 rounded-lg">
                <Truck className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-accent-600">{purchaseOrders.filter(po => po.status === 'in_transit').length}</p>
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
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-success-600">{purchaseOrders.filter(po => po.status === 'delivered').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search PO ID or supplier..."
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
                <option value="pending_acknowledgement">Pending Acknowledgement</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>{filteredPOs.length} orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">PO ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Supplier</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Total Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Order Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Expected Delivery</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-navy-900">{po.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{po.supplier}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{po.items.length} item(s)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-navy-900">₹{po.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{po.orderDate}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{po.expectedDelivery}</span>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(po.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleViewPO(po)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleEditPO(po)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        {po.status === 'acknowledged' && (
                          <Button variant="primary" size="sm" onClick={() => handleSendForShipment(po)}>
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PO Detail Modal */}
      {selectedPO && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Purchase Order Details</CardTitle>
                  <CardDescription>{selectedPO.id}</CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setSelectedPO(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Supplier Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Supplier</p>
                  <p className="font-medium text-navy-900">{selectedPO.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Supplier ID</p>
                  <p className="font-medium text-navy-900">{selectedPO.supplierId}</p>
                </div>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium text-navy-900">{selectedPO.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Delivery</p>
                  <p className="font-medium text-navy-900">{selectedPO.expectedDelivery}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Terms</p>
                  <p className="font-medium text-navy-900">{selectedPO.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  {getStatusBadge(selectedPO.status)}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-navy-900 mb-3">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4 font-semibold text-sm">Item</th>
                        <th className="text-right py-2 px-4 font-semibold text-sm">Quantity</th>
                        <th className="text-right py-2 px-4 font-semibold text-sm">Unit Price</th>
                        <th className="text-right py-2 px-4 font-semibold text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-4">{item.name}</td>
                          <td className="py-2 px-4 text-right">{item.quantity.toLocaleString()}</td>
                          <td className="py-2 px-4 text-right">₹{item.unitPrice.toLocaleString()}</td>
                          <td className="py-2 px-4 text-right font-medium">₹{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold text-navy-900">Total Amount</span>
                <span className="text-2xl font-bold text-primary-600">₹{selectedPO.totalAmount.toLocaleString()}</span>
              </div>

              {/* Delivery Address */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                <p className="text-gray-900">{selectedPO.deliveryAddress}</p>
              </div>

              {/* Notes */}
              {selectedPO.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-gray-900">{selectedPO.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedPO.status === 'pending_acknowledgement' && (
                  <>
                    <Button variant="secondary" onClick={() => handleEditPO(selectedPO)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit PO
                    </Button>
                    <Button variant="danger" onClick={() => handleCancelPO(selectedPO)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel PO
                    </Button>
                  </>
                )}
                {selectedPO.status === 'acknowledged' && (
                  <Button variant="primary" onClick={() => handleSendForShipment(selectedPO)}>
                    <Send className="w-4 h-4 mr-2" />
                    Send for Shipment
                  </Button>
                )}
                <Button variant="secondary" onClick={() => handleDownloadPDF(selectedPO)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Create PO Modal */}
      {showCreateModal && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>Create Purchase Order</CardTitle>
                <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <Select>
                    <option value="">Select Supplier</option>
                    <option value="techcorp">TechCorp Industries</option>
                    <option value="industrialx">IndustrialX Manufacturing</option>
                    <option value="autoparts">AutoParts Premium</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
                  <Input type="date" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                <Input placeholder="Enter delivery address" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <Select>
                  <option value="net30">Net 30</option>
                  <option value="net45">Net 45</option>
                  <option value="net60">Net 60</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-4 gap-3">
                    <Input placeholder="Item name" />
                    <Input type="number" placeholder="Quantity" />
                    <Input type="number" placeholder="Unit Price" />
                    <Button variant="secondary">Add</Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Add any notes or special instructions..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="primary" className="flex-1" onClick={handleCreatePO}>
                  <Send className="w-4 h-4 mr-2" />
                  Create & Send PO
                </Button>
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  )
}

export default PurchaseOrders
