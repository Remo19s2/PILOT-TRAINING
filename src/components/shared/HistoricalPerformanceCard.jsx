import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Truck, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { Progress } from '../ui/Progress'

const HistoricalPerformanceCard = ({ performance }) => {
  const {
    totalOrders = 0,
    onTimeDeliveries = 0,
    delayedDeliveries = 0,
    averageDelayDays = 0,
    onTimePercentage = 0
  } = performance

  const onTimeProgress = Math.min(onTimePercentage, 100)
  const delayedProgress = Math.min(100 - onTimePercentage, 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Delivery History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">On-Time Deliveries</p>
            <p className="text-2xl font-bold text-green-600">{onTimeDeliveries}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Delayed Deliveries</p>
            <p className="text-2xl font-bold text-red-600">{delayedDeliveries}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Average Delay</p>
            <p className="text-2xl font-bold text-orange-600">{averageDelayDays} Days</p>
          </div>
        </div>

        {/* On-Time Performance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              On-Time Performance
            </span>
            <span className="font-semibold">{onTimePercentage}%</span>
          </div>
          <div className="space-y-1">
            <Progress value={onTimeProgress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{onTimeDeliveries} on-time</span>
              <span>{delayedDeliveries} delayed</span>
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="pt-3 border-t">
          <div className={`
            flex items-center gap-2 p-3 rounded-lg
            ${onTimePercentage >= 80 ? 'bg-green-50 text-green-800' : 
              onTimePercentage >= 60 ? 'bg-yellow-50 text-yellow-800' : 
              'bg-red-50 text-red-800'}
          `}>
            {onTimePercentage >= 80 ? (
              <CheckCircle className="w-5 h-5" />
            ) : onTimePercentage >= 60 ? (
              <Clock className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {onTimePercentage >= 80 ? 'Excellent Performance' :
               onTimePercentage >= 60 ? 'Moderate Performance' :
               'Poor Performance - Requires Attention'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HistoricalPerformanceCard
