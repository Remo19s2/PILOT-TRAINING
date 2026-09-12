import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Progress } from '../components/ui/Progress'
import { Search, Filter, Eye, CheckCircle, XCircle, MessageSquare, TrendingUp, AlertTriangle, Calendar, DollarSign, Star, Shield, ArrowUpDown, Brain } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const QuotationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'comparison'

  const quotations = [
    {
      id: 'QT-2024-001',
      rfqId: 'RFQ-2024-001',
      rfqTitle: 'Electronic Components Batch A',
      supplier: 'TechCorp Industries',
      status: 'pending_review',
      submittedDate: '2024-01-10',
      validUntil: '2024-01-20',
      price: 125000,
      originalPrice: 135000,
      discount: 7.4,
      deliveryDate: '2024-01-25',
      deliveryTerms: 'FOB Destination',
      paymentTerms: 'Net 30',
      qualityScore: 95,
      onTimeRate: 98,
      riskScore: 15,
      historicalPerformance: 92,
      totalOrders: 45,
      avgResponseTime: 2,
      specifications: {
        technical: 'ISO 9001 certified, RoHS compliant',
        warranty: '24 months',
        support: '24/7 technical support',
        certification: 'CE, FCC certified'
      },
      aiRecommendation: {
        recommended: true,
        confidence: 94,
        costAdvantage: '$10,000 vs competitors',
        riskAnalysis: 'Low risk - excellent financial health',
        deliveryFeasibility: 'High - 98% on-time delivery rate',
        reason: 'Best combination of price, quality, and reliability. Supplier has strong historical performance and low risk profile.'
      }
    },
    {
      id: 'QT-2024-002',
      rfqId: 'RFQ-2024-001',
      rfqTitle: 'Electronic Components Batch A',
      supplier: 'IndustrialX Manufacturing',
      status: 'pending_review',
      submittedDate: '2024-01-10',
      validUntil: '2024-01-20',
      price: 118000,
      originalPrice: 125000,
      discount: 5.6,
      deliveryDate: '2024-01-28',
      deliveryTerms: 'Ex-Works',
      paymentTerms: 'Net 45',
      qualityScore: 85,
      onTimeRate: 88,
      riskScore: 28,
      historicalPerformance: 78,
      totalOrders: 32,
      avgResponseTime: 3,
      specifications: {
        technical: 'ISO 9001 certified',
        warranty: '12 months',
        support: 'Business hours support',
        certification: 'CE certified'
      },
      aiRecommendation: {
        recommended: false,
        confidence: 72,
        costAdvantage: '$7,000 lowest price',
        riskAnalysis: 'Medium risk - recent performance decline',
        deliveryFeasibility: 'Medium - 88% on-time delivery rate',
        reason: 'Lowest price but higher risk profile and longer delivery. Quality score below threshold.'
      }
    },
    {
      id: 'QT-2024-003',
      rfqId: 'RFQ-2024-001',
      rfqTitle: 'Electronic Components Batch A',
      supplier: 'AutoParts Premium',
      status: 'pending_review',
      submittedDate: '2024-01-10',
      validUntil: '2024-01-20',
      price: 132000,
      originalPrice: 140000,
      discount: 5.7,
      deliveryDate: '2024-01-22',
      deliveryTerms: 'DDP',
      paymentTerms: 'Net 30',
      qualityScore: 90,
      onTimeRate: 94,
      riskScore: 18,
      historicalPerformance: 88,
      totalOrders: 28,
      avgResponseTime: 2,
      specifications: {
        technical: 'ISO 9001, ISO 14001 certified',
        warranty: '18 months',
        support: '24/7 technical support',
        certification: 'CE, FCC, UL certified'
      },
      aiRecommendation: {
        recommended: false,
        confidence: 85,
        costAdvantage: '$7,000 higher than lowest',
        riskAnalysis: 'Low risk - stable performance',
        deliveryFeasibility: 'High - fastest delivery',
        reason: 'Fastest delivery and good quality but premium pricing. Consider if timeline is critical.'
      }
    },
    {
      id: 'QT-2024-004',
      rfqId: 'RFQ-2024-002',
      rfqTitle: 'Raw Materials - Steel',
      supplier: 'IndustrialX Manufacturing',
      status: 'under_review',
      submittedDate: '2024-01-12',
      validUntil: '2024-01-25',
      price: 89500,
      originalPrice: 95000,
      discount: 5.8,
      deliveryDate: '2024-02-05',
      deliveryTerms: 'Ex-Works',
      paymentTerms: 'Net 30',
      qualityScore: 82,
      onTimeRate: 85,
      riskScore: 25,
      historicalPerformance: 78,
      totalOrders: 22,
      avgResponseTime: 3,
      specifications: {
        technical: 'ASTM A36, Grade 50',
        warranty: '12 months',
        support: 'Business hours support',
        certification: 'ISO certified'
      },
      aiRecommendation: {
        recommended: true,
        confidence: 78,
        costAdvantage: '$2,500 vs competitor',
        riskAnalysis: 'Medium risk - operational concerns',
        deliveryFeasibility: 'Medium - 85% on-time delivery rate',
        reason: 'Competitive pricing for steel grade. Risk manageable with proper monitoring.'
      }
    },
    {
      id: 'QT-2024-005',
      rfqId: 'RFQ-2024-002',
      rfqTitle: 'Raw Materials - Steel',
      supplier: 'GlobalSupply Co.',
      status: 'under_review',
      submittedDate: '2024-01-12',
      validUntil: '2024-01-25',
      price: 92000,
      originalPrice: 98000,
      discount: 6.1,
      deliveryDate: '2024-02-02',
      deliveryTerms: 'FOB',
      paymentTerms: 'Net 45',
      qualityScore: 78,
      onTimeRate: 80,
      riskScore: 35,
      historicalPerformance: 72,
      totalOrders: 18,
      avgResponseTime: 4,
      specifications: {
        technical: 'ASTM A36',
        warranty: '12 months',
        support: 'Email support',
        certification: 'ISO certified'
      },
      aiRecommendation: {
        recommended: false,
        confidence: 65,
        costAdvantage: 'Higher price',
        riskAnalysis: 'High risk - financial concerns',
        deliveryFeasibility: 'Low - 80% on-time delivery rate',
        reason: 'Higher risk profile and price. Not recommended without additional guarantees.'
      }
    },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      pending_review: 'warning',
      under_review: 'primary',
      approved: 'success',
      rejected: 'danger',
      negotiation: 'accent',
    }
    const labels = {
      pending_review: 'Pending Review',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      negotiation: 'Negotiation',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getRiskBadge = (score) => {
    if (score <= 20) return <Badge variant="success">Low Risk</Badge>
    if (score <= 30) return <Badge variant="warning">Medium Risk</Badge>
    return <Badge variant="danger">High Risk</Badge>
  }

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.rfqTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.rfqId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getQuotationsForRFQ = (rfqId) => {
    return quotations.filter(q => q.rfqId === rfqId)
  }

  const ComparisonCard = ({ quotation, isRecommended }) => (
    <Card className={`${isRecommended ? 'border-2 border-success-500' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{quotation.supplier}</CardTitle>
          {isRecommended && <Badge variant="success">AI Recommended</Badge>}
        </div>
        <CardDescription>{quotation.rfqTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Quoted Price</span>
            <span className="text-lg font-bold text-navy-900">${quotation.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Original: ${quotation.originalPrice.toLocaleString()}</span>
            <span className="text-success-600 font-medium">{quotation.discount}% off</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Quality Score</p>
            <p className="text-lg font-bold text-navy-900">{quotation.qualityScore}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">On-Time Rate</p>
            <p className="text-lg font-bold text-navy-900">{quotation.onTimeRate}%</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Risk Score</p>
            <p className="text-lg font-bold text-navy-900">{quotation.riskScore}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Historical</p>
            <p className="text-lg font-bold text-navy-900">{quotation.historicalPerformance}</p>
          </div>
        </div>

        {/* Delivery */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Delivery</span>
          </div>
          <span className="font-medium text-navy-900">{quotation.deliveryDate}</span>
        </div>

        {/* Terms */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Terms</span>
            <span className="font-medium">{quotation.deliveryTerms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Terms</span>
            <span className="font-medium">{quotation.paymentTerms}</span>
          </div>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center justify-between">
          {getRiskBadge(quotation.riskScore)}
          <span className="text-xs text-gray-500">{quotation.totalOrders} orders</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="success" size="sm" className="flex-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button variant="accent" size="sm" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-1" />
            Negotiate
          </Button>
          <Button variant="danger" size="sm">
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const AIRecommendationPanel = ({ quotations }) => {
    const recommended = quotations.find(q => q.aiRecommendation.recommended) || quotations[0]
    const comparisonData = quotations.map(q => ({
      supplier: q.supplier.split(' ')[0],
      price: 100 - (q.price / Math.max(...quotations.map(qt => qt.price)) * 100),
      quality: q.qualityScore,
      delivery: 100 - (new Date(q.deliveryDate).getTime() - new Date(Math.min(...quotations.map(qt => new Date(qt.deliveryDate).getTime()))).getTime()) / (1000 * 60 * 60 * 24 * 30) * 10,
      risk: 100 - q.riskScore,
      historical: q.historicalPerformance,
    }))

    return (
      <Card className="border-2 border-accent-500">
        <CardHeader className="bg-accent-50">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-accent-600" />
            <CardTitle className="text-accent-900">AI Recommendation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recommended Supplier */}
          <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-success-900">Recommended: {recommended.supplier}</h4>
              <Badge variant="success">Confidence: {recommended.aiRecommendation.confidence}%</Badge>
            </div>
            <p className="text-sm text-success-800">{recommended.aiRecommendation.reason}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <DollarSign className="w-4 h-4" />
                Cost Advantage
              </div>
              <p className="font-semibold text-navy-900">{recommended.aiRecommendation.costAdvantage}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <Shield className="w-4 h-4" />
                Risk Analysis
              </div>
              <p className="font-semibold text-navy-900 text-sm">{recommended.aiRecommendation.riskAnalysis}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                Delivery Feasibility
              </div>
              <p className="font-semibold text-navy-900 text-sm">{recommended.aiRecommendation.deliveryFeasibility}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <Star className="w-4 h-4" />
                Overall Score
              </div>
              <p className="font-semibold text-navy-900">{recommended.qualityScore}/100</p>
            </div>
          </div>

          {/* Comparison Chart */}
          <div>
            <h4 className="font-semibold text-navy-900 mb-3">Supplier Comparison</h4>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={comparisonData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="supplier" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Price" dataKey="price" stroke="#3367d6" fill="#3367d6" fillOpacity={0.3} />
                <Radar name="Quality" dataKey="quality" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                <Radar name="Risk" dataKey="risk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Quotation Management</h1>
          <p className="text-gray-600 mt-1">Compare and evaluate supplier quotations with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button 
            variant={viewMode === 'comparison' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('comparison')}
          >
            Comparison View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
              <option value="all">All Status</option>
              <option value="pending_review">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="negotiation">Negotiation</option>
            </Select>
            <Select 
              value={selectedRFQ || 'all'} 
              onChange={(e) => setSelectedRFQ(e.target.value === 'all' ? null : e.target.value)}
              className="w-48"
            >
              <option value="all">All RFQs</option>
              {[...new Set(quotations.map(q => q.rfqId))].map(rfqId => (
                <option key={rfqId} value={rfqId}>{rfqId}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>All Quotations</CardTitle>
            <CardDescription>Manage and evaluate supplier quotations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation ID</TableHead>
                  <TableHead>RFQ Reference</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Quality Score</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quot) => (
                  <TableRow key={quot.id}>
                    <TableCell className="font-medium">{quot.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-navy-900">{quot.rfqId}</p>
                        <p className="text-sm text-gray-500">{quot.rfqTitle}</p>
                      </div>
                    </TableCell>
                    <TableCell>{quot.supplier}</TableCell>
                    <TableCell className="font-semibold">${quot.price.toLocaleString()}</TableCell>
                    <TableCell>{quot.deliveryDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{quot.qualityScore}</span>
                        <Progress value={quot.qualityScore} variant="success" className="w-16" />
                      </div>
                    </TableCell>
                    <TableCell>{getRiskBadge(quot.riskScore)}</TableCell>
                    <TableCell>{getStatusBadge(quot.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="success" size="sm">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="accent" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <div className="space-y-6">
          {/* RFQ Selection */}
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Compare quotations for:</span>
            <Select 
              value={selectedRFQ || quotations[0]?.rfqId}
              onChange={(e) => setSelectedRFQ(e.target.value)}
              className="w-64"
            >
              {[...new Set(quotations.map(q => q.rfqId))].map(rfqId => (
                <option key={rfqId} value={rfqId}>
                  {rfqId} - {quotations.find(q => q.rfqId === rfqId)?.rfqTitle}
                </option>
              ))}
            </Select>
          </div>

          {/* AI Recommendation Panel */}
          <AIRecommendationPanel quotations={getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId)} />

          {/* Side-by-Side Comparison */}
          <div>
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Side-by-Side Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                <ComparisonCard 
                  key={quot.id} 
                  quotation={quot} 
                  isRecommended={quot.aiRecommendation.recommended}
                />
              ))}
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
              <CardDescription>Line-by-line comparison of all quotations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criteria</TableHead>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableHead key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        {quot.supplier}
                        {quot.aiRecommendation.recommended && <Badge variant="success" className="ml-2">Recommended</Badge>}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Price</TableCell>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableCell key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        <span className="font-semibold">${quot.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 ml-2">({quot.discount}% off)</span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Delivery Date</TableCell>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableCell key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        {quot.deliveryDate}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Quality Score</TableCell>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableCell key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{quot.qualityScore}</span>
                          <Progress value={quot.qualityScore} variant="success" className="w-20" />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">On-Time Delivery</TableCell>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableCell key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        {quot.onTimeRate}%
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Risk Score</TableCell>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableCell key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        {getRiskBadge(quot.riskScore)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Historical Performance</TableCell>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableCell key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        {quot.historicalPerformance}/100
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Payment Terms</TableCell>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableCell key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        {quot.paymentTerms}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Delivery Terms</TableCell>
                    {getQuotationsForRFQ(selectedRFQ || quotations[0]?.rfqId).map((quot) => (
                      <TableCell key={quot.id} className={quot.aiRecommendation.recommended ? 'bg-success-50' : ''}>
                        {quot.deliveryTerms}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default QuotationManagement
