import { Routes, Route, Navigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import Layout from '../components/Layout/Layout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import ExecutiveDashboard from '../pages/ExecutiveDashboard'
import ProcurementDashboard from '../pages/ProcurementDashboard'
import SupplierDashboard from '../pages/SupplierDashboard'
import FinanceDashboard from '../pages/FinanceDashboard'
import PlanningInsights from '../pages/PlanningInsights'
import RFQStatus from '../pages/RFQStatus'
import RevisedQuotations from '../pages/RevisedQuotations'
import RevisedQuotationDetails from '../pages/RevisedQuotationDetails'
import SupplierResponse from '../pages/SupplierResponse'
import CreateRFQ from '../pages/CreateRFQ'
import RFQs from '../pages/RFQs'
import NewRFQs from '../pages/NewRFQs'
import RFQDetails from '../pages/RFQDetails'
import RFQDetailManager from '../pages/RFQDetailManager'
import NegotiationCenterNew from '../pages/NegotiationCenterNew'
import SubmitQuotation from '../pages/SubmitQuotation'
import Quotations from '../pages/Quotations'
import CompareQuotations from '../pages/CompareQuotations'
import FinanceApproval from '../pages/FinanceApproval'
import SupplierRiskSelection from '../pages/SupplierRiskSelection'
import SupplierRiskAnalysis from '../pages/SupplierRiskAnalysis'
import RiskRecommendations from '../pages/RiskRecommendations'
import RFQManagementComplete from '../pages/RFQManagementComplete'
import PurchaseOrders from '../pages/PurchaseOrders'
import QuotationManagement from '../pages/QuotationManagement'
import SupplierComparison from '../pages/SupplierComparison'
import NegotiationCenter from '../pages/NegotiationCenter'
import SupplierIntelligence from '../pages/SupplierIntelligence'
import RiskPrediction from '../pages/RiskPrediction'
import DecisionRecommendation from '../pages/DecisionRecommendation'
import AIPredictions from '../pages/AIPredictions'
import PlanningInventory from '../pages/PlanningInventory'
import AIDecisionCenter from '../pages/AIDecisionCenter'
import MonitoringAlerts from '../pages/MonitoringAlerts'
import AIAgentWorkflow from '../pages/AIAgentWorkflow'
import Suppliers from '../pages/Suppliers'
import RiskInsights from '../pages/RiskInsights'
import ApprovalCenter from '../pages/ApprovalCenter'
import ProcurementReports from '../pages/ProcurementReports'
import SupplierNegotiations from '../pages/SupplierNegotiations'
import FinalDecisions from '../pages/FinalDecisions'
import SupplierAlerts from '../pages/SupplierAlerts'
import FinalSupplierSelection from '../pages/FinalSupplierSelection'
import ApprovalStatus from '../pages/ApprovalStatus'
import FinalDecisionToSupplier from '../pages/FinalDecisionToSupplier'

const AppRouter = () => {
  const { currentUser } = useWorkflow()

  return (
    <Routes>
      {/* Login Route - No Layout */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes - With Layout */}
      <Route path="/" element={currentUser ? <Layout><Navigate to="/procurement-dashboard" replace /></Layout> : <Navigate to="/login" replace />} />
      
      {/* Procurement Manager Routes */}
      <Route path="/procurement-dashboard" element={<Layout><ProcurementDashboard /></Layout>} />
      <Route path="/planning-insights" element={<Layout><PlanningInsights /></Layout>} />
      <Route path="/rfq-status" element={<Layout><RFQStatus /></Layout>} />
      <Route path="/revised-quotations" element={<Layout><RevisedQuotations /></Layout>} />
      <Route path="/revised-quotation/:id" element={<Layout><RevisedQuotationDetails /></Layout>} />
      <Route path="/supplier-response/:id" element={<Layout><SupplierResponse /></Layout>} />
      <Route path="/supplier-comparison" element={<Layout><SupplierComparison /></Layout>} />
      <Route path="/supplier-comparison/:rfqId" element={<Layout><SupplierComparison /></Layout>} />
      <Route path="/create-rfq" element={<Layout><CreateRFQ /></Layout>} />
      <Route path="/rfqs" element={<Layout><RFQs /></Layout>} />
      <Route path="/rfq-details/:id" element={<Layout><RFQDetailManager /></Layout>} />
      <Route path="/negotiation-center" element={<Layout><NegotiationCenterNew /></Layout>} />
      <Route path="/negotiation-center/:negotiationId" element={<Layout><NegotiationCenterNew /></Layout>} />
      <Route path="/quotations" element={<Layout><Quotations /></Layout>} />
      <Route path="/compare-quotations/:id" element={<Layout><CompareQuotations /></Layout>} />
      <Route path="/final-supplier-selection/:rfqId" element={<Layout><FinalSupplierSelection /></Layout>} />
      <Route path="/final-decision-to-supplier/:approvalId" element={<Layout><FinalDecisionToSupplier /></Layout>} />
      <Route path="/final-decision-to-supplier" element={<Layout><FinalDecisionToSupplier /></Layout>} />
      <Route path="/suppliers" element={<Layout><Suppliers /></Layout>} />
      <Route path="/supplier-performance" element={<Layout><div>Supplier Performance</div></Layout>} />
      <Route path="/risk-analysis" element={<Layout><SupplierRiskSelection /></Layout>} />
      <Route path="/supplier-risk-analysis/:supplierId" element={<Layout><SupplierRiskAnalysis /></Layout>} />
      <Route path="/risk-recommendations/:supplierId" element={<Layout><RiskRecommendations /></Layout>} />
      <Route path="/approval-status" element={<Layout><ApprovalStatus /></Layout>} />
      <Route path="/monitoring-alerts" element={<Layout><MonitoringAlerts /></Layout>} />

      {/* Supplier Routes */}
      <Route path="/supplier-dashboard" element={<Layout><SupplierDashboard /></Layout>} />
      <Route path="/new-rfqs" element={<Layout><NewRFQs /></Layout>} />
      <Route path="/viewed-rfqs" element={<Layout><NewRFQs /></Layout>} />
      <Route path="/rfq-history" element={<Layout><NewRFQs /></Layout>} />
      <Route path="/rfq-details/:id" element={<Layout><RFQDetails /></Layout>} />
      <Route path="/submit-quotation/:id" element={<Layout><SubmitQuotation /></Layout>} />
      <Route path="/submitted-quotations" element={<Layout><Quotations /></Layout>} />
      <Route path="/supplier-negotiations" element={<Layout><SupplierNegotiations /></Layout>} />
      <Route path="/final-decisions" element={<Layout><FinalDecisions /></Layout>} />
      <Route path="/supplier-alerts" element={<Layout><SupplierAlerts /></Layout>} />
      <Route path="/supplier-profile" element={<Layout><div>Supplier Profile</div></Layout>} />

      {/* Finance Approver Routes */}
      <Route path="/finance-dashboard" element={<Layout><FinanceDashboard /></Layout>} />
      <Route path="/pending-approvals" element={<Layout><FinanceDashboard /></Layout>} />
      <Route path="/approved-requests" element={<Layout><FinanceDashboard /></Layout>} />
      <Route path="/rejected-requests" element={<Layout><FinanceDashboard /></Layout>} />
      <Route path="/budget-status" element={<Layout><div>Budget Status</div></Layout>} />
      <Route path="/finance-reports" element={<Layout><ProcurementReports /></Layout>} />
      <Route path="/finance-approval/:id" element={<Layout><FinanceApproval /></Layout>} />

      {/* Legacy Routes - Keep for backward compatibility */}
      <Route path="/planning-inventory" element={<Layout><PlanningInventory /></Layout>} />
      <Route path="/rfq" element={<Layout><RFQManagementComplete /></Layout>} />
      <Route path="/purchase-orders" element={<Layout><PurchaseOrders /></Layout>} />
      <Route path="/supplier-comparison" element={<Layout><SupplierComparison /></Layout>} />
      <Route path="/negotiation" element={<Layout><NegotiationCenter /></Layout>} />
      <Route path="/supplier-intelligence" element={<Layout><SupplierIntelligence /></Layout>} />
      <Route path="/risk-prediction" element={<Layout><RiskPrediction /></Layout>} />
      <Route path="/decision-recommendation" element={<Layout><DecisionRecommendation /></Layout>} />
      <Route path="/ai-predictions" element={<Layout><AIPredictions /></Layout>} />
      <Route path="/ai-decision-center" element={<Layout><AIDecisionCenter /></Layout>} />
      <Route path="/ai-agent-workflow" element={<Layout><AIAgentWorkflow /></Layout>} />
      <Route path="/risk-insights" element={<Layout><RiskInsights /></Layout>} />
      <Route path="/approvals" element={<Layout><ApprovalCenter /></Layout>} />
      <Route path="/reports" element={<Layout><ProcurementReports /></Layout>} />
      <Route path="/settings" element={<Layout><div>Settings Page</div></Layout>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter
