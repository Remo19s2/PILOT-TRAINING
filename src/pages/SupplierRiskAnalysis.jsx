import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ArrowLeft, Calendar, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react'
import RiskBadge from '../components/shared/RiskBadge'
import RiskScoreCard from '../components/shared/RiskScoreCard'
import HistoricalPerformanceCard from '../components/shared/HistoricalPerformanceCard'
import RiskBreakdownChart from '../components/shared/RiskBreakdownChart'
import RiskTrendChart from '../components/shared/RiskTrendChart'
import RiskExplanationPanel from '../components/shared/RiskExplanationPanel'
import { triggerSupplierRiskReview, triggerAlternativeSupplierRequest } from '../api/events'

const SupplierRiskAnalysis = () => {
  const { supplierId } = useParams()
  const navigate = useNavigate()
  const { suppliers, getSupplierRiskData } = useWorkflow()
  const [sending, setSending] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const handleRiskReview = async () => {
    setSending('risk')
    try {
      await triggerSupplierRiskReview({
        supplier_id:  supplier.id,
        component_id: null,
        reason:       `Risk review triggered from SupplierRiskAnalysis — overall score: ${riskData.overallScore}`,
        priority:     riskData.overallScore >= 70 ? 'CRITICAL' : riskData.overallScore >= 50 ? 'HIGH' : 'MEDIUM',
      })
      showToast(`✅ Risk Review sent to n8n for ${supplier.name}`, true)
    } catch (err) {
      showToast(`❌ Failed: ${err.message}`, false)
    } finally {
      setSending(null)
    }
  }

  const handleAlternativeSupplier = async () => {
    setSending('alt')
    try {
      await triggerAlternativeSupplierRequest({
        component_id:           null,
        required_quantity:      null,
        required_delivery_date: null,
        reason:                 `Alternative supplier requested for ${supplier.name} — highest risk: ${highestRisk.label || 'unknown'}`,
        priority:               'HIGH',
      })
      showToast(`✅ Alternative Supplier Request sent to n8n`, true)
    } catch (err) {
      showToast(`❌ Failed: ${err.message}`, false)
    } finally {
      setSending(null)
    }
  }


  const supplier = suppliers.find(s => s.id === supplierId)
  const riskData = getSupplierRiskData(supplierId)

  if (!supplier || !riskData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Supplier not found or risk data unavailable</p>
        <Button onClick={() => navigate('/risk-analysis')} className="mt-4">
          Back to Risk Analysis
        </Button>
      </div>
    )
  }

  const highestRisk = Object.values(riskData.risks).reduce((max, current) => 
    current.score > max.score ? current : max
  )

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/risk-analysis')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Risk Analysis
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Risk Analysis</h1>
          <p className="text-gray-600 mt-2">{supplier.name}</p>
        </div>
        <div className="text-right space-y-2">
          <p className="text-sm text-gray-500">Supplier ID: {supplier.id}</p>
          <p className="text-sm text-gray-500 flex items-center justify-end gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            Last Analysis: {riskData.lastAnalysisDate}
          </p>
          <div className="flex gap-2 justify-end mt-3">
            <Button size="sm" variant="secondary" disabled={sending === 'risk'} onClick={handleRiskReview}>
              {sending === 'risk' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <AlertTriangle className="w-4 h-4 mr-1" />}
              {sending === 'risk' ? 'Sending...' : 'Risk Review'}
            </Button>
            <Button size="sm" disabled={sending === 'alt'} onClick={handleAlternativeSupplier}>
              {sending === 'alt' ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
              {sending === 'alt' ? 'Sending...' : 'Alt. Supplier'}
            </Button>
          </div>
        </div>
      </div>

      {/* Overall Risk Score */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border-2">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Risk Score</h2>
              <p className="text-gray-600">Primary Risk Category: {riskData.primaryRiskCategory}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900">{riskData.overallRiskScore}</div>
              <RiskBadge level={riskData.overallRiskLevel} size="lg" className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskScoreCard
          title="Delivery Risk"
          score={riskData.risks.delivery.score}
          level={riskData.risks.delivery.level}
          explanation={riskData.risks.delivery.explanation}
          isHighestRisk={highestRisk.type === 'delivery'}
        />
        <RiskScoreCard
          title="Quality Risk"
          score={riskData.risks.quality.score}
          level={riskData.risks.quality.level}
          explanation={riskData.risks.quality.explanation}
          isHighestRisk={highestRisk.type === 'quality'}
        />
        <RiskScoreCard
          title="Capacity Risk"
          score={riskData.risks.capacity.score}
          level={riskData.risks.capacity.level}
          explanation={riskData.risks.capacity.explanation}
          isHighestRisk={highestRisk.type === 'capacity'}
        />
      </div>

      {/* Historical Performance */}
      <HistoricalPerformanceCard performance={riskData.historicalPerformance} />

      {/* Risk Breakdown */}
      <RiskBreakdownChart risks={riskData.riskBreakdown} />

      {/* Risk Trend Charts */}
      <RiskTrendChart 
        deliveryData={riskData.deliveryData}
        riskTrendData={riskData.riskTrendData}
      />

      {/* Risk Explanation */}
      <RiskExplanationPanel riskAnalysis={riskData.riskAnalysis} />

      {/* Procurement Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            Procurement Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`
            p-4 rounded-lg border
            ${riskData.overallRiskLevel === 'high' ? 'bg-red-50 border-red-200' :
              riskData.overallRiskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              {riskData.overallRiskLevel === 'high' ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : riskData.overallRiskLevel === 'medium' ? (
                <Info className="w-5 h-5 text-yellow-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              <span className="font-semibold">
                Overall Assessment: {riskData.overallRiskLevel.toUpperCase()} RISK
              </span>
            </div>
            <p className="text-sm text-gray-700">
              Primary Concern: {riskData.riskAnalysis.contributingFactors[0]}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Suggested Actions:</h4>
            <div className="space-y-2">
              {riskData.overallRiskLevel === 'high' && (
                <>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Review Alternative Suppliers</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Maintain a Backup Supplier</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Request Updated Delivery Commitment</span>
                  </label>
                </>
              )}
              {riskData.overallRiskLevel === 'medium' && (
                <>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Monitor Performance Closely</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Consider Partial Order Allocation</span>
                  </label>
                </>
              )}
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Proceed with Supplier</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupplierRiskAnalysis
