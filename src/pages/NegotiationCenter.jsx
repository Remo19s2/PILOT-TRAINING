import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Progress } from '../components/ui/Progress'
import { Send, MessageSquare, Clock, CheckCircle, AlertTriangle, TrendingUp, Brain, DollarSign, Target, FileText, Plus, MoreVertical, ArrowRight, Sparkles, Edit, X, Lightbulb } from 'lucide-react'

const NegotiationCenter = () => {
  const [selectedNegotiation, setSelectedNegotiation] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [customCounteroffer, setCustomCounteroffer] = useState('')
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [editingMessage, setEditingMessage] = useState(false)

  const negotiations = [
    {
      id: 'NEG-001',
      rfqId: 'RFQ-2024-001',
      supplier: 'TechCorp Industries',
      subject: 'Electronic Control Unit - Price Negotiation',
      status: 'active',
      lastMessage: '2 hours ago',
      
      // Pricing Details
      currentQuote: 100,
      unit: 'per unit',
      historicalPrice: 94,
      targetPrice: 96,
      aiSuggestedCounteroffer: 97,
      
      // AI Negotiation Strategy
      aiNegotiationStrategy: 'Request a volume-based discount while maintaining the required delivery timeline. Leverage the 12-month contract commitment to secure better pricing.',
      
      messages: [
        { id: 1, sender: 'supplier', content: 'Thank you for the RFQ. Our quoted price is ₹100/unit for the Electronic Control Units with standard delivery timeline.', timestamp: '2024-01-10 09:30' },
        { id: 2, sender: 'procurement', content: 'We appreciate your response. Our target price is ₹96/unit based on our budget constraints and market analysis.', timestamp: '2024-01-10 10:15' },
        { id: 3, sender: 'supplier', content: 'We understand your position. Our pricing reflects the premium quality and certifications we provide. Can we discuss volume?', timestamp: '2024-01-10 14:00' },
      ],
      
      // Negotiation Timeline
      timeline: [
        { stage: 'RFQ Sent', status: 'completed', date: '2024-01-09' },
        { stage: 'Supplier Quote Received', status: 'completed', date: '2024-01-10' },
        { stage: 'AI Analysis', status: 'completed', date: '2024-01-10' },
        { stage: 'Counteroffer Sent', status: 'in_progress', date: '2024-01-10' },
        { stage: 'Supplier Response', status: 'pending', date: '-' },
        { stage: 'Final Agreement', status: 'pending', date: '-' },
      ],
      
      aiSuggestions: [
        { type: 'strategy', title: 'AI Negotiation Strategy', content: 'Request a volume-based discount while maintaining the required delivery timeline. Leverage the 12-month contract commitment to secure better pricing.', confidence: 92 },
        { type: 'message', title: 'AI Generated Message', content: 'Thank you for your response. Given our requirement of 10,000 units and a 12-month commitment, we believe ₹97/unit is a fair price that reflects both quality and market conditions. This would secure a long-term partnership.', confidence: 88 },
      ],
    },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      in_progress: 'primary',
      pending: 'default',
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getOverallStatusBadge = (status) => {
    const variants = {
      active: 'primary',
      completed: 'success',
      pending: 'default',
    }
    const labels = {
      active: 'Active',
      completed: 'Completed',
      pending: 'Pending',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedNegotiation) {
      setIsSending(true)
      setTimeout(() => {
        const newMessage = {
          id: selectedNegotiation.messages.length + 1,
          sender: 'procurement',
          content: messageInput,
          timestamp: new Date().toLocaleString(),
        }
        setSelectedNegotiation({
          ...selectedNegotiation,
          messages: [...selectedNegotiation.messages, newMessage],
        })
        setMessageInput('')
        setEditingMessage(false)
        setIsSending(false)
        alert('Message sent successfully!')
      }, 500)
    }
  }

  const handleAcceptAISuggestion = (suggestion) => {
    setMessageInput(suggestion.content)
    setEditingMessage(true)
    setShowAISuggestions(false)
  }

  const handleSendCustomCounteroffer = () => {
    if (customCounteroffer.trim() && selectedNegotiation) {
      setIsSending(true)
      setTimeout(() => {
        const newMessage = {
          id: selectedNegotiation.messages.length + 1,
          sender: 'procurement',
          content: `We would like to propose a counteroffer of ₹${customCounteroffer}/unit based on our analysis and market conditions.`,
          timestamp: new Date().toLocaleString(),
        }
        setSelectedNegotiation({
          ...selectedNegotiation,
          messages: [...selectedNegotiation.messages, newMessage],
        })
        setCustomCounteroffer('')
        setIsSending(false)
        alert('Counteroffer sent successfully!')
      }, 500)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Negotiation Center</h1>
          <p className="text-gray-600 mt-1">Negotiation Agent - AI-assisted supplier negotiations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Start Negotiation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Negotiations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Active Negotiations</CardTitle>
              <CardDescription>{negotiations.length} conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {negotiations.map((negotiation) => (
                <Card 
                  key={negotiation.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedNegotiation?.id === negotiation.id ? 'border-2 border-primary-500' : ''}`}
                  onClick={() => setSelectedNegotiation(negotiation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-navy-900">{negotiation.supplier}</h4>
                      {getOverallStatusBadge(negotiation.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{negotiation.subject}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{negotiation.lastMessage}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Negotiation Workspace */}
        <div className="lg:col-span-2">
          {selectedNegotiation ? (
            <div className="space-y-4">
              {/* Supplier Details */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedNegotiation.supplier}</CardTitle>
                  <CardDescription>{selectedNegotiation.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Current Quote</p>
                      <p className="text-lg font-bold text-navy-900">₹{selectedNegotiation.currentQuote}/{selectedNegotiation.unit}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Historical Price</p>
                      <p className="text-lg font-bold text-navy-900">₹{selectedNegotiation.historicalPrice}/{selectedNegotiation.unit}</p>
                    </div>
                    <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                      <p className="text-xs text-primary-600">Target Price</p>
                      <p className="text-lg font-bold text-primary-600">₹{selectedNegotiation.targetPrice}/{selectedNegotiation.unit}</p>
                    </div>
                    <div className="p-3 bg-accent-50 rounded-lg border border-accent-200">
                      <p className="text-xs text-accent-600">AI Suggested Counteroffer</p>
                      <p className="text-lg font-bold text-accent-600">₹{selectedNegotiation.aiSuggestedCounteroffer}/{selectedNegotiation.unit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Negotiation Strategy */}
              <Card className="border-2 border-accent-500 bg-accent-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-900">
                    <Brain className="w-5 h-5 text-accent-600" />
                    AI Negotiation Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-accent-800">{selectedNegotiation.aiNegotiationStrategy}</p>
                </CardContent>
              </Card>

              {/* AI Generated Message Panel */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-accent-600" />
                      AI Generated Message
                    </CardTitle>
                    <Button variant="secondary" size="sm" onClick={() => setShowAISuggestions(!showAISuggestions)}>
                      {showAISuggestions ? 'Hide' : 'Show'} Suggestions
                    </Button>
                  </div>
                </CardHeader>
                {showAISuggestions && selectedNegotiation.aiSuggestions.length > 0 && (
                  <CardContent className="space-y-3">
                    {selectedNegotiation.aiSuggestions.map((suggestion, index) => (
                      <Card key={index} className="border-2 border-accent-200 bg-accent-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-accent-900">{suggestion.title}</h4>
                            <Badge variant="accent">{suggestion.confidence}% confidence</Badge>
                          </div>
                          <p className="text-sm text-accent-800 mb-3">{suggestion.content}</p>
                          <div className="flex gap-2">
                            <Button variant="accent" size="sm" onClick={() => handleAcceptAISuggestion(suggestion)}>
                              <Sparkles className="w-4 h-4 mr-1" />
                              Accept AI Suggestion
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setMessageInput(suggestion.content)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                )}
              </Card>

              {/* Message Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Message Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                      placeholder="Type your message to the supplier..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSendMessage} disabled={isSending} className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      {isSending ? 'Sending...' : 'Send Message'}
                    </Button>
                    {editingMessage && (
                      <Button variant="secondary" onClick={() => setEditingMessage(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Counteroffer */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Custom Counteroffer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Counteroffer Price (₹/unit)</label>
                      <Input
                        type="number"
                        placeholder="Enter counteroffer price"
                        value={customCounteroffer}
                        onChange={(e) => setCustomCounteroffer(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSendCustomCounteroffer} disabled={isSending} className="mt-6">
                      <Send className="w-4 h-4 mr-2" />
                      {isSending ? 'Sending...' : 'Send Counteroffer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Negotiation Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Negotiation Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedNegotiation.timeline.map((stage, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          stage.status === 'completed' ? 'bg-success-100 text-success-600' :
                          stage.status === 'in_progress' ? 'bg-primary-100 text-primary-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {stage.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                           stage.status === 'in_progress' ? <Clock className="w-4 h-4" /> :
                           <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-navy-900">{stage.stage}</p>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(stage.status)}
                              <span className="text-sm text-gray-500">{stage.date}</span>
                            </div>
                          </div>
                        </div>
                        {index < selectedNegotiation.timeline.length - 1 && (
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conversation History */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {selectedNegotiation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'procurement' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender === 'procurement'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Negotiation</h3>
                <p className="text-gray-600">Choose a conversation from the list to view details and continue negotiation</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default NegotiationCenter
