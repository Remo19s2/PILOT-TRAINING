import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useWorkflow } from '../context/WorkflowContext'
import { User, Building, DollarSign, Lock } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login, mockUsers } = useWorkflow()
  const [selectedRole, setSelectedRole] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const roles = [
    {
      id: 'procurement_manager',
      name: 'Procurement Manager',
      icon: User,
      description: 'Manage procurement requirements, RFQs, and supplier selection',
      color: 'bg-primary-500',
      credentials: { username: 'procurement', password: 'procurement123' }
    },
    {
      id: 'supplier',
      name: 'Supplier',
      icon: Building,
      description: 'View RFQs and submit quotations',
      color: 'bg-accent-500',
      credentials: { username: 'supplier', password: 'supplier123' }
    },
    {
      id: 'finance_approver',
      name: 'Finance Approver',
      icon: DollarSign,
      description: 'Review and approve procurement requests',
      color: 'bg-success-500',
      credentials: { username: 'finance', password: 'finance123' }
    },
  ]

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setUsername(role.credentials.username)
    setPassword(role.credentials.password)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    
    if (!selectedRole) {
      alert('Please select a role')
      return
    }

    if (!username || !password) {
      alert('Please enter username and password')
      return
    }

    // Validate credentials against mock users
    const validUser = mockUsers.find(
      user => user.username === username && user.password === password && user.role === selectedRole.id
    )

    if (!validUser) {
      alert('Invalid credentials for the selected role')
      return
    }

    login(validUser)

    // Redirect based on role
    switch (selectedRole.id) {
      case 'procurement_manager':
        navigate('/procurement-dashboard')
        break
      case 'supplier':
        navigate('/supplier-dashboard')
        break
      case 'finance_approver':
        navigate('/finance-dashboard')
        break
      default:
        navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-navy-900">PRISM</CardTitle>
          <p className="text-gray-600 mt-2">Procurement Intelligence & Supplier Risk Management</p>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-navy-900 mb-4 text-center">Select Your Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedRole?.id === role.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-navy-900">{role.name}</h4>
                  <p className="text-xs text-gray-600 mt-2">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedRole && (
            <form onSubmit={handleLogin} className="max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Login as {selectedRole.name}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p><span className="font-medium">Procurement Manager:</span> procurement / procurement123</p>
              <p><span className="font-medium">Supplier:</span> supplier / supplier123</p>
              <p><span className="font-medium">Finance Approver:</span> finance / finance123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
