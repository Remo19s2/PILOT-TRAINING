import { Check, Circle, Clock } from 'lucide-react'

const WorkflowTracker = ({ currentStatus, workflowType = 'procurement', deadlineStatus = null }) => {
  const procurementSteps = [
    { status: 'new', label: 'Requirement' },
    { status: 'under_review', label: 'Review' },
    { status: 'rfq_created', label: 'RFQ Created' },
    { status: 'rfq_sent', label: 'RFQ Sent' },
    { status: 'rfq_viewed', label: 'Supplier Viewed' },
    { status: 'quotation_submitted', label: 'Quotation Submitted' },
    { status: 'supplier_selected', label: 'Supplier Selected' },
    { status: 'pending_finance_approval', label: 'Finance Approval' },
    { status: 'approved', label: 'Approved' },
    { status: 'rejected', label: 'Rejected' },
  ]

  const rfqDeadlineSteps = [
    { status: 'rfq_created', label: 'RFQ Created' },
    { status: 'rfq_sent', label: 'RFQ Sent' },
    { status: 'supplier_responses', label: 'Supplier Responses' },
    { status: 'quotation_deadline', label: 'Quotation Deadline', isDeadline: true },
    { status: 'quotation_review', label: 'Quotation Review' },
    { status: 'supplier_selection', label: 'Supplier Selection' },
    { status: 'finance_approval', label: 'Finance Approval' },
  ]

  const riskResponseSteps = [
    { status: 'requirement_identified', label: 'Requirement Identified' },
    { status: 'rfq_sent', label: 'RFQ Sent' },
    { status: 'quotation_received', label: 'Quotation Received' },
    { status: 'risk_analysis', label: 'Supplier Risk Analysis' },
    { status: 'risk_detected', label: 'Risk Detected' },
    { status: 'recommendations_generated', label: 'Recommendations Generated' },
    { status: 'human_decision', label: 'Human Decision' },
    { status: 'supplier_selection', label: 'Supplier Selection' },
    { status: 'finance_approval', label: 'Finance Approval' },
  ]

  const steps = workflowType === 'rfq_deadline' ? rfqDeadlineSteps : 
                workflowType === 'risk_response' ? riskResponseSteps : procurementSteps
  const workflowStatuses = steps.map(s => s.status)
  
  const getStatusIndex = (status) => {
    return workflowStatuses.indexOf(status)
  }

  const currentIndex = getStatusIndex(currentStatus)

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-lg overflow-x-auto">
      {steps.map((step, index) => {
        const stepIndex = getStatusIndex(step.status)
        const isCompleted = stepIndex !== -1 && stepIndex < currentIndex
        const isCurrent = step.status === currentStatus
        const isPending = stepIndex > currentIndex

        // Special handling for deadline step
        const isDeadlineStep = step.isDeadline
        const deadlineBadge = isDeadlineStep && deadlineStatus ? (
          <span className={`text-xs px-2 py-1 rounded ${
            deadlineStatus === 'Open' ? 'bg-green-100 text-green-700' :
            deadlineStatus === 'Closing Soon' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {deadlineStatus}
          </span>
        ) : null

        return (
          <div key={step.status} className="flex items-center flex-1 min-w-max">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-success-500 text-white'
                    : isCurrent
                    ? 'bg-primary-500 text-white'
                    : isPending
                    ? 'bg-gray-300 text-gray-600'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  step.isDeadline ? <Clock className="w-5 h-5" /> : <Circle className="w-5 h-5 fill-white" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <div className="flex flex-col items-center mt-2">
                <span
                  className={`text-xs text-center ${
                    isCompleted
                      ? 'text-success-600 font-medium'
                      : isCurrent
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
                {deadlineBadge}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  isCompleted ? 'bg-success-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default WorkflowTracker
