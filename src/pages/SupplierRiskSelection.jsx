import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Search, MapPin, Star, TrendingUp, ArrowRight } from 'lucide-react'
import RiskBadge from '../components/shared/RiskBadge'

const SupplierRiskSelection = () => {
  const navigate = useNavigate()
  const { suppliers, getSupplierRiskData } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Electronics', 'Raw Materials', 'Hardware']

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAnalyzeRisk = (supplierId) => {
    navigate(`/supplier-risk-analysis/${supplierId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Supplier Risk Analysis</h1>
        <p className="text-gray-600 mt-2">Select a supplier to analyze their risk profile and historical performance</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(supplier => {
          const riskData = getSupplierRiskData(supplier.id)
          return (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{supplier.id}</p>
                  </div>
                  {riskData && (
                    <RiskBadge level={riskData.overallRiskLevel} size="sm" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Supplier Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {supplier.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4" />
                    {supplier.category}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    Rating: {supplier.rating}/5.0
                  </div>
                </div>

                {/* Risk Score */}
                {riskData && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk Score</span>
                      <span className="text-xl font-bold">{riskData.overallRiskScore}</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => handleAnalyzeRisk(supplier.id)}
                  className="w-full"
                  size="sm"
                >
                  Analyze
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No suppliers found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

export default SupplierRiskSelection
