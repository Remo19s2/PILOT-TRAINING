import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Tabs, TabsList, TabsContent } from '../components/ui/Tabs'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Check, X, Eye, Clock, FileText, DollarSign } from 'lucide-react'

const PendingApprovals = () => {
  const [activeTab, setActiveTab] = useState('pending')

  const pendingApprovals = [
    { 
      id: 'PO-4522',
      type: 'Purchase Order',
      supplier: 'TechCorp Industries',
      amount: '$125,000',
      requester: 'Sarah Johnson',
      department: 'Engineering',
      submitted: '2024-01-10',
      priority: 'high',
      description: 'Electronic components for Q1 production'
    },
    { 
      id: 'CT-2024-089',
      type: 'Contract',
      supplier: 'GlobalSupply Co.',
      amount: '$250,000',
      requester: 'Michael Chen',
      department: 'Operations',
      submitted: '2024-01-09',
      priority: 'medium',
      description: 'Annual logistics services agreement'
    },
    { 
      id: 'PO-4523',
      type: 'Purchase Order',
      supplier: 'IndustrialX Manufacturing',
      amount: '$45,200',
      requester: 'Emily Davis',
      department: 'Production',
      submitted: '2024-01-08',
      priority: 'low',
      description: 'Raw materials - steel batch B'
    },
    { 
      id: 'RFQ-2024-006',
      type: 'RFQ Approval',
      supplier: 'AutoParts Premium',
      amount: '$89,500',
      requester: 'John Smith',
      department: 'Procurement',
      submitted: '2024-01-07',
      priority: 'high',
      description: 'Automotive components for new product line'
    },
  ]

  const inReview = [
    { 
      id: 'PO-4521',
      type: 'Purchase Order',
      supplier: 'PrimeMfg Solutions',
      amount: '$78,000',
      requester: 'Lisa Brown',
      department: 'Quality',
      submitted: '2024-01-05',
      priority: 'medium',
      description: 'Quality control equipment'
    },
  ]

  const approved = [
    { 
      id: 'PO-4520',
      type: 'Purchase Order',
      supplier: 'TechCorp Industries',
      amount: '$156,000',
      requester: 'David Wilson',
      department: 'Engineering',
      submitted: '2024-01-03',
      approved: '2024-01-05',
      description: 'Server infrastructure upgrade'
    },
  ]

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success',
    }
    return <Badge variant={variants[priority]}>{priority}</Badge>
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Purchase Order': <FileText className="w-4 h-4" />,
      'Contract': <FileText className="w-4 h-4" />,
      'RFQ Approval': <Clock className="w-4 h-4" />,
    }
    return icons[type] || <FileText className="w-4 h-4" />
  }

  const ApprovalTable = ({ items, showActions = true }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Description</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getTypeIcon(item.type)}
                <span>{item.type}</span>
              </div>
            </TableCell>
            <TableCell>{item.supplier}</TableCell>
            <TableCell className="font-semibold">{item.amount}</TableCell>
            <TableCell>{item.requester}</TableCell>
            <TableCell>{item.department}</TableCell>
            <TableCell>{getPriorityBadge(item.priority)}</TableCell>
            <TableCell className="max-w-xs truncate">{item.description}</TableCell>
            {showActions && (
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="success" size="sm">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Pending Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve procurement requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-navy-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Eye className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-navy-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success-100 rounded-lg">
                <Check className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-navy-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-navy-900">$509K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
          <CardDescription>Manage pending procurement approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'border-primary-600 text-primary-600' : ''}>
                Pending ({pendingApprovals.length})
              </button>
              <button onClick={() => setActiveTab('review')} className={activeTab === 'review' ? 'border-primary-600 text-primary-600' : ''}>
                In Review ({inReview.length})
              </button>
              <button onClick={() => setActiveTab('approved')} className={activeTab === 'approved' ? 'border-primary-600 text-primary-600' : ''}>
                Approved ({approved.length})
              </button>
            </TabsList>

            <TabsContent value="pending">
              <ApprovalTable items={pendingApprovals} showActions={true} />
            </TabsContent>

            <TabsContent value="review">
              <ApprovalTable items={inReview} showActions={true} />
            </TabsContent>

            <TabsContent value="approved">
              <ApprovalTable items={approved} showActions={false} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default PendingApprovals
