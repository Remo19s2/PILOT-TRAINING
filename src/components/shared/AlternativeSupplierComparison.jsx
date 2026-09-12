import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import RiskBadge from './RiskBadge'

const AlternativeSupplierComparison = ({ suppliers, onViewDetails, onViewRiskAnalysis, onSelectSupplier }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alternative Supplier Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery Time</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk Level</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk Score</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.map((supplier, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{supplier.name}</td>
                  <td className="px-4 py-4 text-sm text-center">₹{supplier.price.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-center">{supplier.deliveryTime} Days</td>
                  <td className="px-4 py-4 text-sm text-center">
                    <RiskBadge level={supplier.riskLevel} size="sm" />
                  </td>
                  <td className="px-4 py-4 text-sm text-center font-semibold">{supplier.riskScore}</td>
                  <td className="px-4 py-4 text-sm text-center">
                    <div className="flex gap-2 justify-center">
                      {onViewDetails && (
                        <Button variant="ghost" size="sm" onClick={() => onViewDetails(supplier.id)}>
                          Details
                        </Button>
                      )}
                      {onViewRiskAnalysis && (
                        <Button variant="ghost" size="sm" onClick={() => onViewRiskAnalysis(supplier.id)}>
                          Risk Analysis
                        </Button>
                      )}
                      {onSelectSupplier && (
                        <Button variant="primary" size="sm" onClick={() => onSelectSupplier(supplier.id)}>
                          Select
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default AlternativeSupplierComparison
