import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import RiskAlertBanner from '../components/shared/RiskAlertBanner'
import RecommendationCard from '../components/shared/RecommendationCard'
import AlternativeSupplierComparison from '../components/shared/AlternativeSupplierComparison'
import RecommendationDetailPanel from '../components/shared/RecommendationDetailPanel'
import HumanDecisionInterface from '../components/shared/HumanDecisionInterface'
import DecisionConfirmation from '../components/shared/DecisionConfirmation'
import RiskResponseHistory from '../components/shared/RiskResponseHistory'
import WorkflowTracker from '../components/shared/WorkflowTracker'
import { ArrowLeft } from 'lucide-react'

const RiskRecommendations = () => {
  const { supplierId } = useParams()
  const navigate = useNavigate()
  const { getRiskRecommendations, riskResponseHistory, currentUser } = useWorkflow()
  
  const [selectedRecommendation, setSelectedRecommendation] = useState(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [showDecisionInterface, setShowDecisionInterface] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [decisionNotes, setDecisionNotes] = useState('')
  const [selectedDecision, setSelectedDecision] = useState('')
  const [showAlternatives, setShowAlternatives] = useState(false)

  const recommendationData = getRiskRecommendations(supplierId)

  if (!recommendationData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No risk recommendations found for this supplier</p>
        <Button onClick={() => navigate('/risk-analysis')} className="mt-4">
          Back to Risk Analysis
        </Button>
      </div>
    )
  }

  const handleSelectRecommendation = (id) => {
    const recommendation = recommendationData.recommendations.find(r => r.id === id)
    setSelectedRecommendation(recommendation)
    setShowDetailPanel(true)
  }

  const handleConfirmAction = () => {
    setShowDetailPanel(false)
    setShowDecisionInterface(true)
  }

  const handleChooseAnother = () => {
    setShowDetailPanel(false)
    setSelectedRecommendation(null)
  }

  const handleConfirmDecision = () => {
    setShowDecisionInterface(false)
    setShowConfirmation(true)
  }

  const handleContinue = () => {
    navigate('/quotations')
  }

  const handleViewRiskDetails = () => {
    navigate(`/supplier-risk-analysis/${supplierId}`)
  }

  const handleViewAlternatives = () => {
    setShowAlternatives(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Response & Recommendations</h1>
          <p className="text-gray-600 mt-1">Review and select the best course of action</p>
        </div>
      </div>

      {/* Workflow Tracker */}
      <WorkflowTracker currentStatus="recommendations_generated" workflowType="risk_response" />

      {/* Risk Alert Banner */}
      <RiskAlertBanner
        supplier={recommendationData.supplier}
        component={recommendationData.component}
        riskType={recommendationData.riskType}
        riskLevel={recommendationData.riskLevel}
        riskScore={recommendationData.riskScore}
        description={recommendationData.description}
        onViewDetails={handleViewRiskDetails}
        onViewRecommendations={() => {}}
      />

      {/* Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle>RISK SUMMARY</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Supplier</p>
              <p className="font-semibold text-gray-900">{recommendationData.supplier}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Component</p>
              <p className="font-semibold text-gray-900">{recommendationData.component}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Risk</p>
              <p className="font-semibold text-gray-900">{recommendationData.riskType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Risk Score</p>
              <p className="font-semibold text-gray-900">{recommendationData.riskScore}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Potential Impact</p>
            <p className="text-sm text-gray-700">{recommendationData.potentialImpact}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Solutions */}
      {!showDetailPanel && !showDecisionInterface && !showConfirmation && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendationData.recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                {...recommendation}
                isSelected={selectedRecommendation?.id === recommendation.id}
                onSelect={handleSelectRecommendation}
                onViewAlternatives={recommendation.id === 4 ? handleViewAlternatives : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Alternative Supplier Comparison */}
      {showAlternatives && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Alternative Supplier Comparison</h2>
            <Button variant="outline" onClick={() => setShowAlternatives(false)}>
              Back to Recommendations
            </Button>
          </div>
          <AlternativeSupplierComparison
            suppliers={recommendationData.alternativeSuppliers}
            onViewDetails={(id) => navigate(`/supplier-risk-analysis/${id}`)}
            onViewRiskAnalysis={(id) => navigate(`/supplier-risk-analysis/${id}`)}
            onSelectSupplier={(id) => navigate(`/compare-quotations/${id}`)}
          />
        </div>
      )}

      {/* Recommendation Detail Panel */}
      {showDetailPanel && selectedRecommendation && (
        <RecommendationDetailPanel
          title={selectedRecommendation.title}
          reason={`The current supplier has a high probability of ${recommendationData.riskType.toLowerCase()} based on historical performance.`}
          expectedOutcome={selectedRecommendation.expectedBenefit}
          affectedProcurement={`${recommendationData.component} – 500 Units`}
          onConfirm={handleConfirmAction}
          onChooseAnother={handleChooseAnother}
        />
      )}

      {/* Human Decision Interface */}
      {showDecisionInterface && (
        <HumanDecisionInterface
          selectedRecommendation={selectedDecision}
          decisionNotes={decisionNotes}
          onDecisionChange={setSelectedDecision}
          onNotesChange={setDecisionNotes}
          onConfirm={handleConfirmDecision}
        />
      )}

      {/* Decision Confirmation */}
      {showConfirmation && (
        <DecisionConfirmation
          selectedAction={selectedRecommendation?.title}
          riskType={recommendationData.riskType}
          riskLevel={recommendationData.riskLevel}
          decisionMaker={currentUser?.name || 'Procurement Manager'}
          status="Risk Response Initiated"
          onContinue={handleContinue}
        />
      )}

      {/* Risk Response History */}
      {!showConfirmation && (
        <RiskResponseHistory
          history={riskResponseHistory}
          onViewDetails={(id) => console.log('View details:', id)}
        />
      )}
    </div>
  )
}

export default RiskRecommendations
