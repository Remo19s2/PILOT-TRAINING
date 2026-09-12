import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Brain, Truck, DollarSign, Package, TrendingUp, TrendingDown, AlertTriangle, Clock, Target, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const AIPredictions = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Delivery Delay Predictions
  const deliveryPredictions = [
    {
      id: 1,
      order: 'PO-2024-0045',
      supplier: 'IndustrialX Manufacturing',
      material: 'Steel Sheets',
      predictedDelayProbability: 78,
      expectedDelayDuration: 5,
      affectedOrders: 3,
      rootCause: 'Supplier capacity constraints due to increased demand from automotive sector',
      suggestedAction: 'Expedite alternative supplier activation. Consider partial shipment from backup supplier.',
      predictedDelivery: '2024-01-28',
      originalDelivery: '2024-01-23',
    },
    {
      id: 2,
      order: 'PO-2024-0052',
      supplier: 'GlobalSupply Co.',
      material: 'Electronic Components',
      predictedDelayProbability: 92,
      expectedDelayDuration: 8,
      affectedOrders: 5,
      rootCause: 'Logistics disruption in Asian supply chain due to port congestion',
      suggestedAction: 'URGENT: Activate air freight contingency. Negotiate expedited shipping with alternative logistics provider.',
      predictedDelivery: '2024-02-05',
      originalDelivery: '2024-01-28',
    },
    {
      id: 3,
      order: 'PO-2024-0048',
      supplier: 'TechCorp Industries',
      material: 'Circuit Boards',
      predictedDelayProbability: 35,
      expectedDelayDuration: 2,
      affectedOrders: 1,
      rootCause: 'Minor production scheduling adjustment',
      suggestedAction: 'Monitor closely. No immediate action required but maintain backup supplier on standby.',
      predictedDelivery: '2024-01-25',
      originalDelivery: '2024-01-23',
    },
  ]

  // Price & Cost Predictions
  const pricePredictions = [
    {
      id: 1,
      material: 'Steel Raw Materials',
      category: 'Raw Materials',
      predictedPrice: 89500,
      historicalPrice: 82000,
      priceChange: 9.1,
      marketInfluence: 'Global steel demand increase, supply chain constraints',
      expectedCostChange: '+$7,500',
      trend: 'increasing',
      confidence: 88,
      factors: ['Raw material shortage', 'Energy cost increase', 'Transportation costs'],
    },
    {
      id: 2,
      material: 'Electronic Components',
      category: 'Electronics',
      predictedPrice: 132000,
      historicalPrice: 128000,
      priceChange: 3.1,
      marketInfluence: 'Semiconductor shortage easing, moderate demand',
      expectedCostChange: '+$4,000',
      trend: 'increasing',
      confidence: 75,
      factors: ['Supply chain recovery', 'Technology advancement', 'Competition increase'],
    },
    {
      id: 3,
      material: 'Packaging Materials',
      category: 'Packaging',
      predictedPrice: 42500,
      historicalPrice: 45000,
      priceChange: -5.6,
      marketInfluence: 'Paper prices stabilizing, increased recycling',
      expectedCostChange: '-$2,500',
      trend: 'decreasing',
      confidence: 82,
      factors: ['Sustainable materials adoption', 'Recycling initiatives', 'Market competition'],
    },
  ]

  // Inventory Predictions
  const inventoryPredictions = [
    {
      id: 1,
      item: 'Steel Sheets - Grade A',
      currentStock: 450,
      minStock: 500,
      inventoryRisk: 'high',
      predictedStockShortage: true,
      estimatedStockoutDate: '2024-01-25',
      recommendedReplenishment: 800,
      dailyUsage: 25,
      daysOfStock: 18,
      suggestedAction: 'Place urgent order for 800 units. Expedite delivery if possible.',
    },
    {
      id: 2,
      item: 'Circuit Boards - Model X',
      currentStock: 1200,
      minStock: 800,
      inventoryRisk: 'low',
      predictedStockShortage: false,
      estimatedStockoutDate: '2024-03-15',
      recommendedReplenishment: 500,
      dailyUsage: 15,
      daysOfStock: 80,
      suggestedAction: 'Maintain current order schedule. No immediate action needed.',
    },
    {
      id: 3,
      item: 'Packaging Boxes - Large',
      currentStock: 320,
      minStock: 400,
      inventoryRisk: 'medium',
      predictedStockShortage: true,
      estimatedStockoutDate: '2024-02-10',
      recommendedReplenishment: 600,
      dailyUsage: 12,
      daysOfStock: 27,
      suggestedAction: 'Place order within 5 days. Consider safety stock increase.',
    },
  ]

  // Supplier Performance Predictions
  const supplierPredictions = [
    {
      id: 1,
      supplier: 'TechCorp Industries',
      predictedScore: 94,
      currentScore: 92,
      expectedDeliveryPerformance: 96,
      expectedQualityPerformance: 95,
      trend: 'improving',
      confidence: 90,
      factors: ['Recent capacity expansion', 'Quality certification renewal', 'Financial health improvement'],
    },
    {
      id: 2,
      supplier: 'IndustrialX Manufacturing',
      predictedScore: 78,
      currentScore: 82,
      expectedDeliveryPerformance: 85,
      expectedQualityPerformance: 80,
      trend: 'declining',
      confidence: 85,
      factors: ['Financial concerns', 'Capacity constraints', 'Market volatility impact'],
    },
    {
      id: 3,
      supplier: 'AutoParts Premium',
      predictedScore: 91,
      currentScore: 88,
      expectedDeliveryPerformance: 94,
      expectedQualityPerformance: 90,
      trend: 'improving',
      confidence: 88,
      factors: ['Process optimization', 'Technology investment', 'Strategic partnerships'],
    },
  ]

  // Predicted vs Actual Data
  const predictedVsActualData = [
    { category: 'Delivery', predicted: 95, actual: 92 },
    { category: 'Price', predicted: 88, actual: 85 },
    { category: 'Inventory', predicted: 90, actual: 87 },
    { category: 'Quality', predicted: 93, actual: 91 },
    { category: 'Supplier', predicted: 89, actual: 86 },
  ]

  const priceTrendData = [
    { month: 'Aug', actual: 80000, predicted: 82000 },
    { month: 'Sep', actual: 81500, predicted: 83500 },
    { month: 'Oct', actual: 83000, predicted: 85000 },
    { month: 'Nov', actual: 84500, predicted: 86500 },
    { month: 'Dec', actual: 86000, predicted: 88000 },
    { month: 'Jan', actual: 82000, predicted: 89500 },
  ]

  const getDelayProbabilityColor = (probability) => {
    if (probability >= 80) return 'danger'
    if (probability >= 50) return 'warning'
    return 'success'
  }

  const getInventoryRiskBadge = (risk) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
    }
    return <Badge variant={variants[risk]}>{risk.charAt(0).toUpperCase() + risk.slice(1)} Risk</Badge>
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-danger-600" />
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-success-600" />
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-success-600" />
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-danger-600" />
    return <Activity className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">AI Predictions</h1>
          <p className="text-gray-600 mt-1">Machine learning-powered insights for procurement optimization</p>
        </div>
        <Button>
          <Brain className="w-4 h-4 mr-2" />
          Run AI Analysis
        </Button>
      </div>

      {/* Predicted vs Actual Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Accuracy Overview</CardTitle>
          <CardDescription>AI model performance - Predicted vs Actual comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={predictedVsActualData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="predicted" fill="#3367d6" name="Predicted" />
              <Bar dataKey="actual" fill="#22c55e" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Delivery Delay Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary-600" />
            Delivery Delay Predictions
          </CardTitle>
          <CardDescription>AI-powered delay probability and impact analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveryPredictions.map((prediction) => (
              <Card key={prediction.id} className="border-l-4 border-l-danger-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-navy-900">{prediction.order}</h4>
                      <p className="text-sm text-gray-600">{prediction.supplier} - {prediction.material}</p>
                    </div>
                    <Badge variant={getDelayProbabilityColor(prediction.predictedDelayProbability)}>
                      {prediction.predictedDelayProbability}% Delay Probability
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Expected Delay</p>
                      <p className="text-lg font-bold text-navy-900">{prediction.expectedDelayDuration} days</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Affected Orders</p>
                      <p className="text-lg font-bold text-navy-900">{prediction.affectedOrders}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Original Delivery</p>
                      <p className="text-sm font-medium text-navy-900">{prediction.originalDelivery}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Predicted Delivery</p>
                      <p className="text-sm font-medium text-danger-600">{prediction.predictedDelivery}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Root Cause</p>
                        <p className="text-sm text-gray-600">{prediction.rootCause}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-success-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Suggested Action</p>
                        <p className="text-sm text-gray-600">{prediction.suggestedAction}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price & Cost Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-success-600" />
            Price & Cost Predictions
          </CardTitle>
          <CardDescription>Market-driven price forecasting and cost analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Price Trend Analysis - Steel Raw Materials</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={priceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#22c55e" name="Actual Price" />
                <Line type="monotone" dataKey="predicted" stroke="#3367d6" strokeDasharray="5 5" name="Predicted Price" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricePredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{prediction.material}</CardTitle>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(prediction.trend)}
                      <span className="text-sm text-gray-500">{prediction.trend}</span>
                    </div>
                  </div>
                  <CardDescription>{prediction.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Predicted</p>
                      <p className="text-lg font-bold text-navy-900">${prediction.predictedPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Historical</p>
                      <p className="text-lg font-bold text-gray-600">${prediction.historicalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Change</span>
                    <span className={`font-semibold ${prediction.priceChange > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                      {prediction.priceChange > 0 ? '+' : ''}{prediction.priceChange}%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Market Influence</p>
                    <p className="text-sm text-gray-700">{prediction.marketInfluence}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">AI Confidence</span>
                    <Badge variant="accent">{prediction.confidence}%</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Key Factors</p>
                    <div className="flex flex-wrap gap-1">
                      {prediction.factors.map((factor, i) => (
                        <Badge key={i} variant="default" className="text-xs">{factor}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-accent-600" />
            Inventory Predictions
          </CardTitle>
          <CardDescription>Stock shortage forecasting and replenishment recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryPredictions.map((prediction) => (
              <Card key={prediction.id} className={prediction.inventoryRisk === 'high' ? 'border-2 border-danger-500' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-navy-900">{prediction.item}</h4>
                      <p className="text-sm text-gray-600">Current: {prediction.currentStock} | Min: {prediction.minStock}</p>
                    </div>
                    {getInventoryRiskBadge(prediction.inventoryRisk)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Days of Stock</p>
                      <p className="text-lg font-bold text-navy-900">{prediction.daysOfStock}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Daily Usage</p>
                      <p className="text-lg font-bold text-navy-900">{prediction.dailyUsage}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Stockout Date</p>
                      <p className="text-sm font-medium text-danger-600">{prediction.estimatedStockoutDate}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Replenishment</p>
                      <p className="text-lg font-bold text-success-600">{prediction.recommendedReplenishment}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Stock Level</span>
                      <span className="text-sm font-medium">{prediction.currentStock} / {prediction.minStock}</span>
                    </div>
                    <Progress 
                      value={(prediction.currentStock / prediction.minStock) * 100} 
                      variant={prediction.inventoryRisk === 'high' ? 'danger' : prediction.inventoryRisk === 'medium' ? 'warning' : 'success'} 
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-accent-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Recommended Action</p>
                      <p className="text-sm text-gray-600">{prediction.suggestedAction}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Performance Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            Supplier Performance Predictions
          </CardTitle>
          <CardDescription>AI-powered supplier score forecasting and performance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supplierPredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{prediction.supplier}</CardTitle>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(prediction.trend)}
                      <span className="text-sm text-gray-500">{prediction.trend}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Predicted Score</p>
                      <p className="text-2xl font-bold text-accent-600">{prediction.predictedScore}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Current Score</p>
                      <p className="text-2xl font-bold text-gray-600">{prediction.currentScore}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Delivery Performance</p>
                      <p className="text-lg font-bold text-navy-900">{prediction.expectedDeliveryPerformance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quality Performance</p>
                      <p className="text-lg font-bold text-navy-900">{prediction.expectedQualityPerformance}%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">AI Confidence</span>
                    <Badge variant="accent">{prediction.confidence}%</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Performance Factors</p>
                    <div className="space-y-1">
                      {prediction.factors.map((factor, i) => (
                        <p key={i} className="text-sm text-gray-700">• {factor}</p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIPredictions
