import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useWorkflow } from '../context/WorkflowContext'
import { User, Building, DollarSign, Lock, ArrowLeft, Sparkles, Shield } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useWorkflow()
  const [selectedRole, setSelectedRole] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = [
    {
      id: 'procurement_manager',
      name: 'Procurement Manager',
      icon: User,
      description: 'Manage inventory shortages, RFQs, AI comparisons, and automated negotiations',
      color: 'bg-primary-600 text-white',
      accentBorder: 'border-primary-500',
      badge: 'Buyer',
      redirect: '/procurement-dashboard'
    },
    {
      id: 'supplier',
      name: 'Supplier Partner',
      icon: Building,
      description: 'Review inbound RFQs, submit competitive quotations, and negotiate terms',
      color: 'bg-accent-600 text-white',
      accentBorder: 'border-accent-500',
      badge: 'Vendor',
      redirect: '/supplier-dashboard'
    },
    {
      id: 'finance_approver',
      name: 'Finance Approver',
      icon: DollarSign,
      description: 'Examine budget compliance, review risk scorecards, and authorize POs',
      color: 'bg-emerald-600 text-white',
      accentBorder: 'border-emerald-500',
      badge: 'Executive',
      redirect: '/finance-dashboard'
    },
  ]

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    // DO NOT autofill username or password - leave blank for user entry
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRole) {
      alert('Please select a role')
      return
    }
    if (!username || !password) {
      alert('Please enter username and password')
      return
    }
    setLoading(true)
    try {
      await login(username, password)
      navigate(selectedRole.redirect)
    } catch (error) {
      alert(error.message || 'Unable to sign in. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-dark">
      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-600/15 blur-3xl pointer-events-none" />

      {/* Top Bar Back Link */}
      <div className="max-w-4xl mx-auto w-full px-4 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4">
        <Card className="shadow-2xl border-slate-700/60 bg-white/95 backdrop-blur-xl">
          <CardHeader className="text-center pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-navy-900 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-primary-600/25">
              <Sparkles className="w-6 h-6 text-primary-200" />
            </div>
            <CardTitle className="text-3xl font-black text-navy-950 tracking-tight">PRISM</CardTitle>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Procurement Intelligence & Autonomous Risk Management
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 text-center">
                Select Your Persona
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const isSelected = selectedRole?.id === role.id
                  const IconComp = role.icon

                  return (
                    <div
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                        isSelected
                          ? `${role.accentBorder} bg-primary-50/40 shadow-sm ring-2 ring-primary-500/20`
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center shadow-sm`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                            {role.badge}
                          </span>
                        </div>

                        <h4 className="font-bold text-navy-950 text-sm">{role.name}</h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{role.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedRole && (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-2 border-t border-slate-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 text-sm"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 text-sm"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full py-2.5 text-sm font-bold">
                    {loading ? 'Authenticating...' : `Sign In as ${selectedRole.name}`}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-slate-100">
              <div className="text-center text-xs text-slate-500">
                <p className="font-bold text-navy-900 mb-2">Available Demo Accounts:</p>
                <div className="flex flex-wrap justify-center gap-3 text-[11px]">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    <strong>Procurement:</strong> procurement / procurement123
                  </span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    <strong>Supplier:</strong> supplier / supplier123
                  </span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    <strong>Finance:</strong> finance / finance123
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Enterprise SOC2 Type II Certified • Encrypted Session</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
