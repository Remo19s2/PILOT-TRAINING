import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ArrowLeft, CheckCircle, Package, Truck, DollarSign, AlertTriangle, Star, Shield, FileText, Send } from 'lucide-react'

const FinalSupplierSelection = () => {
  const navigate = useNavigate()
  const { rfqId } = useParams()
  const { negotiations, quotations, suppliers, selectSupplier } = useWorkflow()
  
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Get negotiated suppliers for this RFQ
  const rfqNegotiations = negotiations.filter(n => n.rfqId === rfqId && n.dealStatus === 'agreed')
  const negotiatedSuppliers = rfqNegotiations.map(neg => {
    const supplier = suppliers.find(s => s.id === neg.supplierId)
    const quotation = quotations.find(q => q.rfqId === rfqId && q.supplierId === neg.supplierId)
    return {
      ...supplier,
      ...neg,
      quotation,
      finalPrice: neg.finalAgreedPrice || neg.currentOffer,
      finalDelivery: neg.finalDelivery || neg.deliveryRequirement,
      totalValue: (neg.finalAgreedPrice || neg.currentOffer) * neg.quantity,
      savings: neg.totalSavings || 0
    }
  })

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setShowConfirmation(true)
  }

  const handleConfirmSelection = () => {
    if (!selectedSupplier) return
    
    // Select the supplier and proceed to finance approval
    selectSupplier(rfqId, selectedSupplier.quotation?.id)
    setShowConfirmation(false)
    
    // Navigate to finance approval
    navigate('/approval-status')
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Final Supplier Selection</h1>
          <p className="text-gray-600 mt-1">{rfqId} - Select the final supplier after negotiation</p>
        </div>
      </div>

      {/* RFQ Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Procurement Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rfqNegotiations.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">RFQ ID</span>
                <p className="font-medium">{rfqId}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Component</span>
                <p className="font-medium">{rfqNegotiations[0].component}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Required Quantity</span>
                <p className="font-medium">{rfqNegotiations[0].quantity} Units</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Negotiated Suppliers</span>
                <p className="font-medium">{negotiatedSuppliers.length}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Negotiated Suppliers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success-600" />
            Negotiated Suppliers
          </CardTitle>
          <CardDescription>Suppliers with agreed deals - select one for final selection</CardDescription>
        </CardHeader>
        <CardContent>
          {negotiatedSuppliers.length > 0 ? (
            <div className="space-y-4">
              {negotiatedSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className={`p-6 border rounded-lg hover:shadow-md transition-all ${
                    selectedSupplier?.id === supplier.id
                      ? 'border-2 border-primary-500 bg-primary-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-navy-900">{supplier.name}</h3>
                        <Badge variant="success">Deal Agreed</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{supplier.id} • {supplier.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{supplier.rating}</span>
                      </div>
                      <Badge variant={supplier.riskLevel === 'Low' ? 'success' : supplier.riskLevel === 'Medium' ? 'warning' : 'danger'}>
                        {supplier.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>

                  {/* Final Deal Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded">
                    <div>
                      <span className="text-sm text-gray-600">Final Price</span>
                      <p className="text-2xl font-bold text-green-600">₹{supplier.finalPrice}/unit</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Value</span>
                      <p className="text-xl font-bold text-navy-900">₹{supplier.totalValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Delivery</span>
                      <p className="text-lg font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        {supplier.finalDelivery} Days
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Negotiation Savings</span>
                      <p className="text-lg font-bold text-green-600">₹{supplier.savings.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Supplier Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">Quality Score</span>
                      <p className="font-medium">{supplier.qualityScore}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery Performance</span>
                      <p className="font-medium">{supplier.previousPerformance}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Overall Score</span>
                      <p className="font-bold text-primary-600">{supplier.overallScore}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Terms</span>
                      <p className="font-medium">{supplier.paymentTerms}</p>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  {supplier.riskLevel === 'High' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-800">High Risk Warning</span>
                      </div>
                      <p className="text-sm text-red-700">This supplier has a high predicted risk score. Consider this carefully before selection.</p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSelectSupplier(supplier)}
                    className="w-full"
                    variant={selectedSupplier?.id === supplier.id ? 'primary' : 'secondary'}
                  >
                    {selectedSupplier?.id === supplier.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Select This Supplier
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No negotiated suppliers found</p>
              <p className="text-sm text-gray-500 mt-2">Complete negotiations with suppliers first</p>
              <Button onClick={() => navigate(`/negotiation-center/${rfqId}`)} className="mt-4">
                Go to Negotiation Center
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selection Confirmation */}
      {showConfirmation && selectedSupplier && (
        <Card className="border-2 border-primary-200 bg-primary-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-600" />
              Confirm Final Supplier Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              You are about to select <strong>{selectedSupplier.name}</strong> as the final supplier for this procurement.
            </p>

            <div className="bg-white p-4 rounded space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier:</span>
                <span className="font-medium">{selectedSupplier.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Component:</span>
                <span className="font-medium">{selectedSupplier.component}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{selectedSupplier.quantity} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final Price:</span>
                <span className="font-bold text-green-600">₹{selectedSupplier.finalPrice}/unit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-bold text-navy-900">₹{selectedSupplier.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium">{selectedSupplier.finalDelivery} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Negotiation Savings:</span>
                <span className="font-bold text-green-600">₹{selectedSupplier.savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Score:</span>
                <span className="font-bold text-primary-600">{selectedSupplier.overallScore}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Next Step:</strong> This selection will be sent to Finance Approver for final budget approval.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConfirmSelection} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Confirm & Send to Finance Approval
              </Button>
              <Button variant="secondary" onClick={() => setShowConfirmation(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FinalSupplierSelection
