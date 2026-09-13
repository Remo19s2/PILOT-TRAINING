import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { ArrowLeft, RefreshCw, Calculator, History } from 'lucide-react'

const ReviseQuotation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { quotations, reviseQuotation } = useWorkflow()
  
  const quotation = quotations.find(q => q.id === id)

  const [formData, setFormData] = useState({
    unitPrice: quotation?.unitPrice || '',
    availableQuantity: quotation?.availableQuantity || '',
    deliveryTime: quotation?.deliveryTime || '',
    paymentTerms: quotation?.paymentTerms || '',
    warranty: quotation?.warranty || '',
    additionalNotes: quotation?.additionalNotes || '',
    revisionReason: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateTotal = () => {
    const unitPrice = parseFloat(formData.unitPrice) || 0
    const quantity = quotation?.quantity || 0
    return unitPrice * quantity
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.unitPrice || !formData.availableQuantity || !formData.deliveryTime) {
      alert('Please fill in all required fields')
      return
    }

    if (!formData.revisionReason) {
      alert('Please provide a reason for the revision')
      return
    }

    setIsSubmitting(true)

    const revisedData = {
      unitPrice: parseFloat(formData.unitPrice),
      availableQuantity: parseInt(formData.availableQuantity),
      totalPrice: calculateTotal(),
      deliveryTime: parseInt(formData.deliveryTime),
      paymentTerms: formData.paymentTerms,
      warranty: formData.warranty,
      additionalNotes: formData.additionalNotes,
      supplierNotes: formData.revisionReason,
    }

    reviseQuotation(id, revisedData)
    
    setIsSubmitting(false)
    alert('Quotation revised successfully!')
    navigate('/submitted-quotations')
  }

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Quotation not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Revise Quotation</h1>
          <p className="text-gray-600 mt-1">{quotation.rfqId} • {quotation.component}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revision Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revision Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RFQ ID</label>
                    <Input
                      name="rfqId"
                      value={quotation.rfqId}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Component</label>
                    <Input
                      name="component"
                      value={quotation.component}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Quantity</label>
                    <Input
                      name="quantity"
                      value={quotation.quantity}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Unit Price (₹)</label>
                    <Input
                      name="previousPrice"
                      value={quotation.previousPrice || quotation.unitPrice}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Unit Price (₹) *</label>
                    <Input
                      type="number"
                      name="unitPrice"
                      placeholder="Enter new unit price"
                      value={formData.unitPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity *</label>
                    <Input
                      type="number"
                      name="availableQuantity"
                      placeholder="Enter available quantity"
                      value={formData.availableQuantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-primary-900">New Total Price</span>
                  </div>
                  <p className="text-3xl font-bold text-primary-600">₹{calculateTotal().toLocaleString()}</p>
                  {quotation.previousPrice && (
                    <p className="text-sm text-gray-600 mt-1">
                      Previous: ₹{(quotation.previousPrice * quotation.quantity).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time (days) *</label>
                    <Input
                      type="number"
                      name="deliveryTime"
                      placeholder="Enter delivery time in days"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                    <Select
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleInputChange}
                    >
                      <option value="">Select payment terms</option>
                      <option value="net_30">Net 30 days</option>
                      <option value="net_45">Net 45 days</option>
                      <option value="net_60">Net 60 days</option>
                      <option value="advance_50">50% Advance, 50% on Delivery</option>
                      <option value="lc">Letter of Credit</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty / Quality Information</label>
                  <textarea
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="Enter warranty and quality information..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Revision *</label>
                  <textarea
                    name="revisionReason"
                    value={formData.revisionReason}
                    onChange={handleInputChange}
                    placeholder="Explain why you are revising this quotation..."
                    rows={3}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Revision'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quotation History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Revision History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quotation.quotationHistory && quotation.quotationHistory.length > 0 ? (
                quotation.quotationHistory.map((history, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-navy-900">Version {history.version}</span>
                      <span className="text-xs text-gray-600">
                        {new Date(history.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Price: ₹{history.unitPrice}/unit</p>
                      <p>Total: ₹{history.totalPrice?.toLocaleString()}</p>
                      <p>Delivery: {history.deliveryTime} days</p>
                      {history.notes && <p className="text-gray-600 italic">"{history.notes}"</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No revision history</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>RFQ Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Budget</label>
                <p className="text-lg font-bold text-navy-900">₹{quotation.expectedBudget?.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Deadline</label>
                <p className="text-gray-900">{quotation.deliveryDeadline}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ReviseQuotation
