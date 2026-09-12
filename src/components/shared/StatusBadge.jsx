import { Badge } from '../ui/Badge'

const StatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    const statusMap = {
      new: 'default',
      under_review: 'warning',
      rfq_created: 'primary',
      rfq_sent: 'accent',
      rfq_viewed: 'info',
      quotation_submitted: 'success',
      quotation_under_review: 'warning',
      supplier_selected: 'success',
      pending_finance_approval: 'warning',
      approved: 'success',
      rejected: 'danger',
      submitted: 'success',
      selected: 'success',
      pending: 'warning',
      critical: 'danger',
      high: 'warning',
      medium: 'primary',
      low: 'success',
    }
    return statusMap[status] || 'default'
  }

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown'
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}

export default StatusBadge
