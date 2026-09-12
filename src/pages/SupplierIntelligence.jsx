import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { Users, Search, Filter, TrendingUp, Star, Shield, Clock, Globe, MapPin, Phone, Mail, CheckCircle, AlertTriangle, Brain, BarChart3, Target, ArrowRight, Eye, X } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const SupplierIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      alert('AI Analysis completed successfully!')
    }, 2000)
  }

  const handleCreateRFQ = (supplier) => {
    alert(`RFQ created for ${supplier.name}!`)
    setSelectedSupplier(null)
  }

  const handleViewDetails = (supplier) => {
    alert(`Viewing detailed profile for ${supplier.name}`)
  }

  // Supplier Intelligence Agent Data
  const suppliers = [
    {
      id: 'SUP-001',
      name: 'TechCorp Industries',
      category: 'Electronics',
      location: 'Taiwan',
      contact: 'contact@techcorp.com',
      phone: '+886-2-1234-5678',
      
      // Performance Metrics
      overallScore: 96,
      deliveryScore: 98,
      qualityScore: 95,
      costScore: 92,
      responsivenessScore: 94,
      
      // Risk Assessment
      riskLevel: 'low',
      financialHealth: 'Strong',
      complianceScore: 97,
      
      // Capabilities
      annualCapacity: 500000,
      leadTime: 14,
      flexibility: 'High',
      
      // History
      totalOrders: 245,
      onTimeDelivery: 98,
      qualityIssues: 2,
      
      // AI Analysis
      aiRecommendation: 'Primary supplier for electronic components. Excellent track record with 98% on-time delivery. Strong financial health and compliance. Recommended for long-term partnership.',
      aiConfidence: 95,
    },
    {
      id: 'SUP-002',
      name: 'IndustrialX Manufacturing',
      category: 'Raw Materials',
      location: 'Germany',
      contact: 'info@industrialx.de',
      phone: '+49-30-1234-5678',
      
      overallScore: 78,
      deliveryScore: 82,
      qualityScore: 80,
      costScore: 85,
      responsivenessScore: 75,
      
      riskLevel: 'high',
      financialHealth: 'Moderate',
      complianceScore: 88,
      
      annualCapacity: 750000,
      leadTime: 18,
      flexibility: 'Medium',
      
      totalOrders: 189,
      onTimeDelivery: 82,
      qualityIssues: 8,
      
      aiRecommendation: 'Supplier showing performance decline. Recent delivery delays and increased quality issues. Financial health concerns. Recommend diversification and reduced dependency.',
      aiConfidence: 88,
    },
    {
      id: 'SUP-003',
      name: 'AutoParts Premium',
      category: 'Automotive',
      location: 'Japan',
      contact: 'sales@autoparts.jp',
      phone: '+81-3-1234-5678',
      
      overallScore: 91,
      deliveryScore: 94,
      qualityScore: 92,
      costScore: 88,
      responsivenessScore: 90,
      
      riskLevel: 'low',
      financialHealth: 'Strong',
      complianceScore: 95,
      
      annualCapacity: 350000,
      leadTime: 12,
      flexibility: 'High',
      
      totalOrders: 156,
      onTimeDelivery: 94,
      qualityIssues: 3,
      
      aiRecommendation: 'Excellent supplier for automotive components. Fast delivery (12 days) with high quality. Good cost competitiveness. Recommended as backup supplier for critical components.',
      aiConfidence: 92,
    },
    {
      id: 'SUP-004',
      name: 'PrimeMfg Solutions',
      category: 'Logistics',
      location: 'Singapore',
      contact: 'operations@primemfg.sg',
      phone: '+65-6-1234-5678',
      
      overallScore: 89,
      deliveryScore: 92,
      qualityScore: 88,
      costScore: 90,
      responsivenessScore: 88,
      
      riskLevel: 'low',
      financialHealth: 'Strong',
      complianceScore: 93,
      
      annualCapacity: 200000,
      leadTime: 10,
      flexibility: 'Very High',
      
      totalOrders: 98,
      onTimeDelivery: 92,
      qualityIssues: 4,
      
      aiRecommendation: 'Strong logistics services provider. Excellent flexibility and responsiveness. Good for non-critical logistics needs. Recommended for secondary logistics routes.',
      aiConfidence: 90,
    },
    {
      id: 'SUP-005',
      name: 'GlobalSupply Co.',
      category: 'General',
      location: 'China',
      contact: 'sales@globalsupply.cn',
      phone: '+86-21-1234-5678',
      
      overallScore: 72,
      deliveryScore: 75,
      qualityScore: 70,
      costScore: 95,
      responsivenessScore: 78,
      
      riskLevel: 'high',
      financialHealth: 'Moderate',
      complianceScore: 82,
      
      annualCapacity: 1000000,
      leadTime: 25,
      flexibility: 'Low',
      
      totalOrders: 312,
      onTimeDelivery: 75,
      qualityIssues: 15,
      
      aiRecommendation: 'Low-cost supplier with quality and delivery concerns. High volume capacity but poor flexibility. Use only for non-critical, cost-sensitive items with strict quality controls.',
      aiConfidence: 85,
    },
  ]

  const getRiskBadge = (risk) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
    }
    return <Badge variant={variants[risk]}>{risk.charAt(0).toUpperCase() + risk.slice(1)}</Badge>
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Radar Chart Data
  const radarData = [
    { subject: 'Delivery', A: 98, B: 82, C: 94, fullMark: 100 },
    { subject: 'Quality', A: 95, B: 80, C: 92, fullMark: 100 },
    { subject: 'Cost', A: 92, B: 85, C: 88, fullMark: 100 },
    { subject: 'Responsiveness', A: 94, B: 75, C: 90, fullMark: 100 },
    { subject: 'Compliance', A: 97, B: 88, C: 95, fullMark: 100 },
  ]

  // Performance Trend Data
  const performanceTrend = [
    { month: 'Sep', TechCorp: 94, IndustrialX: 80, AutoParts: 90 },
    { month: 'Oct', TechCorp: 95, IndustrialX: 78, AutoParts: 91 },
    { month: 'Nov', TechCorp: 95, IndustrialX: 76, AutoParts: 91 },
    { month: 'Dec', TechCorp: 96, IndustrialX: 78, AutoParts: 91 },
    { month: 'Jan', TechCorp: 96, IndustrialX: 78, AutoParts: 91 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Supplier Intelligence Agent</h1>
          <p className="text-gray-600 mt-1">AI-powered supplier analysis and intelligence</p>
        </div>
        <Button onClick={handleRunAIAnalysis} disabled={isAnalyzing}>
          <Brain className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold text-navy-900">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success-100 rounded-lg">
                <Star className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Performance</p>
                <p className="text-2xl font-bold text-success-600">{suppliers.filter(s => s.overallScore >= 90).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-danger-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-danger-600">{suppliers.filter(s => s.riskLevel === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-navy-900">{Math.round(suppliers.reduce((sum, s) => sum + s.overallScore, 0) / suppliers.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="TechCorp" dataKey="A" stroke="#3367d6" fill="#3367d6" fillOpacity={0.3} />
                <Radar name="IndustrialX" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="AutoParts" dataKey="C" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="TechCorp" fill="#3367d6" />
                <Bar dataKey="IndustrialX" fill="#ef4444" />
                <Bar dataKey="AutoParts" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search supplier name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Automotive">Automotive</option>
                <option value="Logistics">Logistics</option>
                <option value="General">General</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <CardDescription>{supplier.category}</CardDescription>
                </div>
                {getRiskBadge(supplier.riskLevel)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{supplier.location}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Score</span>
                  <span className="font-bold text-navy-900">{supplier.overallScore}/100</span>
                </div>
                <Progress value={supplier.overallScore} variant="primary" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">{supplier.deliveryScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality</span>
                  <span className="font-medium">{supplier.qualityScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost</span>
                  <span className="font-medium">{supplier.costScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead Time</span>
                  <span className="font-medium">{supplier.leadTime} days</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Brain className="w-3 h-3 text-accent-600" />
                <span>{supplier.aiConfidence}% AI Confidence</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedSupplier.name}</CardTitle>
                  <CardDescription>{selectedSupplier.category} • {selectedSupplier.id}</CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setSelectedSupplier(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedSupplier.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedSupplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedSupplier.contact}</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Overall</p>
                  <p className="text-2xl font-bold text-navy-900">{selectedSupplier.overallScore}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Delivery</p>
                  <p className="text-2xl font-bold text-primary-600">{selectedSupplier.deliveryScore}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Quality</p>
                  <p className="text-2xl font-bold text-success-600">{selectedSupplier.qualityScore}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Cost</p>
                  <p className="text-2xl font-bold text-warning-600">{selectedSupplier.costScore}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Responsiveness</p>
                  <p className="text-2xl font-bold text-accent-600">{selectedSupplier.responsivenessScore}</p>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                  {getRiskBadge(selectedSupplier.riskLevel)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Financial Health</p>
                  <p className="font-medium text-navy-900">{selectedSupplier.financialHealth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Compliance Score</p>
                  <p className="font-medium text-navy-900">{selectedSupplier.complianceScore}/100</p>
                </div>
              </div>

              {/* Capabilities */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Annual Capacity</p>
                  <p className="font-medium text-navy-900">{selectedSupplier.annualCapacity.toLocaleString()} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lead Time</p>
                  <p className="font-medium text-navy-900">{selectedSupplier.leadTime} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Flexibility</p>
                  <p className="font-medium text-navy-900">{selectedSupplier.flexibility}</p>
                </div>
              </div>

              {/* History */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Total Orders</p>
                  <p className="text-lg font-bold text-navy-900">{selectedSupplier.totalOrders}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">On-Time Delivery</p>
                  <p className="text-lg font-bold text-success-600">{selectedSupplier.onTimeDelivery}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Quality Issues</p>
                  <p className="text-lg font-bold text-danger-600">{selectedSupplier.qualityIssues}</p>
                </div>
              </div>

              {/* AI Analysis */}
              <Card className="border-2 border-accent-500 bg-accent-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-900">
                    <Brain className="w-5 h-5 text-accent-600" />
                    AI Intelligence Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-accent-800">{selectedSupplier.aiRecommendation}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{selectedSupplier.aiConfidence}% AI Confidence</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="primary" className="flex-1" onClick={() => handleCreateRFQ(selectedSupplier)}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Create RFQ
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => handleViewDetails(selectedSupplier)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  )
}

export default SupplierIntelligence
