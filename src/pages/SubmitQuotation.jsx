import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { ArrowLeft, Send, Calculator } from 'lucide-react'

const SubmitQuotation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rfqs, currentUser, suppliers, submitQuotation } = useWorkflow()
  
  const rfq = rfqs.find(r => r.id === id)
  const supplierId = currentUser?.id || 'SUP-001'
  const supplier = suppliers.find(s => s.id === supplierId)

  const [formData, setFormData] = useState({
    rfqId: id,
    supplierId: supplierId,
    supplierName: supplier?.name || 'Unknown',
    component: rfq?.component || '',
    quantity: rfq?.quantity || 0,
    unitPrice: '',
    availableQuantity: '',
    deliveryTime: '',
    paymentTerms: '',
    warranty: '',
    additionalNotes: '',
    expectedBudget: rfq?.expectedBudget || 0,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateTotal = () => {
    const unitPrice = parseFloat(formData.unitPrice) || 0
    const quantity = formData.quantity
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

    setIsSubmitting(true)

    const quotationData = {
      ...formData,
      unitPrice: parseFloat(formData.unitPrice),
      availableQuantity: parseInt(formData.availableQuantity),
      totalPrice: calculateTotal(),
      deliveryTime: parseInt(formData.deliveryTime),
    }

    submitQuotation(quotationData)
    
    setIsSubmitting(false)
    alert('Quotation submitted successfully!')
    navigate('/submitted-quotations')
  }

  if (!rfq) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">RFQ not found</p>
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
          <h1 className="text-2xl font-bold text-navy-900">Submit Quotation</h1>
          <p className="text-gray-600 mt-1">{rfq.id} • {rfq.component}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotation Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RFQ ID</label>
                    <Input
                      name="rfqId"
                      value={formData.rfqId}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Component</label>
                    <Input
                      name="component"
                      value={formData.component}
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
                      value={formData.quantity}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price (₹) *</label>
                    <Input
                      type="number"
                      name="unitPrice"
                      placeholder="Enter unit price"
                      value={formData.unitPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-primary-900">Total Price</span>
                  </div>
                  <p className="text-3xl font-bold text-primary-600">₹{calculateTotal().toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Quotation'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RFQ Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Budget</label>
                <p className="text-lg font-bold text-navy-900">₹{rfq.expectedBudget?.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Deadline</label>
                <p className="text-gray-900">{rfq.deliveryDeadline}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                <p className="text-sm text-gray-900">{rfq.specifications || 'None provided'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-gray-900">{supplier?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <p className="text-gray-900">{supplier?.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <p className="text-gray-900">{supplier?.rating}/5</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SubmitQuotation
