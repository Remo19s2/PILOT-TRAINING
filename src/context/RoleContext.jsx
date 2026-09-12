import { createContext, useContext, useState } from 'react'

const RoleContext = createContext()

export const roles = {
  PROCUREMENT_MANAGER: 'procurement_manager',
  SUPPLIER: 'supplier',
  FINANCE_APPROVER: 'finance_approver',
}

export const rolePermissions = {
  [roles.PROCUREMENT_MANAGER]: {
    canViewDashboard: true,
    canManageRFQs: true,
    canNegotiate: true,
    canViewRecommendations: true,
    canApproveRecommendations: true,
    canViewRiskInsights: true,
    canManageSuppliers: true,
    canViewReports: true,
  },
  [roles.SUPPLIER]: {
    canViewRFQs: true,
    canSubmitQuotations: true,
    canRespondToNegotiations: true,
    canViewPurchaseOrders: true,
    canAcknowledgePOs: true,
    canUpdateMilestones: true,
    canViewDeliveryStatus: true,
    canUploadDocuments: true,
  },
  [roles.FINANCE_APPROVER]: {
    canReviewRequests: true,
    canViewCostAnalysis: true,
    canValidateFinancialImpact: true,
    canApprove: true,
    canReject: true,
    canReturnForModification: true,
    canViewApprovalHistory: true,
  },
}

export const RoleProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(roles.PROCUREMENT_MANAGER)

  const hasPermission = (permission) => {
    const permissions = rolePermissions[currentRole]
    return permissions?.[permission] || false
  }

  const switchRole = (role) => {
    setCurrentRole(role)
  }

  return (
    <RoleContext.Provider value={{ currentRole, hasPermission, switchRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
