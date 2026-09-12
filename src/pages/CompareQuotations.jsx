import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import StatusBadge from '../components/shared/StatusBadge'
import RiskBadge from '../components/shared/RiskBadge'
import ConfirmationDialog from '../components/shared/ConfirmationDialog'
import HighRiskWarningDialog from '../components/shared/HighRiskWarningDialog'
import { ArrowLeft, Check, DollarSign, Calendar, Truck, Star, ExternalLink } from 'lucide-react'

const CompareQuotations = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { quotations, rfqs, selectSupplier, workflowStatuses, getSupplierRiskData, suppliers } = useWorkflow()
  
  const [selectedQuotationId, setSelectedQuotationId] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showHighRiskDialog, setShowHighRiskDialog] = useState(false)
  const [highRiskSupplier, setHighRiskSupplier] = useState(null)

  const rfqQuotations = quotations.filter(q => q.rfqId === id)
  const rfq = rfqs.find(r => r.id === id)

  const handleSelectQuotation = (quotationId) => {
    const quotation = rfqQuotations.find(q => q.id === quotationId)
    const riskData = getSupplierRiskData(quotation.supplierId)
    
    if (riskData && riskData.overallRiskLevel === 'high') {
      setHighRiskSupplier({
        name: quotation.supplierName,
        riskReason: riskData.riskAnalysis.contributingFactors[0],
        riskLevel: riskData.overallRiskLevel
      })
      setSelectedQuotationId(quotationId)
      setShowHighRiskDialog(true)
    } else {
      setSelectedQuotationId(quotationId)
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmSelection = () => {
    if (selectedQuotationId) {
      selectSupplier(id, selectedQuotationId)
      setShowConfirmDialog(false)
      setShowHighRiskDialog(false)
      alert('Supplier selected successfully! Request sent for Finance Approval.')
      navigate('/quotations')
    }
  }

  const handleProceedAnyway = () => {
    setShowHighRiskDialog(false)
    setShowConfirmDialog(true)
  }

  const handleViewRiskAnalysis = (supplierId) => {
    navigate(`/supplier-risk-analysis/${supplierId}`)
  }

  if (rfqQuotations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No quotations found for this RFQ</p>
        <Button onClick={() => navigate('/quotations')} className="mt-4">Back to Quotations</Button>
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
          <h1 className="text-2xl font-bold text-navy-900">Compare Quotations</h1>
          <p className="text-gray-600 mt-1">{id} • {rfq?.component}</p>
        </div>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Criteria</th>
                  {rfqQuotations.map((quotation) => {
                    const riskData = getSupplierRiskData(quotation.supplierId)
                    return (
                      <th key={quotation.id} className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex flex-col items-center gap-2">
                          <span>{quotation.supplierName}</span>
                          {riskData && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRiskAnalysis(quotation.supplierId)}
                              className="text-xs flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Risk: {riskData.overallRiskScore}
                            </Button>
                          )}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Unit Price</td>
                  {rfqQuotations.map((quotation) => (
                    <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                      <span className="font-semibold">₹{quotation.unitPrice?.toLocaleString()}</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Price</td>
                  {rfqQuotations.map((quotation) => (
                    <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                      <span className="font-semibold text-lg">₹{quotation.totalPrice?.toLocaleString()}</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Available Quantity</td>
                  {rfqQuotations.map((quotation) => (
                    <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                      {quotation.availableQuantity?.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Delivery Time</td>
                  {rfqQuotations.map((quotation) => (
                    <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                      {quotation.deliveryTime} days
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Risk Level</td>
                  {rfqQuotations.map((quotation) => {
                    const riskData = getSupplierRiskData(quotation.supplierId)
                    return (
                      <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                        {riskData ? <RiskBadge level={riskData.overallRiskLevel} size="sm" /> : 'N/A'}
                      </td>
                    )
                  })}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Risk Score</td>
                  {rfqQuotations.map((quotation) => {
                    const riskData = getSupplierRiskData(quotation.supplierId)
                    return (
                      <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                        {riskData ? (
                          <span className="font-semibold">{riskData.overallRiskScore}</span>
                        ) : 'N/A'}
                      </td>
                    )
                  })}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Payment Terms</td>
                  {rfqQuotations.map((quotation) => (
                    <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                      {quotation.paymentTerms || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Status</td>
                  {rfqQuotations.map((quotation) => (
                    <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                      <StatusBadge status={quotation.status} />
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Action</td>
                  {rfqQuotations.map((quotation) => (
                    <td key={quotation.id} className="px-6 py-4 text-sm text-center">
                      {quotation.status === 'submitted' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSelectQuotation(quotation.id)}
                          disabled={selectedQuotationId !== null && selectedQuotationId !== quotation.id}
                        >
                          {selectedQuotationId === quotation.id ? 'Selected' : 'Select'}
                        </Button>
                      ) : quotation.status === 'selected' ? (
                        <span className="text-success-600 font-medium">Selected</span>
                      ) : null}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* RFQ Summary */}
      <Card>
        <CardHeader>
          <CardTitle>RFQ Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Budget</label>
            <p className="text-lg font-bold text-navy-900">₹{rfq?.expectedBudget?.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Quantity</label>
            <p className="text-lg font-bold text-navy-900">{rfq?.quantity?.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Deadline</label>
            <p className="text-lg font-bold text-navy-900">{rfq?.deliveryDeadline}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quotations Received</label>
            <p className="text-lg font-bold text-navy-900">{rfqQuotations.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSelection}
        title="Confirm Supplier Selection"
        message="Are you sure you want to select this supplier? This will send the request to Finance for approval."
        confirmText="Confirm Selection"
        cancelText="Cancel"
      />

      {/* High Risk Warning Dialog */}
      {highRiskSupplier && (
        <HighRiskWarningDialog
          isOpen={showHighRiskDialog}
          onClose={() => setShowHighRiskDialog(false)}
          onProceed={handleProceedAnyway}
          supplierName={highRiskSupplier.name}
          riskReason={highRiskSupplier.riskReason}
          riskLevel={highRiskSupplier.riskLevel}
        />
      )}
    </div>
  )
}

export default CompareQuotations
