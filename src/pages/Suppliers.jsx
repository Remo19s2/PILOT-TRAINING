import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Search, Plus, Filter, MapPin, Mail, Phone, Star, AlertTriangle } from 'lucide-react'

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')

  const suppliers = [
    { 
      id: 1, 
      name: 'TechCorp Industries', 
      location: 'San Francisco, CA',
      email: 'contact@techcorp.com',
      phone: '+1 (555) 123-4567',
      category: 'Electronics',
      riskLevel: 'low',
      performanceScore: 92,
      status: 'active',
      totalSpend: '$1.2M',
      orders: 45
    },
    { 
      id: 2, 
      name: 'IndustrialX Manufacturing', 
      location: 'Detroit, MI',
      email: 'sales@industrialx.com',
      phone: '+1 (555) 234-5678',
      category: 'Raw Materials',
      riskLevel: 'medium',
      performanceScore: 78,
      status: 'active',
      totalSpend: '$890K',
      orders: 32
    },
    { 
      id: 3, 
      name: 'GlobalSupply Co.', 
      location: 'Chicago, IL',
      email: 'info@globalsupply.com',
      phone: '+1 (555) 345-6789',
      category: 'Logistics',
      riskLevel: 'high',
      performanceScore: 65,
      status: 'under_review',
      totalSpend: '$456K',
      orders: 18
    },
    { 
      id: 4, 
      name: 'AutoParts Premium', 
      location: 'Austin, TX',
      email: 'orders@autoparts.com',
      phone: '+1 (555) 456-7890',
      category: 'Automotive',
      riskLevel: 'low',
      performanceScore: 88,
      status: 'active',
      totalSpend: '$678K',
      orders: 28
    },
    { 
      id: 5, 
      name: 'PrimeMfg Solutions', 
      location: 'Seattle, WA',
      email: 'contact@primemfg.com',
      phone: '+1 (555) 567-8901',
      category: 'Manufacturing',
      riskLevel: 'low',
      performanceScore: 85,
      status: 'active',
      totalSpend: '$534K',
      orders: 22
    },
  ]

  const getRiskBadge = (level) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
    }
    return <Badge variant={variants[level]}>{level}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      under_review: 'warning',
      inactive: 'default',
    }
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskFilter === 'all' || supplier.riskLevel === riskFilter
    return matchesSearch && matchesRisk
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Supplier Management</h1>
          <p className="text-gray-600 mt-1">Manage your supplier relationships and performance</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Suppliers</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">156</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Active Suppliers</p>
            <p className="text-2xl font-bold text-success-600 mt-1">142</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">High Risk</p>
            <p className="text-2xl font-bold text-danger-600 mt-1">7</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Avg Performance</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">82%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Suppliers</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="w-40">
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Spend</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-navy-900">{supplier.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        {supplier.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {supplier.location}
                    </div>
                  </TableCell>
                  <TableCell>{getRiskBadge(supplier.riskLevel)}</TableCell>
                  <TableCell>
                    <div className="w-32">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Score</span>
                        <span className="font-medium">{supplier.performanceScore}%</span>
                      </div>
                      <Progress value={supplier.performanceScore} variant={supplier.performanceScore >= 80 ? 'success' : supplier.performanceScore >= 60 ? 'warning' : 'danger'} />
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                  <TableCell className="font-semibold">{supplier.totalSpend}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
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

export default Suppliers
