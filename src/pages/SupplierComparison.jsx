import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Progress } from '../components/ui/Progress'
import { Search, Filter, X, TrendingUp, Shield, Star, AlertTriangle, CheckCircle, ArrowUpDown, Brain, BarChart3, Eye, Package, Clock, DollarSign, Award, AlertCircle } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const SupplierComparison = () => {
  const navigate = useNavigate()
  const { rfqId } = useParams()
  const { supplierComparisons, quotations, negotiations } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sortBy, setSortBy] = useState('overallScore')
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [showSelectDialog, setShowSelectDialog] = useState(null)
  const [showRiskWarning, setShowRiskWarning] = useState(null)

  // Get the comparison data for the specific RFQ or default to first one
  const comparisonData = rfqId 
    ? supplierComparisons.find(c => c.rfqId === rfqId)
    : supplierComparisons[0]

  if (!comparisonData) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-navy-900">Supplier Comparison</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">No supplier comparison data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter out late submissions and only include negotiated suppliers (deal agreed)
  const eligibleSuppliers = comparisonData?.suppliers?.filter(supplier => {
    const quotation = quotations?.find(q => q.rfqId === comparisonData.rfqId && q.supplierId === supplier.supplierId)
    const negotiation = negotiations?.find(n => n.supplierId === supplier.supplierId && n.rfqId === comparisonData.rfqId)
    
    // Only include if:
    // 1. No quotation exists (pending) OR quotation is on-time
    // 2. Negotiation is complete (deal agreed) OR no negotiation exists yet
    const isOnTime = !quotation || quotation.submissionStatus !== 'late'
    const isNegotiated = !negotiation || negotiation.dealStatus === 'agreed'
    
    return isOnTime && isNegotiated
  }) || []

  // Update supplier prices based on negotiated deals
  const suppliersWithNegotiatedPrices = eligibleSuppliers.map(supplier => {
    const negotiation = negotiations?.find(n => n.supplierId === supplier.supplierId && n.rfqId === comparisonData.rfqId)
    if (negotiation && negotiation.dealStatus === 'agreed') {
      return {
        ...supplier,
        quotedPrice: negotiation.finalAgreedPrice || negotiation.currentOffer,
        totalQuotation: (negotiation.finalAgreedPrice || negotiation.currentOffer) * comparisonData.requiredQuantity,
        deliveryTime: negotiation.finalDelivery || negotiation.deliveryRequirement,
        negotiationStatus: 'agreed',
        savings: negotiation.totalSavings || 0
      }
    }
    return {
      ...supplier,
      negotiationStatus: 'pending'
    }
  })

  const filteredSuppliers = suppliersWithNegotiatedPrices.filter(supplier => {
    const matchesSearch = supplier.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.supplierId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskFilter === 'all' || 
                        (riskFilter === 'low' && supplier.riskLevel === 'Low') ||
                        (riskFilter === 'medium' && supplier.riskLevel === 'Medium') ||
                        (riskFilter === 'high' && supplier.riskLevel === 'High')
    return matchesSearch && matchesRisk
  }).sort((a, b) => {
    if (sortBy === 'overallScore') return b.overallScore - a.overallScore
    if (sortBy === 'price') return a.quotedPrice - b.quotedPrice
    if (sortBy === 'deliveryTime') return a.deliveryTime - b.deliveryTime
    if (sortBy === 'quality') return b.qualityScore - a.qualityScore
    if (sortBy === 'riskScore') return a.riskScore - b.riskScore
    if (sortBy === 'ranking') return a.ranking - b.ranking
    return 0
  })

  const getRiskBadge = (level) => {
    const styles = {
      'Low': 'bg-green-100 text-green-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'High': 'bg-red-100 text-red-700'
    }
    return (
      <span className={`text-xs px-2 py-1 rounded ${styles[level] || 'bg-gray-100 text-gray-700'}`}>
        {level} Risk
      </span>
    )
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return <Badge className="bg-green-500 text-white">#{rank} Recommended</Badge>
    if (rank <= 3) return <Badge className="bg-primary-500 text-white">#{rank}</Badge>
    return <Badge variant="secondary">#{rank}</Badge>
  }

  const getNegotiationBadge = (status, savings) => {
    if (status === 'agreed') {
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="success" className="text-xs">Deal Agreed</Badge>
          {savings > 0 && (
            <span className="text-xs text-green-600 font-medium">
              Saved: ₹{savings.toLocaleString()}
            </span>
          )}
        </div>
      )
    }
    return <Badge variant="warning" className="text-xs">Negotiation Pending</Badge>
  }

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier)
  }

  const handleSelectSupplier = (supplier) => {
    if (supplier.riskLevel === 'High') {
      setShowRiskWarning(supplier)
    } else {
      setShowSelectDialog(supplier)
    }
  }

  const confirmSelection = () => {
    alert(`Supplier ${showSelectDialog.supplierName} selected for ${comparisonData.rfqId}`)
    setShowSelectDialog(null)
  }

  const proceedWithRisk = () => {
    setShowRiskWarning(null)
    setShowSelectDialog(showRiskWarning)
  }

  const radarData = filteredSuppliers.slice(0, 5).map(s => ({
    name: s.supplierName.split(' ')[0],
    price: s.priceScore,
    delivery: s.deliveryScore,
    quality: s.qualityScoreDetail,
    capacity: s.capacityScore,
    risk: 100 - s.riskScore,
  }))

  const barChartData = filteredSuppliers.slice(0, 5).map(s => ({
    name: s.supplierName.split(' ')[0],
    price: s.quotedPrice,
    delivery: s.deliveryPerformance,
    quality: s.qualityScore,
    overall: s.overallScore,
  }))

  const recommendedSupplier = comparisonData.suppliers.find(s => s.supplierId === comparisonData.recommendedSupplier)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Supplier Comparison</h1>
        <p className="text-gray-600 mt-1">Compare supplier quotations, performance, delivery, quality, capacity and risk to identify the most suitable supplier.</p>
      </div>

      {/* RFQ Information */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <span className="text-sm text-gray-600">RFQ ID</span>
              <p className="font-medium">{comparisonData.rfqId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Component</span>
              <p className="font-medium text-black">{comparisonData.rfqName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Required Quantity</span>
              <p className="font-medium">{comparisonData.requiredQuantity.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Required Delivery</span>
              <p className="font-medium">{comparisonData.requiredDelivery} Days</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Suppliers</span>
              <p className="font-medium">{comparisonData.suppliers.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Tracker */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Requirement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">RFQ Sent</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Quotation Received</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Negotiation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white text-xs">5</span>
              </div>
              <span className="text-sm font-medium text-primary-600">Supplier Comparison</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-xs">6</span>
              </div>
              <span className="text-sm text-gray-500">Supplier Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-xs">7</span>
              </div>
              <span className="text-sm text-gray-500">Finance Approval</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Intelligence Overview */}
      <Card className="border-2 border-primary-200 bg-primary-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-600" />
            Supplier Intelligence Overview
          </CardTitle>
          <CardDescription>Supplier Intelligence Analysis (Mock Data - Ready for Backend Integration)</CardDescription>
        </CardHeader>
        <CardContent>
          {recommendedSupplier && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Recommended Supplier</span>
                  <p className="text-xl font-bold text-navy-900">{comparisonData.recommendedSupplierName}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Overall Score</span>
                  <p className="text-3xl font-bold text-primary-600">{recommendedSupplier.overallScore} / 100</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <span className="text-xs text-gray-600">Price Score</span>
                  <p className="text-lg font-semibold">{recommendedSupplier.priceScore}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Delivery Score</span>
                  <p className="text-lg font-semibold">{recommendedSupplier.deliveryScore}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Quality Score</span>
                  <p className="text-lg font-semibold">{recommendedSupplier.qualityScoreDetail}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Capacity Score</span>
                  <p className="text-lg font-semibold">{recommendedSupplier.capacityScore}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Risk Score</span>
                  <p className="text-lg font-semibold">{recommendedSupplier.riskScore}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Risk Level</span>
                  <p className="text-lg font-semibold">{recommendedSupplier.riskLevel}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendation Panel */}
      <Card className="border-2 border-accent-500 bg-accent-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent-600" />
            Supplier Intelligence Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">Recommended Supplier</span>
                <p className="text-xl font-bold text-navy-900">{comparisonData.recommendedSupplierName}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Overall Score</span>
                <p className="text-2xl font-bold text-accent-600">{recommendedSupplier?.overallScore}</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Why:</span>
              <p className="text-sm text-gray-800 mt-1">{comparisonData.recommendationReason}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
              <span className="text-sm font-medium text-yellow-800">Key Trade-Off:</span>
              <p className="text-sm text-yellow-700 mt-1">{comparisonData.keyTradeOff}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="w-40">
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </Select>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-40">
              <option value="overallScore">Sort by Score</option>
              <option value="price">Sort by Price</option>
              <option value="deliveryTime">Sort by Delivery</option>
              <option value="quality">Sort by Quality</option>
              <option value="riskScore">Sort by Risk</option>
              <option value="ranking">Sort by Ranking</option>
            </Select>
            <Button variant="secondary" size="sm" onClick={() => { setSearchTerm(''); setRiskFilter('all'); setSortBy('overallScore'); }}>
              <X className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="#3367d6" name="Price (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="delivery" fill="#22c55e" name="Delivery %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Comparison Table</CardTitle>
          <CardDescription>Detailed comparison across all metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Supplier ID</TableHead>
                  <TableHead>Quoted Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Delivery Perf.</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Historical</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Negotiation</TableHead>
                  <TableHead>Ranking</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.supplierId} className={supplier.selected ? 'bg-green-50' : ''}>
                    <TableCell className="font-medium text-black">{supplier.supplierName}</TableCell>
                    <TableCell>{supplier.supplierId}</TableCell>
                    <TableCell className="font-semibold">₹{supplier.quotedPrice}/unit</TableCell>
                    <TableCell>₹{supplier.totalQuotation.toLocaleString()}</TableCell>
                    <TableCell>{supplier.deliveryTime} Days</TableCell>
                    <TableCell>{supplier.deliveryPerformance}%</TableCell>
                    <TableCell>{supplier.qualityScore}</TableCell>
                    <TableCell>
                      <Badge variant={supplier.capacityStatus === 'Available' ? 'success' : 'warning'}>
                        {supplier.capacityStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.historicalPerformance}</TableCell>
                    <TableCell>{getRiskBadge(supplier.riskLevel)}</TableCell>
                    <TableCell>{supplier.riskScore}</TableCell>
                    <TableCell className="font-bold text-accent-600">{supplier.overallScore}</TableCell>
                    <TableCell>{getNegotiationBadge(supplier.negotiationStatus, supplier.savings)}</TableCell>
                    <TableCell>{getRankBadge(supplier.ranking)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleViewDetails(supplier)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleSelectSupplier(supplier)}>
                          Select
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Supplier Scorecard</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSupplier(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Supplier Name</span>
                  <p className="font-medium">{selectedSupplier.supplierName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Supplier ID</span>
                  <p className="font-medium">{selectedSupplier.supplierId}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Overall Supplier Score: {selectedSupplier.overallScore}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Price Score</span>
                      <span>{selectedSupplier.priceScore}</span>
                    </div>
                    <Progress value={selectedSupplier.priceScore} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Delivery Score</span>
                      <span>{selectedSupplier.deliveryScore}</span>
                    </div>
                    <Progress value={selectedSupplier.deliveryScore} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Quality Score</span>
                      <span>{selectedSupplier.qualityScoreDetail}</span>
                    </div>
                    <Progress value={selectedSupplier.qualityScoreDetail} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Capacity Score</span>
                      <span>{selectedSupplier.capacityScore}</span>
                    </div>
                    <Progress value={selectedSupplier.capacityScore} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Score</span>
                      <span>{selectedSupplier.riskScore} ({selectedSupplier.riskLevel})</span>
                    </div>
                    <Progress value={100 - selectedSupplier.riskScore} />
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Quotation Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Quoted Price</span>
                    <p className="font-medium">₹{selectedSupplier.quotedPrice}/unit</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Quotation</span>
                    <p className="font-medium">₹{selectedSupplier.totalQuotation.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Delivery Time</span>
                    <p className="font-medium">{selectedSupplier.deliveryTime} Days</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Capacity Status</span>
                    <p className="font-medium">{selectedSupplier.capacityStatus}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Select Supplier Confirmation Dialog */}
      {showSelectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Select Supplier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Confirm selection of <strong>{showSelectDialog.supplierName}</strong> for {comparisonData.rfqId}?</p>
              <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Supplier:</span>
                  <span className="font-medium">{showSelectDialog.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quotation:</span>
                  <span className="font-medium">₹{showSelectDialog.quotedPrice}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-medium">{showSelectDialog.deliveryTime} Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Overall Score:</span>
                  <span className="font-medium">{showSelectDialog.overallScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Level:</span>
                  <span className="font-medium">{showSelectDialog.riskLevel}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={confirmSelection} className="flex-1">
                  Confirm Selection
                </Button>
                <Button variant="secondary" onClick={() => setShowSelectDialog(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* High-Risk Supplier Warning */}
      {showRiskWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md border-2 border-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                High Supplier Risk Warning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>This supplier has a high predicted risk score.</p>
              <div className="bg-red-50 p-4 rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className="font-bold text-red-600">{showRiskWarning.riskScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Concern:</span>
                  <span className="font-medium">Historical delivery delays and quality issues</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => navigate(`/supplier-risk-analysis/${showRiskWarning.supplierId}`)} className="flex-1">
                  View Risk Analysis
                </Button>
                <Button variant="danger" onClick={proceedWithRisk} className="flex-1">
                  Proceed Anyway
                </Button>
                <Button variant="secondary" onClick={() => setShowRiskWarning(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default SupplierComparison

