import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { CheckCircle, X, ArrowRight, Clock, User, FileText, DollarSign, AlertTriangle, Brain, Send, RotateCcw } from 'lucide-react'

const ApprovalCenter = () => {
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')

  const handleProcurementAction = (approvalId, action) => {
    if (action === 'approve') {
      alert(`Approval ${approvalId} approved by Procurement Manager!`)
    } else if (action === 'modify') {
      alert(`Approval ${approvalId} sent for modification!`)
    } else if (action === 'reject') {
      alert(`Approval ${approvalId} rejected by Procurement Manager!`)
    }
  }

  const handleFinanceAction = (approvalId, action) => {
    if (action === 'approve') {
      alert(`Approval ${approvalId} approved by Finance!`)
    } else if (action === 'return') {
      alert(`Approval ${approvalId} returned to Procurement Manager!`)
    } else if (action === 'reject') {
      alert(`Approval ${approvalId} rejected by Finance!`)
    }
  }

  const approvals = [
    {
      id: 'APR-001',
      rfqId: 'RFQ-2024-001',
      supplier: 'TechCorp Industries',
      subject: 'Electronic Control Unit Procurement',
      status: 'pending_procurement',
      amount: 125000,
      
      // AI Recommendation
      aiRecommendation: 'Split order between TechCorp Industries (60%) and AutoParts Premium (40%) to optimize cost, delivery, and risk profile.',
      aiConfidence: 94,
      
      // Cost Impact
      costImpact: {
        originalQuote: 125000,
        negotiatedPrice: 128500,
        savings: -3500,
        percentage: '+2.8%',
      },
      
      // Risk Impact
      riskImpact: {
        before: 'High - Single supplier dependency',
        after: 'Low - Diversified supplier base',
        riskReduction: '35%',
      },
      
      // Selected Suppliers
      selectedSuppliers: [
        { name: 'TechCorp Industries', allocation: '60%', amount: 77100, delivery: '14 days' },
        { name: 'AutoParts Premium', allocation: '40%', amount: 51400, delivery: '12 days' },
      ],
      
      // Negotiation Result
      negotiationResult: 'Successfully negotiated volume-based pricing with 12-month contract commitment. Both suppliers agreed to delivery timeline.',
      
      // AI Explanation
      aiExplanation: 'The split order strategy reduces single-source dependency risk by 35% while maintaining quality standards. Although there is a 2.8% cost increase, the risk reduction and supply chain resilience justify the additional cost. Historical data shows similar split orders have 98% on-time delivery rate.',
      
      // Approval Workflow
      workflow: [
        { stage: 'AI Recommendation', status: 'completed', date: '2024-01-12 14:30', actor: 'AI System' },
        { stage: 'Procurement Manager Review', status: 'in_progress', date: '2024-01-12 15:00', actor: 'John Smith' },
        { stage: 'Finance / Approver Review', status: 'pending', date: '-', actor: 'Finance Team' },
        { stage: 'Final Decision', status: 'pending', date: '-', actor: 'System' },
      ],
      
      // Approval History
      history: [
        { date: '2024-01-12 14:30', action: 'AI Recommendation Generated', details: 'Split order strategy recommended with 94% confidence', actor: 'AI System' },
        { date: '2024-01-12 15:00', action: 'Assigned to Procurement Manager', details: 'John Smith assigned for review', actor: 'System' },
      ],
    },
    {
      id: 'APR-002',
      rfqId: 'RFQ-2024-002',
      supplier: 'IndustrialX Manufacturing',
      subject: 'Steel Sheets Procurement',
      status: 'pending_finance',
      amount: 87000,
      
      aiRecommendation: 'Accept IndustrialX offer at ₹87,000 with 12,000 kg quantity commitment. Add delivery guarantee and quality penalty clauses.',
      aiConfidence: 88,
      
      costImpact: {
        originalQuote: 89500,
        negotiatedPrice: 87000,
        savings: 2500,
        percentage: '-2.8%',
      },
      
      riskImpact: {
        before: 'Medium - Market price volatility',
        after: 'Low - Fixed price with guarantees',
        riskReduction: '25%',
      },
      
      selectedSuppliers: [
        { name: 'IndustrialX Manufacturing', allocation: '100%', amount: 87000, delivery: '18 days' },
      ],
      
      negotiationResult: 'Negotiated price reduction from ₹89,500 to ₹87,000 with increased volume commitment (12,000 kg). Delivery guarantee and quality penalty clauses added.',
      
      aiExplanation: 'The negotiated price represents a 2.8% savings while securing delivery guarantees. The increased volume commitment provides supplier stability, and quality penalty clauses mitigate risk. Market analysis indicates favorable terms compared to current market rates.',
      
      workflow: [
        { stage: 'AI Recommendation', status: 'completed', date: '2024-01-11 10:00', actor: 'AI System' },
        { stage: 'Procurement Manager Review', status: 'completed', date: '2024-01-11 11:30', actor: 'John Smith' },
        { stage: 'Finance / Approver Review', status: 'in_progress', date: '2024-01-11 14:00', actor: 'Finance Team' },
        { stage: 'Final Decision', status: 'pending', date: '-', actor: 'System' },
      ],
      
      history: [
        { date: '2024-01-11 10:00', action: 'AI Recommendation Generated', details: 'IndustrialX offer accepted with conditions', actor: 'AI System' },
        { date: '2024-01-11 11:30', action: 'Procurement Manager Approved', details: 'John Smith approved the recommendation', actor: 'John Smith' },
        { date: '2024-01-11 14:00', action: 'Sent to Finance Review', details: 'Awaiting finance team approval', actor: 'System' },
      ],
    },
    {
      id: 'APR-003',
      rfqId: 'RFQ-2024-003',
      supplier: 'AutoParts Premium',
      subject: 'Packaging Materials Procurement',
      status: 'approved',
      amount: 42000,
      
      aiRecommendation: 'Accept AutoParts Premium offer at ₹42,000 with 12-month quarterly commitment.',
      aiConfidence: 95,
      
      costImpact: {
        originalQuote: 45200,
        negotiatedPrice: 42000,
        savings: 3200,
        percentage: '-7.1%',
      },
      
      riskImpact: {
        before: 'Low',
        after: 'Very Low',
        riskReduction: '15%',
      },
      
      selectedSuppliers: [
        { name: 'AutoParts Premium', allocation: '100%', amount: 42000, delivery: '10 days' },
      ],
      
      negotiationResult: 'Successfully negotiated 7.1% discount with 12-month quarterly commitment. Supplier agreed to advance payment terms.',
      
      aiExplanation: 'Excellent negotiation outcome with 7.1% cost savings. The 12-month commitment provides supply stability while the quarterly orders maintain flexibility. Supplier has strong track record (98% on-time delivery).',
      
      workflow: [
        { stage: 'AI Recommendation', status: 'completed', date: '2024-01-05 09:00', actor: 'AI System' },
        { stage: 'Procurement Manager Review', status: 'completed', date: '2024-01-05 10:30', actor: 'John Smith' },
        { stage: 'Finance / Approver Review', status: 'completed', date: '2024-01-05 14:00', actor: 'Finance Team' },
        { stage: 'Final Decision', status: 'completed', date: '2024-01-05 15:30', actor: 'System' },
      ],
      
      history: [
        { date: '2024-01-05 09:00', action: 'AI Recommendation Generated', details: 'AutoParts Premium offer accepted', actor: 'AI System' },
        { date: '2024-01-05 10:30', action: 'Procurement Manager Approved', details: 'John Smith approved the recommendation', actor: 'John Smith' },
        { date: '2024-01-05 14:00', action: 'Finance Approved', details: 'Finance team approved the request', actor: 'Finance Team' },
        { date: '2024-01-05 15:30', action: 'Final Approval', details: 'Request approved and PO generated', actor: 'System' },
      ],
    },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      pending_procurement: 'warning',
      pending_finance: 'primary',
      approved: 'success',
      rejected: 'danger',
      returned: 'accent',
    }
    const labels = {
      pending_procurement: 'Pending Procurement Review',
      pending_finance: 'Pending Finance Review',
      approved: 'Approved',
      rejected: 'Rejected',
      returned: 'Returned',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getWorkflowStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      in_progress: 'primary',
      pending: 'default',
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const filteredApprovals = approvals.filter(approval => {
    if (activeTab === 'pending') {
      return approval.status === 'pending_procurement' || approval.status === 'pending_finance'
    }
    if (activeTab === 'approved') {
      return approval.status === 'approved'
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Approval Center</h1>
          <p className="text-gray-600 mt-1">Approval workflow management for procurement decisions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'pending' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({approvals.filter(a => a.status === 'pending_procurement' || a.status === 'pending_finance').length})
        </Button>
        <Button 
          variant={activeTab === 'approved' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('approved')}
        >
          Approved ({approvals.filter(a => a.status === 'approved').length})
        </Button>
        <Button 
          variant={activeTab === 'all' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('all')}
        >
          All ({approvals.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approvals List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Approval Requests</CardTitle>
              <CardDescription>{filteredApprovals.length} requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredApprovals.map((approval) => (
                <Card 
                  key={approval.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedApproval?.id === approval.id ? 'border-2 border-primary-500' : ''}`}
                  onClick={() => setSelectedApproval(approval)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-navy-900">{approval.supplier}</h4>
                      {getStatusBadge(approval.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{approval.subject}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-navy-900">₹{approval.amount.toLocaleString()}</span>
                      <Badge variant="accent">{approval.aiConfidence}% AI Confidence</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Approval Details */}
        <div className="lg:col-span-2">
          {selectedApproval ? (
            <div className="space-y-4">
              {/* Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedApproval.supplier}</CardTitle>
                      <CardDescription>{selectedApproval.subject} • {selectedApproval.rfqId}</CardDescription>
                    </div>
                    {getStatusBadge(selectedApproval.status)}
                  </div>
                </CardHeader>
              </Card>

              {/* AI Recommendation */}
              <Card className="border-2 border-accent-500 bg-accent-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-900">
                    <Brain className="w-5 h-5 text-accent-600" />
                    AI Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-accent-800">{selectedApproval.aiRecommendation}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{selectedApproval.aiConfidence}% AI Confidence</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Cost & Risk Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-success-600" />
                      Cost Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Original Quote</span>
                      <span className="font-medium">₹{selectedApproval.costImpact.originalQuote.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Negotiated Price</span>
                      <span className="font-medium">₹{selectedApproval.costImpact.negotiatedPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Savings</span>
                      <span className={`font-medium ${selectedApproval.costImpact.savings > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {selectedApproval.costImpact.savings > 0 ? '+' : ''}₹{selectedApproval.costImpact.savings.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Percentage</span>
                      <span className={`font-medium ${selectedApproval.costImpact.percentage.startsWith('-') ? 'text-success-600' : 'text-danger-600'}`}>
                        {selectedApproval.costImpact.percentage}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning-600" />
                      Risk Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-600">Before</span>
                      <p className="text-sm text-gray-900">{selectedApproval.riskImpact.before}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">After</span>
                      <p className="text-sm text-success-600">{selectedApproval.riskImpact.after}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Risk Reduction</span>
                      <span className="font-bold text-success-600">{selectedApproval.riskImpact.riskReduction}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Selected Suppliers */}
              <Card>
                <CardHeader>
                  <CardTitle>Selected Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedApproval.selectedSuppliers.map((supplier, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-navy-900">{supplier.name}</p>
                          <Badge variant="primary">{supplier.allocation}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-medium">₹{supplier.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Delivery</span>
                          <span className="font-medium">{supplier.delivery}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Negotiation Result */}
              <Card>
                <CardHeader>
                  <CardTitle>Negotiation Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{selectedApproval.negotiationResult}</p>
                </CardContent>
              </Card>

              {/* AI Explanation */}
              <Card className="border-2 border-accent-200 bg-accent-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-900">
                    <Brain className="w-5 h-5 text-accent-600" />
                    AI Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-accent-800">{selectedApproval.aiExplanation}</p>
                </CardContent>
              </Card>

              {/* Approval Workflow */}
              <Card>
                <CardHeader>
                  <CardTitle>Approval Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedApproval.workflow.map((stage, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          stage.status === 'completed' ? 'bg-success-100 text-success-600' :
                          stage.status === 'in_progress' ? 'bg-primary-100 text-primary-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {stage.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                           stage.status === 'in_progress' ? <Clock className="w-4 h-4" /> :
                           <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-navy-900">{stage.stage}</p>
                            <div className="flex items-center gap-2">
                              {getWorkflowStatusBadge(stage.status)}
                              <span className="text-sm text-gray-500">{stage.date}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Actor: {stage.actor}</p>
                        </div>
                        {index < selectedApproval.workflow.length - 1 && (
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Approval History */}
              <Card>
                <CardHeader>
                  <CardTitle>Approval History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedApproval.history.map((event, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="p-2 bg-primary-100 rounded-full">
                          <Clock className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-navy-900">{event.action}</p>
                            <p className="text-sm text-gray-500">{event.date}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                          <p className="text-xs text-gray-500 mt-1">Actor: {event.actor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {selectedApproval.status === 'pending_procurement' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Procurement Manager Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button variant="success" className="flex-1" onClick={() => handleProcurementAction(selectedApproval.id, 'approve')}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="warning" className="flex-1" onClick={() => handleProcurementAction(selectedApproval.id, 'modify')}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Modify
                      </Button>
                      <Button variant="danger" className="flex-1" onClick={() => handleProcurementAction(selectedApproval.id, 'reject')}>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedApproval.status === 'pending_finance' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Finance Team Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button variant="success" className="flex-1" onClick={() => handleFinanceAction(selectedApproval.id, 'approve')}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="accent" className="flex-1" onClick={() => handleFinanceAction(selectedApproval.id, 'return')}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Return
                      </Button>
                      <Button variant="danger" className="flex-1" onClick={() => handleFinanceAction(selectedApproval.id, 'reject')}>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Approval Request</h3>
                <p className="text-gray-600">Choose a request from the list to view details and take action</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApprovalCenter
