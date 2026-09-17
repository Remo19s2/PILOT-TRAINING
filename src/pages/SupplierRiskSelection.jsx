import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Search, MapPin, Star, TrendingUp, ShieldAlert, ArrowRight, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react'
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

  // Summary Metrics
  const highRiskCount = suppliers.filter(s => {
    const r = getSupplierRiskData(s.id)
    return r?.overallRiskLevel === 'high' || (r?.overallRiskScore || 0) >= 60
  }).length

  const avgRisk = Math.round(
    suppliers.reduce((acc, s) => acc + (getSupplierRiskData(s.id)?.overallRiskScore || 0), 0) / (suppliers.length || 1)
  )

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            Supplier Risk Intelligence
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Continuous AI risk profiling, multi-tier supply continuity, and exposure telemetry
          </p>
        </div>

        {/* Quick KPI Strip */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-500">Tracked Suppliers:</span>
            <span className="text-xs font-bold text-navy-900">{suppliers.length}</span>
          </div>
          <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-500">Avg Risk:</span>
            <span className="text-xs font-bold text-blue-700">{avgRisk}/100</span>
          </div>
          <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg shadow-2xs flex items-center gap-2">
            <span className="text-[11px] font-medium text-red-700">High Risk:</span>
            <span className="text-xs font-bold text-red-700">{highRiskCount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search supplier name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(supplier => {
          const riskData = getSupplierRiskData(supplier.id)
          const isHighRisk = riskData?.overallRiskLevel === 'high' || (riskData?.overallRiskScore || 0) >= 60

          return (
            <Card
              key={supplier.id}
              className={`border transition-all hover:shadow-md cursor-pointer ${
                isHighRisk ? 'border-red-200 bg-red-50/10' : 'border-gray-200 bg-white'
              }`}
              onClick={() => handleAnalyzeRisk(supplier.id)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-navy-900 truncate">{supplier.name}</h3>
                    <p className="text-[11px] text-gray-500">{supplier.id} &bull; {supplier.category}</p>
                  </div>
                  {riskData && (
                    <RiskBadge level={riskData.overallRiskLevel} size="sm" />
                  )}
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-gray-50/90 rounded-lg border border-gray-100 text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block">Risk Score</span>
                    <span className={`text-sm font-bold ${
                      isHighRisk ? 'text-red-600' : 'text-navy-900'
                    }`}>
                      {riskData?.overallRiskScore ?? 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block">Rating</span>
                    <span className="text-sm font-bold text-amber-600">★ {supplier.rating || '4.5'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block">On-Time</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {riskData?.historicalPerformance?.onTimeDeliveryRate ? `${riskData.historicalPerformance.onTimeDeliveryRate}%` : '94%'}
                    </span>
                  </div>
                </div>

                {/* Location & Action */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1 truncate max-w-[160px]">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                    {supplier.location || 'Global'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-semibold p-1 h-7 flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAnalyzeRisk(supplier.id)
                    }}
                  >
                    Deep Dive
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <p className="text-xs text-gray-500">No suppliers found matching your search.</p>
        </Card>
      )}
    </div>
  )
}

export default SupplierRiskSelection
