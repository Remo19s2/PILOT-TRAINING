import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Bot, 
  Brain, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Users, 
  DollarSign, 
  FileText, 
  Activity, 
  Sparkles, 
  Lock, 
  ChevronRight, 
  BarChart3, 
  Clock, 
  ShieldAlert,
  Check,
  ChevronDown
} from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const [activeSimulationTab, setActiveSimulationTab] = useState('negotiation')
  const [activeFaq, setActiveFaq] = useState(null)

  const rolePortals = [
    {
      id: 'procurement_manager',
      roleTitle: 'Procurement Manager',
      badge: 'Autonomous Command',
      badgeColor: 'bg-primary-50 text-primary-700 border-primary-200',
      description: 'Orchestrate inventory shortages, broadcast RFQs to qualified vendors, leverage AI comparison matrices, and trigger automated multi-round negotiations.',
      icon: Layers,
      iconBg: 'bg-primary-500/10 text-primary-600',
      highlights: [
        'Automated Shortage & MRP Ingestion',
        'AI Multi-Supplier Recommendation',
        'One-Click RFQ Multi-Cast',
        'Autonomous Negotiation Center'
      ]
    },
    {
      id: 'supplier',
      roleTitle: 'Supplier Portal',
      badge: 'Vendor Interface',
      badgeColor: 'bg-accent-50 text-accent-700 border-accent-200',
      description: 'Streamlined inbound RFQ inbox, smart quotation submission forms, real-time counter-offer negotiations, and transparent PO fulfillment tracking.',
      icon: Users,
      iconBg: 'bg-accent-500/10 text-accent-600',
      highlights: [
        'Real-time RFQ Notification & Review',
        'Dynamic Tiered Quotation Submission',
        'Live Counter-Offer Responses',
        'Instant Purchase Order Receipt'
      ]
    },
    {
      id: 'finance_approver',
      roleTitle: 'Finance & Executive Approver',
      badge: 'Governance & Audit',
      badgeColor: 'bg-success-50 text-success-700 border-success-200',
      description: 'Comprehensive financial oversight, automatic budget headroom validation, supplier risk scorecard verification, and one-click purchase authorization.',
      icon: DollarSign,
      iconBg: 'bg-success-500/10 text-success-600',
      highlights: [
        'Budget Variance & Cap Validation',
        'Multi-Vector Risk Exposure Scorecard',
        'One-Click Decision Approvals',
        'Immutable Audit Trail'
      ]
    }
  ]

  const workflowSteps = [
    {
      step: '01',
      title: 'Shortage & Demand Sense',
      desc: 'Autonomous monitoring of inventory thresholds triggers automatic procurement recommendations.',
      badge: 'Planning Agent'
    },
    {
      step: '02',
      title: 'Multi-Vendor RFQ Dispatch',
      desc: 'System compiles technical specs, delivery deadlines, and broadcasts structured RFQs to pre-vetted suppliers.',
      badge: 'Sourcing Agent'
    },
    {
      step: '03',
      title: 'Quotation Ingestion',
      desc: 'Suppliers submit unit pricing, delivery schedules, and warranty terms directly into the portal.',
      badge: 'Supplier Portal'
    },
    {
      step: '04',
      title: 'AI Multi-Param Negotiation',
      desc: 'Calibrated negotiation agent exchanges counter-offers on price and delivery to maximize savings.',
      badge: 'Negotiation Agent'
    },
    {
      step: '05',
      title: 'Risk Matrix & Decisioning',
      desc: 'Predictive risk modeling analyzes delivery reliability, financial stability, and quality metrics.',
      badge: 'Risk Engine'
    },
    {
      step: '06',
      title: 'Finance Clearance & PO',
      desc: 'Executive approvals route based on budget caps with automated generation of official Purchase Orders.',
      badge: 'Finance Gate'
    }
  ]

  const faqs = [
    {
      q: 'How does the Autonomous Negotiation Agent work?',
      a: 'The PRISM Negotiation Agent uses calibrated game-theoretic and heuristics models to evaluate supplier counter-offers against target budget, delivery urgency, and historical benchmarks. It submits mathematically optimized counter-offers while adhering to strict governance bounds.'
    },
    {
      q: 'Can human procurement officers intervene in decisions?',
      a: 'Yes! PRISM is designed with Human-in-the-Loop (HITL) architecture. Officers can adjust parameters, override recommendations, or manually take over any active supplier negotiation with a single click.'
    },
    {
      q: 'How is supplier risk computed?',
      a: 'Risk is evaluated in real-time across four pillars: Historical Delivery Adherence, Component Quality & Defect Ratios, Capacity Headroom, and Financial Stability. Each factor contributes to a normalized 0-100 risk score.'
    },
    {
      q: 'How do I access the platform dashboards?',
      a: 'Click the "Get Started" or "Sign In" button to open the sign-in page and select your persona to enter the workspace.'
    }
  ]

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900 font-sans antialiased selection:bg-primary-500 selection:text-white">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-navy-900 via-primary-950 to-navy-900 text-white text-xs py-2 px-4 text-center border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">PRISM Autonomous Agent Engine v2.4 Active:</span>
          <span className="text-primary-300">Live Multi-Vendor Sourcing & Risk Intelligence Cockpit</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-navy-900 flex items-center justify-center text-white shadow-md shadow-primary-600/20">
              <Sparkles className="w-5 h-5 text-primary-200" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-navy-950 flex items-center gap-1.5">
                PRISM
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 border border-primary-200">
                  AI Cockpit
                </span>
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block">Autonomous Procurement & Risk Intelligence</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Capabilities</a>
            <a href="#simulation" className="hover:text-primary-600 transition-colors">Agent Simulation</a>
            <a href="#roles" className="hover:text-primary-600 transition-colors">Role Portals</a>
            <a href="#workflow" className="hover:text-primary-600 transition-colors">Workflow</a>
            <a href="#architecture" className="hover:text-primary-600 transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-navy-50 bg-grid-slate border-b border-slate-200/80">
        {/* Glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary-400/20 via-accent-400/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200/80 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <Bot className="w-4 h-4 text-primary-600 animate-pulse" />
              <span>Next-Generation Autonomous Supply Chain Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight leading-[1.15] mb-6">
              Intelligent Sourcing.{' '}
              <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent">
                Autonomous Negotiation.
              </span>{' '}
              Zero Disruption.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              PRISM unifies autonomous agentic RFQ generation, predictive supplier risk modeling, real-time counter-offer negotiations, and multi-tier executive approvals into one synchronized enterprise platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 transition-all active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#roles"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-navy-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <span>Explore Role Portals</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </a>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/80">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl font-black text-primary-600">85%</div>
                <div className="text-xs font-semibold text-slate-600 mt-1">Faster Sourcing Cycle</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">14.8%</div>
                <div className="text-xs font-semibold text-slate-600 mt-1">Direct Cost Reduction</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl font-black text-accent-600">99.4%</div>
                <div className="text-xs font-semibold text-slate-600 mt-1">Risk Disruption Avoidance</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl font-black text-navy-900">100%</div>
                <div className="text-xs font-semibold text-slate-600 mt-1">Audit-Ready Compliance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Agent Simulation Center */}
      <section id="simulation" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Live Agent Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 mt-3 tracking-tight">
              Watch PRISM Agents Execute in Real Time
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Autonomous agents collaborate across planning, multi-vendor negotiation, and predictive risk assessment.
            </p>
          </div>

          {/* Interactive Agent Tabs */}
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-6 p-1.5 bg-slate-100 rounded-xl max-w-fit mx-auto border border-slate-200">
              <button
                onClick={() => setActiveSimulationTab('negotiation')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeSimulationTab === 'negotiation'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Bot className="w-4 h-4 text-primary-600" />
                <span>Negotiation Agent</span>
              </button>
              <button
                onClick={() => setActiveSimulationTab('risk')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeSimulationTab === 'risk'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-accent-600" />
                <span>Risk & Scoring Engine</span>
              </button>
              <button
                onClick={() => setActiveSimulationTab('planning')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeSimulationTab === 'planning'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Inventory & Shortage Sensing</span>
              </button>
            </div>

            {/* Simulation Preview Card */}
            <div className="bg-navy-950 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-navy-800 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">agent_runtime_session: active</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Realtime Engine Active
                </span>
              </div>

              {activeSimulationTab === 'negotiation' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-800">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>SUPPLIER OFFER (TechCorp)</span>
                        <span>Unit: ECU-990</span>
                      </div>
                      <div className="text-lg font-bold text-white flex items-center justify-between">
                        <span>Original Quote: $105.00</span>
                        <span className="text-xs text-slate-400">Lead: 14 Days</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary-950/60 border border-primary-800/80 relative">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary-300 mb-1">
                        <Bot className="w-4 h-4 text-primary-400" />
                        <span>AGENT COUNTER-OFFER DISPATCHED</span>
                      </div>
                      <p className="text-sm text-slate-200">
                        "Evaluating quantity tier 10,000 units. Proposed price <span className="text-primary-300 font-bold">$96.00/unit</span> with 12-day SLA delivery warranty."
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>DEAL FINALIZED & AGREED</span>
                      </div>
                      <div className="text-sm font-semibold text-emerald-100 flex items-center justify-between">
                        <span>Settled at: $96.00 / unit (-8.5% savings)</span>
                        <span className="text-xs text-emerald-300">Total Saved: $90,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-navy-900 p-5 rounded-xl border border-navy-800 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Agent Decision Parameters</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-navy-800">
                        <span className="text-slate-400">Max Budget Threshold</span>
                        <span className="text-white font-mono">$110.00</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-navy-800">
                        <span className="text-slate-400">Target Concession Ratio</span>
                        <span className="text-emerald-400 font-mono">8.5%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-navy-800">
                        <span className="text-slate-400">Relationship Retention Score</span>
                        <span className="text-primary-400 font-mono">98/100</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Autonomous Rounds</span>
                        <span className="text-white font-mono">2 Iterations</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSimulationTab === 'risk' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300">AutoParts Premium (Germany)</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Risk: 18 (Low)</span>
                      </div>
                      <div className="w-full bg-navy-950 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full w-[18%]" />
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Delivery reliability: 95% | Quality Score: 94% | High capacity stability.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300">IndustrialX Manufacturing (China)</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">Risk: 78 (High)</span>
                      </div>
                      <div className="w-full bg-navy-950 rounded-full h-2">
                        <div className="bg-rose-500 h-2 rounded-full w-[78%]" />
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Delivery delays recorded on 4 recent shipments. Secondary supplier backup advised.</p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-navy-900 p-5 rounded-xl border border-navy-800">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">AI Recommendation Output</h4>
                    <div className="p-3 bg-primary-950/40 rounded-lg border border-primary-800 text-xs text-primary-200">
                      💡 <strong>Optimal Allocation:</strong> Award 70% primary allocation to AutoParts Premium to secure line continuity; split remaining 30% to IndustrialX with strict milestone penalties.
                    </div>
                  </div>
                </div>
              )}

              {activeSimulationTab === 'planning' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60">
                      <div className="flex justify-between items-center text-rose-300 text-xs font-bold">
                        <span>CRITICAL SHORTAGE DETECTED</span>
                        <span>MRP Trigger</span>
                      </div>
                      <div className="text-base font-bold text-white mt-1">Component: Electronic Control Unit (ECU)</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Current Stock: 3,000 | Required: 10,000 | <strong>Shortage: 7,000 units</strong>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 text-xs text-slate-300">
                      <span className="text-primary-400 font-bold">Autonomous Action Taken:</span> Drafted RFQ-001 targeting 3 pre-qualified electronics vendors with 12-day delivery milestone.
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-navy-900 p-5 rounded-xl border border-navy-800 space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Inventory Status</h4>
                    <div className="text-xs flex justify-between py-1 border-b border-navy-800">
                      <span className="text-slate-400">Production Deadline</span>
                      <span className="text-white">Feb 15 (Critical)</span>
                    </div>
                    <div className="text-xs flex justify-between py-1">
                      <span className="text-slate-400">Auto-RFQ Broadcast</span>
                      <span className="text-emerald-400">Executed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Role Portals Section */}
      <section id="roles" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Role Workspaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 mt-3 tracking-tight">
              Designed for Buyers, Suppliers, and Finance
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Explore how PRISM connects buyers, suppliers, and financial executives into one unified workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rolePortals.map((role) => {
              const IconComp = role.icon

              return (
                <div
                  key={role.id}
                  className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.iconBg}`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${role.badgeColor}`}>
                        {role.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-navy-950 mb-2">
                      {role.roleTitle}
                    </h3>

                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      {role.description}
                    </p>

                    <div className="space-y-2.5 mb-8 border-t border-slate-100 pt-5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Key Capabilities
                      </div>
                      {role.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                          <Check className="w-3.5 h-3.5 text-primary-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-primary-600 transition-colors shadow-sm active:scale-[0.99]"
                    >
                      <span>Sign In to {role.roleTitle.split(' ')[0]} Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Pipeline */}
      <section id="workflow" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Autonomous Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 mt-3 tracking-tight">
              From Stock Shortage to Approved Purchase Order
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              A synchronized 6-phase autonomous procurement pipeline designed for speed and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-primary-300 transition-colors relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-primary-600 font-mono">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-navy-800 border border-slate-200">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-base font-bold text-navy-950 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Platform Features */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Enterprise Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 mt-3 tracking-tight">
              Engineered for Mission-Critical Supply Chains
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Game-Theoretic Negotiations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates maximum supplier concessions without risking deal abandonment. Dynamically evaluates volume tiers and lead-time concessions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Predictive Risk Modeling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aggregates real-time delivery telemetry, quality variance logs, and financial stability indices into actionable 0-100 risk scorecards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Audit-Grade Financial Governance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated budget threshold checks, strict approval workflows, and immutable decision logs ready for internal and external audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Compliance */}
      <section id="architecture" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy-900 via-navy-950 to-primary-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-navy-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-primary-400 bg-primary-950/60 px-3 py-1 rounded-md border border-primary-800">
                  Security & Architecture
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-4 mb-4 tracking-tight">
                  High-Availability AI Agent Architecture
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  PRISM operates on an event-driven microservices core with isolated database instances, encrypted communications, and sub-100ms real-time synchronization between buyers and suppliers.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Role-Based Access Control (RBAC) with fine-grained scopes</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>FastAPI backend with SQLite/PostgreSQL persistent state engine</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>WebSocket & SSE for live counter-offer synchronization</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Extensible ERP connectors (SAP, Oracle, NetSuite)</span>
                  </div>
                </div>
              </div>

              <div className="bg-navy-900/90 rounded-2xl p-6 border border-navy-700/80 space-y-4">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <span className="text-xs font-mono text-slate-300">SYSTEM ARCHITECTURE SPEC</span>
                  <span className="text-xs text-emerald-400 font-bold">ALL SERVICES HEALTHY</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-navy-950 rounded-lg border border-navy-800">
                    <div className="text-slate-400">Agent Framework</div>
                    <div className="font-bold text-white mt-1">ProcurAgent AI Core</div>
                  </div>
                  <div className="p-3 bg-navy-950 rounded-lg border border-navy-800">
                    <div className="text-slate-400">Frontend Stack</div>
                    <div className="font-bold text-white mt-1">React 18 + TailwindCSS</div>
                  </div>
                  <div className="p-3 bg-navy-950 rounded-lg border border-navy-800">
                    <div className="text-slate-400">State Engine</div>
                    <div className="font-bold text-white mt-1">Reactive Workflow Hub</div>
                  </div>
                  <div className="p-3 bg-navy-950 rounded-lg border border-navy-800">
                    <div className="text-slate-400">Encryption</div>
                    <div className="font-bold text-white mt-1">AES-256 / TLS 1.3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-black text-navy-950 mt-3 tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-navy-950 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-primary-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-700 via-primary-600 to-accent-700 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
            Ready to Accelerate Your Procurement Intelligence?
          </h2>
          <p className="text-base sm:text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Experience how autonomous AI agents eliminate stock shortages, cut sourcing cycle times, and unlock direct cost savings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-navy-950 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 text-primary-600" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary-800/60 hover:bg-primary-800/90 border border-primary-400/40 rounded-xl transition-all"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-slate-400 text-xs py-12 border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-sm">
              P
            </div>
            <div>
              <span className="text-sm font-bold text-white">PRISM</span>
              <p className="text-[11px] text-slate-500">Procurement Intelligence & Supplier Risk Management</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              All Agent Services Operational
            </span>
            <span>•</span>
            <span>Version 2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
