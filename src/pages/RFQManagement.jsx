import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'

const RFQManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rfqs = [
    { id: 'RFQ-2024-001', title: 'Electronic Components Batch A', supplier: 'TechCorp', status: 'open', value: '$125,000', deadline: '2024-01-15', responses: 3 },
    { id: 'RFQ-2024-002', title: 'Raw Materials - Steel', supplier: 'IndustrialX', status: 'in_review', value: '$89,500', deadline: '2024-01-18', responses: 5 },
    { id: 'RFQ-2024-003', title: 'Packaging Materials Q1', supplier: 'GlobalSupply', status: 'closed', value: '$45,200', deadline: '2024-01-10', responses: 4 },
    { id: 'RFQ-2024-004', title: 'Industrial Equipment Parts', supplier: 'AutoParts', status: 'draft', value: '$250,000', deadline: '2024-01-25', responses: 0 },
    { id: 'RFQ-2024-005', title: 'Logistics Services Contract', supplier: 'PrimeMfg', status: 'open', value: '$78,000', deadline: '2024-01-20', responses: 2 },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      open: 'primary',
      in_review: 'warning',
      closed: 'success',
      draft: 'default',
    }
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>
  }

  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">RFQ Management</h1>
          <p className="text-gray-600 mt-1">Manage requests for quotations and supplier bids</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create RFQ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active RFQs</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search RFQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_review">In Review</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFQs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">{rfq.id}</TableCell>
                  <TableCell>{rfq.title}</TableCell>
                  <TableCell>{rfq.supplier}</TableCell>
                  <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                  <TableCell className="font-semibold">{rfq.value}</TableCell>
                  <TableCell>{rfq.deadline}</TableCell>
                  <TableCell>{rfq.responses}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default RFQManagement
