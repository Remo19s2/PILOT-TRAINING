import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ArrowLeft, Calendar, AlertTriangle, CheckCircle, Info, Loader2, ShieldAlert, Zap, FileText } from 'lucide-react'
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
        reason:       `Risk review triggered from SupplierRiskAnalysis — overall score: ${riskData.overallRiskScore || riskData.overallScore}`,
        priority:     (riskData.overallRiskScore || riskData.overallScore) >= 70 ? 'CRITICAL' : (riskData.overallRiskScore || riskData.overallScore) >= 50 ? 'HIGH' : 'MEDIUM',
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
        <p className="text-xs text-gray-500">Supplier not found or risk data unavailable</p>
        <Button onClick={() => navigate('/risk-analysis')} className="mt-4" size="sm">
          Back to Risk Analysis
        </Button>
      </div>
    )
  }

  const highestRisk = Object.values(riskData.risks).reduce((max, current) => 
    current.score > max.score ? current : max
  )

  const isHigh = riskData.overallRiskLevel === 'high'

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-white text-xs font-semibold flex items-center gap-2 ${toast.ok ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.ok ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header with Navigation & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/risk-analysis')}
            className="text-gray-600 hover:text-navy-900 h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Risk Registry
          </Button>
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-navy-900">{supplier.name}</h1>
              <Badge variant="primary" className="text-[10px]">{supplier.id}</Badge>
              <RiskBadge level={riskData.overallRiskLevel} size="sm" />
            </div>
            <p className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
              <span>Category: <strong>{supplier.category}</strong></span>
              <span>&bull;</span>
              <span>Updated: {riskData.lastAnalysisDate}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Triggering n8n Agent Workbench */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            disabled={sending === 'risk'}
            onClick={handleRiskReview}
            className="text-xs font-semibold h-8"
          >
            {sending === 'risk' ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-600" />}
            {sending === 'risk' ? 'Triggering...' : 'Trigger Risk Review'}
          </Button>
          <Button
            size="sm"
            disabled={sending === 'alt'}
            onClick={handleAlternativeSupplier}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8 shadow-2xs"
          >
            {sending === 'alt' ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 mr-1.5" />}
            {sending === 'alt' ? 'Dispatching...' : 'Request Alt. Supplier'}
          </Button>
        </div>
      </div>

      {/* Executive Risk Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card className={`border ${isHigh ? 'border-red-200 bg-red-50/20' : 'border-gray-200 bg-white'}`}>
          <CardContent className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-gray-500">Overall Score</span>
              <p className={`text-2xl font-black mt-0.5 ${isHigh ? 'text-red-600' : 'text-navy-900'}`}>
                {riskData.overallRiskScore}
                <span className="text-xs font-normal text-gray-400">/100</span>
              </p>
            </div>
            <RiskBadge level={riskData.overallRiskLevel} size="md" />
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-gray-500">Primary Concern</span>
            <p className="text-xs font-bold text-navy-900 mt-1 truncate">
              {riskData.primaryRiskCategory || highestRisk.label || 'Delivery'}
            </p>
            <span className="text-[10px] text-gray-400">Highest sub-score: {highestRisk.score}/100</span>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-gray-500">Delivery Reliability</span>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">
              {riskData.historicalPerformance?.onTimeDeliveryRate ? `${riskData.historicalPerformance.onTimeDeliveryRate}%` : '94%'}
            </p>
            <span className="text-[10px] text-gray-400">Past 12 months</span>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-medium text-gray-500">Quality Defect Rate</span>
            <p className="text-xl font-bold text-blue-700 mt-0.5">
              {riskData.historicalPerformance?.defectRate ? `${riskData.historicalPerformance.defectRate}%` : '0.8%'}
            </p>
            <span className="text-[10px] text-gray-400">Defect threshold: &lt;1.5%</span>
          </CardContent>
        </Card>
      </div>

      {/* 3 Risk Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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

      {/* Historical Performance & Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HistoricalPerformanceCard performance={riskData.historicalPerformance} />
        <RiskBreakdownChart risks={riskData.riskBreakdown} />
      </div>

      {/* Risk Trend & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RiskTrendChart 
          deliveryData={riskData.deliveryData}
          riskTrendData={riskData.riskTrendData}
        />
        <RiskExplanationPanel riskAnalysis={riskData.riskAnalysis} />
      </div>

      {/* Compact Procurement Recommendation Strip */}
      <Card className="border-gray-200 bg-white">
        <CardHeader className="pb-2 pt-3.5 px-4 border-b border-gray-100">
          <CardTitle className="text-xs font-bold flex items-center gap-2 text-navy-900 uppercase tracking-wider">
            <Info className="w-4 h-4 text-blue-600" />
            Prescriptive Recommendation Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className={`p-3 rounded-lg border text-xs ${
            isHigh ? 'bg-red-50/80 border-red-200 text-red-900' :
            riskData.overallRiskLevel === 'medium' ? 'bg-amber-50/80 border-amber-200 text-amber-900' :
            'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          }`}>
            <span className="font-bold">Assessment: {riskData.overallRiskLevel.toUpperCase()} RISK. </span>
            <span>Primary factor: {riskData.riskAnalysis?.contributingFactors?.[0] || 'Operational consistency'}.</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {isHigh ? (
              <>
                <span className="px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 font-medium">
                  Review Alternative Suppliers
                </span>
                <span className="px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 font-medium">
                  Maintain Secondary Source Buffer
                </span>
                <span className="px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 font-medium">
                  Request Lead-Time Guarantee
                </span>
              </>
            ) : (
              <>
                <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                  Continuous Telemetry Monitoring
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                  Proceed with Standard Allocations
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupplierRiskAnalysis
