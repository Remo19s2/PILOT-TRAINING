import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts'

const RiskTrendChart = ({ deliveryData, riskTrendData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Delivery Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historical Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deliveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" fill="#10b981" name="On-Time" />
              <Bar dataKey="delayed" fill="#ef4444" name="Delayed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supplier Risk Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="deliveryRisk" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Delivery Risk"
              />
              <Line 
                type="monotone" 
                dataKey="qualityRisk" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Quality Risk"
              />
              <Line 
                type="monotone" 
                dataKey="capacityRisk" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Capacity Risk"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default RiskTrendChart
