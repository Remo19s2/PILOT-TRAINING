import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Download, FileText, BarChart3, Calendar, Filter, TrendingUp } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

const ProcurementReports = () => {
  const monthlySpend = [
    { month: 'Jul', spend: 180000, budget: 200000 },
    { month: 'Aug', spend: 220000, budget: 200000 },
    { month: 'Sep', spend: 195000, budget: 200000 },
    { month: 'Oct', spend: 280000, budget: 220000 },
    { month: 'Nov', spend: 245000, budget: 220000 },
    { month: 'Dec', spend: 310000, budget: 250000 },
  ]

  const categoryBreakdown = [
    { name: 'Raw Materials', value: 850000, color: '#3367d6' },
    { name: 'Components', value: 620000, color: '#22c55e' },
    { name: 'Services', value: 450000, color: '#f59e0b' },
    { name: 'Equipment', value: 380000, color: '#8b5cf6' },
    { name: 'Other', value: 150000, color: '#64748b' },
  ]

  const supplierSpend = [
    { name: 'TechCorp', spend: 450000 },
    { name: 'IndustrialX', spend: 380000 },
    { name: 'GlobalSupply', spend: 320000 },
    { name: 'AutoParts', spend: 280000 },
    { name: 'PrimeMfg', spend: 250000 },
  ]

  const savingsTrend = [
    { month: 'Jul', savings: 15000 },
    { month: 'Aug', savings: 22000 },
    { month: 'Sep', savings: 18000 },
    { month: 'Oct', savings: 35000 },
    { month: 'Nov', savings: 28000 },
    { month: 'Dec', savings: 42000 },
  ]

  const recentReports = [
    { 
      id: 1,
      name: 'Q4 2024 Spend Analysis',
      type: 'Spend Report',
      generated: '2024-01-05',
      size: '2.4 MB',
      format: 'PDF'
    },
    { 
      id: 2,
      name: 'Supplier Performance Review',
      type: 'Performance',
      generated: '2024-01-03',
      size: '1.8 MB',
      format: 'PDF'
    },
    { 
      id: 3,
      name: 'Risk Assessment Summary',
      type: 'Risk Report',
      generated: '2024-01-01',
      size: '3.1 MB',
      format: 'PDF'
    },
    { 
      id: 4,
      name: 'Annual Procurement Summary',
      type: 'Annual Report',
      generated: '2023-12-28',
      size: '5.2 MB',
      format: 'PDF'
    },
  ]

  const quickReports = [
    { name: 'Spend by Category', icon: BarChart3, description: 'Analyze spending across categories' },
    { name: 'Supplier Performance', icon: FileText, description: 'Review supplier metrics' },
    { name: 'Budget vs Actual', icon: BarChart3, description: 'Compare budget to actual spend' },
    { name: 'Savings Analysis', icon: TrendingUp, description: 'Track procurement savings' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Procurement Reports</h1>
          <p className="text-gray-600 mt-1">Generate and view procurement analytics</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Spend (YTD)</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">$2.45M</p>
            <p className="text-sm text-success-600 mt-2">+12.5% vs last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Savings</p>
            <p className="text-2xl font-bold text-success-600 mt-1">$160K</p>
            <p className="text-sm text-success-600 mt-2">+8.3% vs target</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Active Contracts</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">45</p>
            <p className="text-sm text-gray-500 mt-2">$8.2M total value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Avg. Lead Time</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">14 days</p>
            <p className="text-sm text-success-600 mt-2">-2 days improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
          <CardDescription>Generate common procurement reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickReports.map((report, index) => (
              <Button key={index} variant="secondary" className="h-auto p-4 flex flex-col items-start gap-2">
                <report.icon className="w-6 h-6 text-primary-600" />
                <span className="font-medium">{report.name}</span>
                <span className="text-xs text-gray-600 text-left">{report.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spend vs Budget</CardTitle>
            <CardDescription>Compare actual spending against budget</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySpend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spend" fill="#3367d6" name="Actual Spend" />
                <Bar dataKey="budget" fill="#e2e8f0" name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>Distribution across procurement categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium ml-auto">${(item.value / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers by Spend</CardTitle>
            <CardDescription>Highest spending suppliers this quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierSpend} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="spend" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Trend</CardTitle>
            <CardDescription>Procurement savings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={savingsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="savings" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </div>
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">{report.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <Badge variant="default">{report.type}</Badge>
                      <span>{report.generated}</span>
                      <span>{report.size}</span>
                      <span>{report.format}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProcurementReports
