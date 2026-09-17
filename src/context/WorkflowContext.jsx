import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as authenticate, logout as clearAuthentication, me } from '../api/auth'
import { getRequirements } from '../api/planning'
import { listSuppliers } from '../api/suppliers'
import { createRfq as createRfqRequest, listRfqs, sendRfq as sendRfqRequest, getRfqResponses, selectSupplier as selectSupplierRequest } from '../api/rfqs'
import { submitQuotation as submitQuotationRequest, listRfqQuotations, reviseQuotation as reviseQuotationRequest } from '../api/quotations'
import { listApprovals, approve as approveRequestApi, reject as rejectRequestApi } from '../api/approvals'
import { getSupplierRisk } from '../api/risk'
import { getDecision } from '../api/decisions'
import { listNegotiations } from '../api/negotiations'
import { listPurchaseOrders } from '../api/purchaseOrders'
import { getWorkflowExecution } from '../api/executions'

// Mock users for authentication
const mockUsers = [
  {
    id: 'PM-001',
    username: 'procurement',
    password: 'procurement123',
    name: 'John Smith',
    role: 'procurement_manager',
    roleName: 'Procurement Manager',
    email: 'john.smith@prism.com'
  },
  {
    id: 'SUP-001',
    username: 'supplier',
    password: 'supplier123',
    name: 'TechCorp Industries',
    role: 'supplier',
    roleName: 'Supplier',
    email: 'contact@techcorp.com'
  },
  {
    id: 'FIN-001',
    username: 'finance',
    password: 'finance123',
    name: 'Sarah Johnson',
    role: 'finance_approver',
    roleName: 'Finance Approver',
    email: 'sarah.johnson@prism.com'
  }
]

// Initial mock data
const initialRequirements = [
  {
    id: 'REQ-001',
    componentName: 'Electronic Control Unit (ECU)',
    componentCategory: 'Electronics',
    requiredQuantity: 10000,
    currentInventory: 3000,
    shortageQuantity: 7000,
    priority: 'critical',
    requiredDeliveryDate: '2024-02-15',
    status: 'new',
    createdAt: '2024-01-12',
  },
  {
    id: 'REQ-002',
    componentName: 'Steel Sheets',
    componentCategory: 'Raw Materials',
    requiredQuantity: 30000,
    currentInventory: 450,
    shortageQuantity: 29550,
    priority: 'critical',
    requiredDeliveryDate: '2024-02-20',
    status: 'new',
    createdAt: '2024-01-12',
  },
  {
    id: 'REQ-003',
    componentName: 'Circuit Board Type B',
    componentCategory: 'Electronics',
    requiredQuantity: 5500,
    currentInventory: 1200,
    shortageQuantity: 4300,
    priority: 'high',
    requiredDeliveryDate: '2024-02-25',
    status: 'new',
    createdAt: '2024-01-12',
  },
  {
    id: 'REQ-004',
    componentName: 'Fasteners',
    componentCategory: 'Hardware',
    requiredQuantity: 50000,
    currentInventory: 35000,
    shortageQuantity: 15000,
    priority: 'medium',
    requiredDeliveryDate: '2024-03-01',
    status: 'new',
    createdAt: '2024-01-12',
  },
]

const initialSuppliers = [
  {
    id: 'SUP-001',
    name: 'TechCorp Industries',
    category: 'Electronics',
    location: 'Taiwan',
    rating: 4.8,
    previousPerformance: 96,
    contact: 'contact@techcorp.com',
    phone: '+886-2-1234-5678',
    riskLevel: 'Low',
    qualityScore: 90,
    overallScore: 88,
    paymentTerms: 'Net 30',
    estimatedPrice: 98,
    deliveryDays: 12,
    capacity: 'High',
    capacityPct: 88,
    deliveryPerformance: 92,
    riskScore: 25,
    recommended: false,
    strengths: ['Consistent on-time delivery', 'High quality components', 'Strong track record'],
    weaknesses: ['Slightly higher price point', 'Limited bulk discounts'],
  },
  {
    id: 'SUP-002',
    name: 'IndustrialX Manufacturing',
    category: 'Raw Materials',
    location: 'China',
    rating: 3.5,
    previousPerformance: 75,
    contact: 'info@industrialx.com',
    phone: '+86-21-8765-4321',
    riskLevel: 'High',
    qualityScore: 78,
    overallScore: 62,
    paymentTerms: 'Net 45',
    estimatedPrice: 82,
    deliveryDays: 16,
    capacity: 'Medium',
    capacityPct: 65,
    deliveryPerformance: 75,
    riskScore: 78,
    recommended: false,
    strengths: ['Competitive pricing', 'Large order capacity'],
    weaknesses: ['High delivery risk', 'Frequent delays', 'Inconsistent quality'],
  },
  {
    id: 'SUP-003',
    name: 'AutoParts Premium',
    category: 'Electronics',
    location: 'Germany',
    rating: 4.9,
    previousPerformance: 95,
    contact: 'sales@autoparts.de',
    phone: '+49-30-9876-5432',
    riskLevel: 'Low',
    qualityScore: 94,
    overallScore: 93,
    paymentTerms: 'Net 30',
    estimatedPrice: 105,
    deliveryDays: 9,
    capacity: 'High',
    capacityPct: 92,
    deliveryPerformance: 95,
    riskScore: 18,
    recommended: true,
    strengths: ['Best delivery performance', 'Premium quality', 'Low risk profile'],
    weaknesses: ['Premium price', 'Minimum order quantity applies'],
  },
  {
    id: 'SUP-004',
    name: 'GlobalSupply Co.',
    category: 'Hardware',
    location: 'India',
    rating: 3.8,
    previousPerformance: 80,
    contact: 'orders@globalsupply.in',
    phone: '+91-22-4567-8901',
    riskLevel: 'Medium',
    qualityScore: 85,
    overallScore: 76,
    paymentTerms: 'Net 15',
    estimatedPrice: 91,
    deliveryDays: 14,
    capacity: 'Medium',
    capacityPct: 70,
    deliveryPerformance: 80,
    riskScore: 52,
    recommended: false,
    strengths: ['Balanced price-quality', 'Good capacity', 'Flexible payment terms'],
    weaknesses: ['Medium risk level', 'Occasional delivery delays'],
  },
]

const initialRFQs = [
  {
    id: 'RFQ-001',
    requirementId: 'REQ-001',
    component: 'Electronic Control Unit (ECU)',
    requirementName: 'Electronic Control Unit (ECU)',
    supplierId: 'SUP-001',
    supplierName: 'TechCorp Industries',
    quantity: 10000,
    requiredQuantity: 10000,
    deliveryDeadline: '2024-02-15',
    requiredDeliveryDate: '2024-02-15',
    expectedBudget: 1500000,
    quotationDeadline: '2024-09-15 17:00',
    selectedSuppliers: ['SUP-001', 'SUP-002', 'SUP-003'],
    suppliersInvited: 3,
    quotationsReceived: 2,
    status: 'sent',
    sentDate: '2024-01-15',
    receivedDate: '2024-01-15',
    openedDate: '2024-01-16',
    quotationReceived: false
  },
  {
    id: 'RFQ-002',
    requirementId: 'REQ-002',
    component: 'Steel Sheets',
    requirementName: 'Steel Sheets',
    supplierId: 'SUP-002',
    supplierName: 'IndustrialX Manufacturing',
    quantity: 30000,
    requiredQuantity: 30000,
    deliveryDeadline: '2024-02-20',
    requiredDeliveryDate: '2024-02-20',
    expectedBudget: 2000000,
    quotationDeadline: '2024-09-20 17:00',
    selectedSuppliers: ['SUP-002', 'SUP-004'],
    suppliersInvited: 2,
    quotationsReceived: 1,
    status: 'received',
    sentDate: '2024-01-16',
    receivedDate: '2024-01-16',
    openedDate: null,
    quotationReceived: false
  }
]

const initialQuotations = [
  {
    id: 'QT-001',
    rfqId: 'RFQ-001',
    requirementId: 'REQ-001',
    requirementName: 'Electronic Control Unit (ECU)',
    supplierId: 'SUP-001',
    supplierName: 'TechCorp Industries',
    unitPrice: 100,
    totalPrice: 1000000,
    deliveryTime: 12,
    paymentTerms: 'Net 30',
    status: 'revised',
    submittedDate: '2024-09-14 14:30',
    submittedTimestamp: '2024-09-14T14:30:00',
    submissionStatus: 'on_time',
    revisionDate: '2024-01-20',
    previousPrice: 105,
    supplierNotes: 'Revised pricing based on volume discount consideration.',
    quotationHistory: [
      {
        version: 1,
        unitPrice: 105,
        totalPrice: 1050000,
        deliveryTime: 12,
        paymentTerms: 'Net 30',
        submittedDate: '2024-01-17',
        changedBy: 'supplier',
        status: 'submitted'
      },
      {
        version: 2,
        unitPrice: 100,
        totalPrice: 1000000,
        deliveryTime: 12,
        paymentTerms: 'Net 30',
        submittedDate: '2024-01-20',
        changedBy: 'supplier',
        status: 'revised'
      }
    ]
  },
  {
    id: 'QT-002',
    rfqId: 'RFQ-001',
    requirementId: 'REQ-001',
    requirementName: 'Electronic Control Unit (ECU)',
    supplierId: 'SUP-002',
    supplierName: 'IndustrialX Manufacturing',
    unitPrice: 95,
    totalPrice: 950000,
    deliveryTime: 14,
    paymentTerms: 'Net 30',
    status: 'submitted',
    submittedDate: '2024-09-15 16:45',
    submittedTimestamp: '2024-09-15T16:45:00',
    submissionStatus: 'on_time',
    supplierNotes: 'Competitive pricing with assured quality.',
    quotationHistory: []
  },
  {
    id: 'QT-003',
    rfqId: 'RFQ-001',
    requirementId: 'REQ-001',
    requirementName: 'Electronic Control Unit (ECU)',
    supplierId: 'SUP-003',
    supplierName: 'AutoParts Premium',
    unitPrice: 110,
    totalPrice: 1100000,
    deliveryTime: 10,
    paymentTerms: 'Net 30',
    status: 'submitted',
    submittedDate: '2024-09-15 18:30',
    submittedTimestamp: '2024-09-15T18:30:00',
    submissionStatus: 'late',
    supplierNotes: 'Late submission due to technical issues.',
    quotationHistory: []
  },
  {
    id: 'QT-004',
    rfqId: 'RFQ-002',
    requirementId: 'REQ-002',
    requirementName: 'Steel Sheets',
    supplierId: 'SUP-002',
    supplierName: 'IndustrialX Manufacturing',
    unitPrice: 50,
    totalPrice: 1500000,
    deliveryTime: 15,
    paymentTerms: 'Net 45',
    status: 'negotiation_sent',
    submittedDate: '2024-09-19 10:00',
    submittedTimestamp: '2024-09-19T10:00:00',
    submissionStatus: 'on_time',
    revisionDate: '2024-01-19',
    previousPrice: 55,
    supplierNotes: 'Offering competitive pricing for long-term partnership.',
    quotationHistory: [
      {
        version: 1,
        unitPrice: 55,
        totalPrice: 1650000,
        deliveryTime: 15,
        paymentTerms: 'Net 45',
        submittedDate: '2024-01-18',
        changedBy: 'supplier',
        status: 'submitted'
      },
      {
        version: 2,
        unitPrice: 50,
        totalPrice: 1500000,
        deliveryTime: 15,
        paymentTerms: 'Net 45',
        submittedDate: '2024-01-19',
        changedBy: 'supplier',
        status: 'revised'
      }
    ]
  },
  {
    id: 'QT-003',
    rfqId: 'RFQ-003',
    requirementId: 'REQ-003',
    requirementName: 'Circuit Board Type B',
    supplierId: 'SUP-003',
    supplierName: 'GlobalTech Solutions',
    unitPrice: 75,
    totalPrice: 412500,
    deliveryTime: 14,
    paymentTerms: 'Net 30',
    status: 'revised',
    submittedDate: '2024-01-19',
    revisionDate: '2024-01-22',
    previousPrice: 80,
    supplierNotes: 'Optimized production process allows for better pricing.',
    quotationHistory: [
      {
        version: 1,
        unitPrice: 80,
        totalPrice: 440000,
        deliveryTime: 14,
        paymentTerms: 'Net 30',
        submittedDate: '2024-01-19',
        changedBy: 'supplier',
        status: 'submitted'
      },
      {
        version: 2,
        unitPrice: 75,
        totalPrice: 412500,
        deliveryTime: 14,
        paymentTerms: 'Net 30',
        submittedDate: '2024-01-22',
        changedBy: 'supplier',
        status: 'revised'
      }
    ]
  },
  {
    id: 'QT-004',
    rfqId: 'RFQ-004',
    requirementId: 'REQ-004',
    requirementName: 'Fasteners',
    supplierId: 'SUP-004',
    supplierName: 'Precision Parts Inc',
    unitPrice: 2,
    totalPrice: 100000,
    deliveryTime: 7,
    paymentTerms: 'Net 15',
    status: 'under_review',
    submittedDate: '2024-01-20',
    revisionDate: '2024-01-23',
    previousPrice: 2.5,
    supplierNotes: 'Bulk order discount applied for 50,000 units.',
    quotationHistory: [
      {
        version: 1,
        unitPrice: 2.5,
        totalPrice: 125000,
        deliveryTime: 7,
        paymentTerms: 'Net 15',
        submittedDate: '2024-01-20',
        changedBy: 'supplier',
        status: 'submitted'
      },
      {
        version: 2,
        unitPrice: 2,
        totalPrice: 100000,
        deliveryTime: 7,
        paymentTerms: 'Net 15',
        submittedDate: '2024-01-23',
        changedBy: 'supplier',
        status: 'revised'
      }
    ]
  },
  {
    id: 'QT-005',
    rfqId: 'RFQ-005',
    requirementId: 'REQ-005',
    requirementName: 'Brake Calipers',
    supplierId: 'SUP-005',
    supplierName: 'AutoComponents Ltd',
    unitPrice: 150,
    totalPrice: 750000,
    deliveryTime: 18,
    paymentTerms: 'Net 60',
    status: 'revised',
    submittedDate: '2024-01-21',
    revisionDate: '2024-01-24',
    previousPrice: 165,
    supplierNotes: 'Specialized tooling investment enables competitive pricing.',
    quotationHistory: [
      {
        version: 1,
        unitPrice: 165,
        totalPrice: 825000,
        deliveryTime: 18,
        paymentTerms: 'Net 60',
        submittedDate: '2024-01-21',
        changedBy: 'supplier',
        status: 'submitted'
      },
      {
        version: 2,
        unitPrice: 150,
        totalPrice: 750000,
        deliveryTime: 18,
        paymentTerms: 'Net 60',
        submittedDate: '2024-01-24',
        changedBy: 'supplier',
        status: 'revised'
      }
    ]
  }
]

const initialNegotiations = [
  {
    id: 'NEG-001',
    quotationId: 'QT-001',
    rfqId: 'RFQ-001',
    supplierId: 'SUP-001',
    supplierName: 'TechCorp Industries',
    component: 'Electronic Control Unit (ECU)',
    quantity: 500,
    originalPrice: 100,
    revisedPrice: 96,
    targetPrice: 94,
    currentOffer: 95,
    deliveryRequirement: 10,
    paymentTerms: 'Net 30',
    status: 'negotiation_active',
    lastUpdated: '2024-09-12 10:30',
    negotiationHistory: [
      {
        id: 'NH-001',
        participant: 'system',
        action: 'rfq_sent',
        message: 'RFQ sent to supplier',
        price: null,
        timestamp: '2024-09-10 09:00'
      },
      {
        id: 'NH-002',
        participant: 'supplier',
        action: 'quotation_submitted',
        message: 'Initial quotation submitted',
        price: 100,
        timestamp: '2024-09-11 14:30'
      },
      {
        id: 'NH-003',
        participant: 'supplier',
        action: 'quotation_revised',
        message: 'Revised quotation based on volume discount',
        price: 96,
        timestamp: '2024-09-12 09:15'
      },
      {
        id: 'NH-004',
        participant: 'procurement',
        action: 'offer_sent',
        message: 'Proposed target price of ₹94/unit',
        price: 94,
        timestamp: '2024-09-12 10:30'
      }
    ],
    supplierResponse: null,
    responseDate: null,
    dealStatus: 'under_negotiation'
  },
  {
    id: 'NEG-002',
    quotationId: 'QT-002',
    rfqId: 'RFQ-001',
    supplierId: 'SUP-002',
    supplierName: 'IndustrialX Manufacturing',
    component: 'Electronic Control Unit (ECU)',
    quantity: 500,
    originalPrice: 95,
    revisedPrice: 95,
    targetPrice: 92,
    currentOffer: 93,
    deliveryRequirement: 14,
    paymentTerms: 'Net 30',
    status: 'counter_offer_received',
    lastUpdated: '2024-09-12 11:45',
    negotiationHistory: [
      {
        id: 'NH-005',
        participant: 'system',
        action: 'rfq_sent',
        message: 'RFQ sent to supplier',
        price: null,
        timestamp: '2024-09-10 09:00'
      },
      {
        id: 'NH-006',
        participant: 'supplier',
        action: 'quotation_submitted',
        message: 'Initial quotation submitted',
        price: 95,
        timestamp: '2024-09-11 16:45'
      },
      {
        id: 'NH-007',
        participant: 'procurement',
        action: 'offer_sent',
        message: 'Proposed target price of ₹92/unit',
        price: 92,
        timestamp: '2024-09-12 09:00'
      },
      {
        id: 'NH-008',
        participant: 'supplier',
        action: 'counter_offer',
        message: 'We can accept ₹93/unit with 14-day delivery',
        price: 93,
        timestamp: '2024-09-12 11:45'
      }
    ],
    supplierResponse: 'counter_offer',
    responseDate: '2024-09-12 11:45',
    supplierMessage: 'We can accept ₹93/unit with 14-day delivery. This is our best offer.',
    dealStatus: 'under_negotiation'
  },
  {
    id: 'NEG-003',
    quotationId: 'QT-003',
    rfqId: 'RFQ-001',
    supplierId: 'SUP-003',
    supplierName: 'AutoParts Premium',
    component: 'Electronic Control Unit (ECU)',
    quantity: 500,
    originalPrice: 110,
    revisedPrice: 110,
    targetPrice: 100,
    currentOffer: 105,
    deliveryRequirement: 10,
    paymentTerms: 'Net 30',
    status: 'deal_agreed',
    lastUpdated: '2024-09-12 12:00',
    negotiationHistory: [
      {
        id: 'NH-009',
        participant: 'system',
        action: 'rfq_sent',
        message: 'RFQ sent to supplier',
        price: null,
        timestamp: '2024-09-10 09:00'
      },
      {
        id: 'NH-010',
        participant: 'supplier',
        action: 'quotation_submitted',
        message: 'Initial quotation submitted',
        price: 110,
        timestamp: '2024-09-11 18:30'
      },
      {
        id: 'NH-011',
        participant: 'procurement',
        action: 'offer_sent',
        message: 'Proposed target price of ₹100/unit',
        price: 100,
        timestamp: '2024-09-12 09:30'
      },
      {
        id: 'NH-012',
        participant: 'supplier',
        action: 'counter_offer',
        message: 'We can do ₹105/unit',
        price: 105,
        timestamp: '2024-09-12 10:15'
      },
      {
        id: 'NH-013',
        participant: 'procurement',
        action: 'offer_accepted',
        message: 'Accepted supplier counter-offer',
        price: 105,
        timestamp: '2024-09-12 12:00'
      }
    ],
    supplierResponse: 'accepted',
    responseDate: '2024-09-12 10:15',
    supplierMessage: 'We can do ₹105/unit with 10-day delivery.',
    dealStatus: 'agreed',
    finalAgreedPrice: 105,
    finalDelivery: 10,
    totalSavings: 2500
  },
  {
    id: 'NEG-004',
    quotationId: 'QT-004',
    rfqId: 'RFQ-002',
    supplierId: 'SUP-002',
    supplierName: 'IndustrialX Manufacturing',
    component: 'Steel Sheets',
    quantity: 30000,
    originalPrice: 50,
    revisedPrice: 50,
    targetPrice: 45,
    currentOffer: 47,
    deliveryRequirement: 15,
    paymentTerms: 'Net 45',
    status: 'awaiting_supplier',
    lastUpdated: '2024-09-12 09:00',
    negotiationHistory: [
      {
        id: 'NH-014',
        participant: 'system',
        action: 'rfq_sent',
        message: 'RFQ sent to supplier',
        price: null,
        timestamp: '2024-09-11 09:00'
      },
      {
        id: 'NH-015',
        participant: 'supplier',
        action: 'quotation_submitted',
        message: 'Initial quotation submitted',
        price: 50,
        timestamp: '2024-09-12 10:00'
      },
      {
        id: 'NH-016',
        participant: 'procurement',
        action: 'offer_sent',
        message: 'Proposed target price of ₹47/unit',
        price: 47,
        timestamp: '2024-09-12 09:00'
      }
    ],
    supplierResponse: null,
    responseDate: null,
    dealStatus: 'under_negotiation'
  }
]

const initialApprovals = [
  {
    id: 'APR-001',
    rfqId: 'RFQ-001',
    quotationId: 'QT-003',
    supplierId: 'SUP-003',
    supplierName: 'AutoParts Premium',
    component: 'Electronic Control Unit (ECU)',
    quantity: 10000,
    unitPrice: 105,
    totalPrice: 1050000,
    deliveryTime: 10,
    expectedBudget: 1500000,
    status: 'approved',
    createdAt: '2024-09-12T12:00:00',
    approvedAt: '2024-09-12T14:30:00',
  },
  {
    id: 'APR-002',
    rfqId: 'RFQ-002',
    quotationId: 'QT-004',
    supplierId: 'SUP-002',
    supplierName: 'IndustrialX Manufacturing',
    component: 'Steel Sheets',
    quantity: 30000,
    unitPrice: 47,
    totalPrice: 1410000,
    deliveryTime: 15,
    expectedBudget: 2000000,
    status: 'pending_finance_approval',
    createdAt: '2024-09-12T09:00:00',
  },
]

// Supplier Comparison Mock Data
const initialSupplierComparisons = [
  {
    rfqId: 'RFQ-101',
    rfqName: 'Electronic Control Unit (ECU)',
    requiredQuantity: 500,
    requiredDelivery: 10,
    comparisonStatus: 'in_progress',
    suppliers: [
      {
        supplierId: 'SUP-001',
        supplierName: 'ABC Components',
        quotedPrice: 500,
        totalQuotation: 250000,
        deliveryTime: 10,
        deliveryPerformance: 92,
        qualityScore: 90,
        capacityStatus: 'Available',
        historicalPerformance: 'Excellent',
        riskLevel: 'Low',
        riskScore: 35,
        overallScore: 88,
        priceScore: 85,
        deliveryScore: 92,
        qualityScoreDetail: 90,
        capacityScore: 88,
        ranking: 2,
        selected: false
      },
      {
        supplierId: 'SUP-002',
        supplierName: 'AutoTech Systems',
        quotedPrice: 470,
        totalQuotation: 235000,
        deliveryTime: 15,
        deliveryPerformance: 75,
        qualityScore: 82,
        capacityStatus: 'Available',
        historicalPerformance: 'Good',
        riskLevel: 'High',
        riskScore: 78,
        overallScore: 72,
        priceScore: 95,
        deliveryScore: 75,
        qualityScoreDetail: 82,
        capacityScore: 75,
        ranking: 3,
        selected: false
      },
      {
        supplierId: 'SUP-003',
        supplierName: 'Precision Auto Parts',
        quotedPrice: 490,
        totalQuotation: 245000,
        deliveryTime: 8,
        deliveryPerformance: 95,
        qualityScore: 94,
        capacityStatus: 'Available',
        historicalPerformance: 'Excellent',
        riskLevel: 'Low',
        riskScore: 18,
        overallScore: 93,
        priceScore: 88,
        deliveryScore: 95,
        qualityScoreDetail: 94,
        capacityScore: 92,
        ranking: 1,
        selected: false
      },
      {
        supplierId: 'SUP-004',
        supplierName: 'GlobalTech Solutions',
        quotedPrice: 510,
        totalQuotation: 255000,
        deliveryTime: 12,
        deliveryPerformance: 88,
        qualityScore: 87,
        capacityStatus: 'Limited',
        historicalPerformance: 'Good',
        riskLevel: 'Medium',
        riskScore: 50,
        overallScore: 80,
        priceScore: 80,
        deliveryScore: 88,
        qualityScoreDetail: 87,
        capacityScore: 70,
        ranking: 4,
        selected: false
      }
    ],
    recommendedSupplier: 'SUP-003',
    recommendedSupplierName: 'Precision Auto Parts',
    recommendationReason: 'Best delivery performance, strong quality history, low predicted risk, sufficient capacity, competitive quotation',
    keyTradeOff: 'Precision Auto Parts is slightly more expensive than AutoTech Systems but provides significantly better delivery reliability and lower risk.',
    selectedSupplier: null
  },
  {
    rfqId: 'RFQ-102',
    rfqName: 'Steel Sheets',
    requiredQuantity: 30000,
    requiredDelivery: 15,
    comparisonStatus: 'completed',
    suppliers: [
      {
        supplierId: 'SUP-005',
        supplierName: 'IndustrialX Manufacturing',
        quotedPrice: 50,
        totalQuotation: 1500000,
        deliveryTime: 15,
        deliveryPerformance: 90,
        qualityScore: 88,
        capacityStatus: 'Available',
        historicalPerformance: 'Excellent',
        riskLevel: 'Low',
        riskScore: 28,
        overallScore: 90,
        priceScore: 92,
        deliveryScore: 90,
        qualityScoreDetail: 88,
        capacityScore: 90,
        ranking: 1,
        selected: true
      },
      {
        supplierId: 'SUP-006',
        supplierName: 'MetalWorks Inc',
        quotedPrice: 48,
        totalQuotation: 1440000,
        deliveryTime: 18,
        deliveryPerformance: 82,
        qualityScore: 85,
        capacityStatus: 'Available',
        historicalPerformance: 'Good',
        riskLevel: 'Medium',
        riskScore: 55,
        overallScore: 78,
        priceScore: 95,
        deliveryScore: 82,
        qualityScoreDetail: 85,
        capacityScore: 78,
        ranking: 2,
        selected: false
      }
    ],
    recommendedSupplier: 'SUP-005',
    recommendedSupplierName: 'IndustrialX Manufacturing',
    recommendationReason: 'Excellent delivery performance, good quality score, low risk, meets delivery requirement',
    keyTradeOff: 'IndustrialX is slightly more expensive but offers better delivery reliability and lower risk.',
    selectedSupplier: 'SUP-005'
  }
]

// Supplier Risk Analysis Mock Data
const initialSupplierRiskData = {
  'SUP-001': {
    supplierId: 'SUP-001',
    supplierName: 'TechCorp Industries',
    overallRiskScore: 25,
    overallRiskLevel: 'low',
    primaryRiskCategory: 'Quality',
    lastAnalysisDate: '2024-01-10',
    risks: {
      delivery: { score: 20, level: 'low', explanation: 'Consistent on-time delivery with minimal delays' },
      quality: { score: 30, level: 'low', explanation: 'High-quality products with few defects' },
      capacity: { score: 25, level: 'low', explanation: 'Reliable production capacity' }
    },
    riskBreakdown: [
      { name: 'Delivery Risk', score: 20 },
      { name: 'Quality Risk', score: 30 },
      { name: 'Capacity Risk', score: 25 }
    ],
    historicalPerformance: {
      totalOrders: 24,
      onTimeDeliveries: 22,
      delayedDeliveries: 2,
      averageDelayDays: 1.5,
      onTimePercentage: 92
    },
    deliveryData: [
      { month: 'Jan', onTime: 4, delayed: 0 },
      { month: 'Feb', onTime: 4, delayed: 1 },
      { month: 'Mar', onTime: 4, delayed: 0 },
      { month: 'Apr', onTime: 4, delayed: 0 },
      { month: 'May', onTime: 4, delayed: 1 },
      { month: 'Jun', onTime: 2, delayed: 0 }
    ],
    riskTrendData: [
      { month: 'Jan', deliveryRisk: 25, qualityRisk: 30, capacityRisk: 22 },
      { month: 'Feb', deliveryRisk: 28, qualityRisk: 32, capacityRisk: 24 },
      { month: 'Mar', deliveryRisk: 22, qualityRisk: 28, capacityRisk: 25 },
      { month: 'Apr', deliveryRisk: 20, qualityRisk: 30, capacityRisk: 26 },
      { month: 'May', deliveryRisk: 25, qualityRisk: 31, capacityRisk: 25 },
      { month: 'Jun', deliveryRisk: 20, qualityRisk: 30, capacityRisk: 25 }
    ],
    riskAnalysis: {
      primaryRisk: 'Low Quality Risk',
      riskLevel: 'low',
      explanation: 'This supplier demonstrates excellent performance across all risk categories with consistent delivery and high product quality.',
      contributingFactors: [
        'High on-time delivery percentage (92%)',
        'Minimal average delay (1.5 days)',
        'Consistent quality ratings',
        'Reliable production capacity',
        'Strong historical performance'
      ]
    }
  },
  'SUP-002': {
    supplierId: 'SUP-002',
    supplierName: 'IndustrialX Manufacturing',
    overallRiskScore: 78,
    overallRiskLevel: 'high',
    primaryRiskCategory: 'Delivery',
    lastAnalysisDate: '2024-01-10',
    risks: {
      delivery: { score: 85, level: 'high', explanation: 'Frequent delayed deliveries identified from historical supplier performance' },
      quality: { score: 55, level: 'medium', explanation: 'Moderate quality with occasional defects' },
      capacity: { score: 20, level: 'low', explanation: 'Adequate production capacity' }
    },
    riskBreakdown: [
      { name: 'Delivery Risk', score: 85 },
      { name: 'Quality Risk', score: 55 },
      { name: 'Capacity Risk', score: 20 }
    ],
    historicalPerformance: {
      totalOrders: 18,
      onTimeDeliveries: 6,
      delayedDeliveries: 12,
      averageDelayDays: 8,
      onTimePercentage: 33
    },
    deliveryData: [
      { month: 'Jan', onTime: 1, delayed: 2 },
      { month: 'Feb', onTime: 1, delayed: 2 },
      { month: 'Mar', onTime: 1, delayed: 2 },
      { month: 'Apr', onTime: 1, delayed: 2 },
      { month: 'May', onTime: 1, delayed: 2 },
      { month: 'Jun', onTime: 1, delayed: 2 }
    ],
    riskTrendData: [
      { month: 'Jan', deliveryRisk: 80, qualityRisk: 50, capacityRisk: 22 },
      { month: 'Feb', deliveryRisk: 82, qualityRisk: 52, capacityRisk: 20 },
      { month: 'Mar', deliveryRisk: 85, qualityRisk: 55, capacityRisk: 21 },
      { month: 'Apr', deliveryRisk: 84, qualityRisk: 54, capacityRisk: 20 },
      { month: 'May', deliveryRisk: 86, qualityRisk: 56, capacityRisk: 19 },
      { month: 'Jun', deliveryRisk: 85, qualityRisk: 55, capacityRisk: 20 }
    ],
    riskAnalysis: {
      primaryRisk: 'High Delivery Risk',
      riskLevel: 'high',
      explanation: 'Frequent delayed deliveries were identified from historical supplier performance. This supplier has consistently missed delivery deadlines.',
      contributingFactors: [
        'Frequent delayed deliveries',
        'Low on-time delivery percentage (33%)',
        'High average delay duration (8 days)',
        'Repeated delays in recent orders',
        'Inconsistent delivery performance'
      ]
    }
  },
  'SUP-003': {
    supplierId: 'SUP-003',
    supplierName: 'AutoParts Premium',
    overallRiskScore: 35,
    overallRiskLevel: 'low',
    primaryRiskCategory: 'Capacity',
    lastAnalysisDate: '2024-01-10',
    risks: {
      delivery: { score: 25, level: 'low', explanation: 'Good delivery performance with rare delays' },
      quality: { score: 20, level: 'low', explanation: 'Excellent quality with very few defects' },
      capacity: { score: 60, level: 'medium', explanation: 'Limited capacity for large orders' }
    },
    riskBreakdown: [
      { name: 'Delivery Risk', score: 25 },
      { name: 'Quality Risk', score: 20 },
      { name: 'Capacity Risk', score: 60 }
    ],
    historicalPerformance: {
      totalOrders: 15,
      onTimeDeliveries: 13,
      delayedDeliveries: 2,
      averageDelayDays: 2,
      onTimePercentage: 87
    },
    deliveryData: [
      { month: 'Jan', onTime: 3, delayed: 0 },
      { month: 'Feb', onTime: 2, delayed: 1 },
      { month: 'Mar', onTime: 3, delayed: 0 },
      { month: 'Apr', onTime: 2, delayed: 0 },
      { month: 'May', onTime: 2, delayed: 1 },
      { month: 'Jun', onTime: 1, delayed: 0 }
    ],
    riskTrendData: [
      { month: 'Jan', deliveryRisk: 22, qualityRisk: 18, capacityRisk: 58 },
      { month: 'Feb', deliveryRisk: 25, qualityRisk: 20, capacityRisk: 60 },
      { month: 'Mar', deliveryRisk: 23, qualityRisk: 19, capacityRisk: 59 },
      { month: 'Apr', deliveryRisk: 24, qualityRisk: 20, capacityRisk: 61 },
      { month: 'May', deliveryRisk: 26, qualityRisk: 21, capacityRisk: 62 },
      { month: 'Jun', deliveryRisk: 25, qualityRisk: 20, capacityRisk: 60 }
    ],
    riskAnalysis: {
      primaryRisk: 'Medium Capacity Risk',
      riskLevel: 'low',
      explanation: 'This supplier has excellent delivery and quality performance but may have limited capacity for very large orders.',
      contributingFactors: [
        'High on-time delivery percentage (87%)',
        'Low average delay (2 days)',
        'Excellent quality ratings',
        'Moderate capacity constraints',
        'Suitable for standard order sizes'
      ]
    }
  },
  'SUP-004': {
    supplierId: 'SUP-004',
    supplierName: 'GlobalSupply Co.',
    overallRiskScore: 52,
    overallRiskLevel: 'medium',
    primaryRiskCategory: 'Quality',
    lastAnalysisDate: '2024-01-10',
    risks: {
      delivery: { score: 45, level: 'medium', explanation: 'Occasional delivery delays' },
      quality: { score: 65, level: 'medium', explanation: 'Variable quality with some defects reported' },
      capacity: { score: 25, level: 'low', explanation: 'Good production capacity' }
    },
    riskBreakdown: [
      { name: 'Delivery Risk', score: 45 },
      { name: 'Quality Risk', score: 65 },
      { name: 'Capacity Risk', score: 25 }
    ],
    historicalPerformance: {
      totalOrders: 12,
      onTimeDeliveries: 8,
      delayedDeliveries: 4,
      averageDelayDays: 4,
      onTimePercentage: 67
    },
    deliveryData: [
      { month: 'Jan', onTime: 2, delayed: 1 },
      { month: 'Feb', onTime: 1, delayed: 1 },
      { month: 'Mar', onTime: 2, delayed: 0 },
      { month: 'Apr', onTime: 1, delayed: 1 },
      { month: 'May', onTime: 1, delayed: 1 },
      { month: 'Jun', onTime: 1, delayed: 0 }
    ],
    riskTrendData: [
      { month: 'Jan', deliveryRisk: 42, qualityRisk: 62, capacityRisk: 24 },
      { month: 'Feb', deliveryRisk: 45, qualityRisk: 64, capacityRisk: 25 },
      { month: 'Mar', deliveryRisk: 43, qualityRisk: 63, capacityRisk: 24 },
      { month: 'Apr', deliveryRisk: 46, qualityRisk: 65, capacityRisk: 26 },
      { month: 'May', deliveryRisk: 47, qualityRisk: 66, capacityRisk: 25 },
      { month: 'Jun', deliveryRisk: 45, qualityRisk: 65, capacityRisk: 25 }
    ],
    riskAnalysis: {
      primaryRisk: 'Medium Quality Risk',
      riskLevel: 'medium',
      explanation: 'This supplier shows moderate performance with some quality variability and occasional delivery delays.',
      contributingFactors: [
        'Moderate on-time delivery percentage (67%)',
        'Average delay of 4 days',
        'Variable quality consistency',
        'Good production capacity',
        'Requires quality monitoring'
      ]
    }
  }
}

// Mock data for risk recommendations
const initialRiskRecommendations = {
  'SUP-002': {
    supplier: 'IndustrialX Manufacturing',
    component: 'ECU Module',
    riskType: 'Delivery Risk',
    riskLevel: 'high',
    riskScore: 85,
    description: 'The supplier may delay the delivery of the required components.',
    potentialImpact: 'Delay in component delivery may affect the planned production schedule.',
    recommendations: [
      {
        id: 1,
        title: 'Maintain a Backup Supplier',
        description: 'Identify and keep an alternative supplier ready in case of delivery failure.',
        expectedBenefit: 'Reduces dependency on a single supplier.',
        priority: 'high',
        riskReduction: 'High',
        expectedImpact: 'Production Delay Avoidance',
        actionTime: 'Immediate'
      },
      {
        id: 2,
        title: 'Request Revised Delivery Commitment',
        description: 'Contact the supplier and request an updated delivery schedule.',
        expectedBenefit: 'Provides better visibility into expected delivery.',
        priority: 'medium',
        riskReduction: 'Medium',
        expectedImpact: 'Improved Planning',
        actionTime: '1-2 Days'
      },
      {
        id: 3,
        title: 'Split the Order Between Suppliers',
        description: 'Allocate part of the required quantity to an alternative supplier.',
        expectedBenefit: 'Reduces the impact of potential delivery disruption.',
        priority: 'high',
        riskReduction: 'High',
        expectedImpact: 'Risk Mitigation',
        actionTime: 'Immediate'
      },
      {
        id: 4,
        title: 'Select an Alternative Supplier',
        description: 'Review other suppliers with lower predicted risk.',
        expectedBenefit: 'Reduces the probability of procurement disruption.',
        priority: 'high',
        riskReduction: 'Very High',
        expectedImpact: 'Risk Elimination',
        actionTime: '3-5 Days'
      }
    ],
    alternativeSuppliers: [
      { id: 'SUP-001', name: 'TechCorp Industries', price: 500, deliveryTime: 10, riskLevel: 'low', riskScore: 25 },
      { id: 'SUP-003', name: 'AutoParts Premium', price: 520, deliveryTime: 8, riskLevel: 'low', riskScore: 35 },
      { id: 'SUP-004', name: 'GlobalSupply Co.', price: 490, deliveryTime: 15, riskLevel: 'medium', riskScore: 52 }
    ]
  },
  'SUP-001': {
    supplier: 'TechCorp Industries',
    component: 'ECU Module',
    riskType: 'Quality Risk',
    riskLevel: 'low',
    riskScore: 25,
    description: 'Minor quality concerns detected in recent deliveries.',
    potentialImpact: 'May require additional quality inspection before use.',
    recommendations: [
      {
        id: 1,
        title: 'Request Additional Quality Verification',
        description: 'Request detailed quality inspection reports from the supplier.',
        expectedBenefit: 'Ensures product quality meets specifications.',
        priority: 'medium',
        riskReduction: 'Medium',
        expectedImpact: 'Quality Assurance',
        actionTime: '2-3 Days'
      },
      {
        id: 2,
        title: 'Increase Quality Inspection',
        description: 'Implement additional quality checks upon delivery.',
        expectedBenefit: 'Catches potential quality issues early.',
        priority: 'low',
        riskReduction: 'Medium',
        expectedImpact: 'Quality Control',
        actionTime: 'Immediate'
      }
    ],
    alternativeSuppliers: [
      { id: 'SUP-003', name: 'AutoParts Premium', price: 520, deliveryTime: 8, riskLevel: 'low', riskScore: 35 },
      { id: 'SUP-004', name: 'GlobalSupply Co.', price: 490, deliveryTime: 15, riskLevel: 'medium', riskScore: 52 }
    ]
  }
}

const initialRiskResponseHistory = [
  {
    id: 'RRH-001',
    date: 'Sep 09, 2024',
    supplier: 'IndustrialX Manufacturing',
    risk: 'Delivery Risk',
    recommendation: 'Backup Supplier',
    finalDecision: 'Accepted',
    status: 'Completed'
  },
  {
    id: 'RRH-002',
    date: 'Sep 07, 2024',
    supplier: 'GlobalSupply Co.',
    risk: 'Quality Risk',
    recommendation: 'Additional Inspection',
    finalDecision: 'Alternative Selected',
    status: 'Completed'
  },
  {
    id: 'RRH-003',
    date: 'Sep 05, 2024',
    supplier: 'AutoParts Premium',
    risk: 'Capacity Risk',
    recommendation: 'Split Order',
    finalDecision: 'Accepted',
    status: 'In Progress'
  }
]

// Workflow status progression
const workflowStatuses = [
  'new',
  'under_review',
  'rfq_created',
  'rfq_sent',
  'rfq_viewed',
  'quotation_submitted',
  'quotation_under_review',
  'supplier_selected',
  'pending_finance_approval',
  'approved',
  'rejected',
]

const WorkflowContext = createContext()

const normalizeUser = (user) => user ? {
  ...user,
  name: user.name || user.full_name || user.display_name || user.username || 'User',
  userId: user.id,
  id: user.supplier_id || user.id,
  role: user.role?.toLowerCase(),
  roleName: user.role?.replaceAll('_', ' ') || '',
} : null

const normalizeRequirement = (requirement) => ({
  ...requirement,
  status: requirement.status?.toLowerCase(),
  priority: requirement.priority?.toLowerCase(),
  componentCategory: requirement.component_category || requirement.componentCategory || (requirement.component_name?.includes('ECU') || requirement.component_name?.includes('Circuit') ? 'Electronics' : requirement.component_name?.includes('Steel') ? 'Raw Materials' : 'Hardware'),
  componentName: requirement.component_name,
  requiredQuantity: requirement.required_quantity,
  currentInventory: requirement.current_inventory,
  shortageQuantity: Math.max(0, requirement.required_quantity - requirement.current_inventory),
  requiredDeliveryDate: requirement.required_delivery_date,
})

const normalizeRfq = (rfq) => {
  const assignedSuppliers = rfq.suppliers || []
  const supplierIds = rfq.supplier_ids || (Array.isArray(assignedSuppliers) ? assignedSuppliers.map(s => s.supplier_id || s) : [])
  const viewedBy = Array.isArray(assignedSuppliers) ? assignedSuppliers.filter(s => s.viewed_at).map(s => s.supplier_id) : []

  return {
    ...rfq,
    status: rfq.status?.toLowerCase(),
    requirementId: rfq.requirement_id,
    quotationDeadline: rfq.quotation_deadline,
    requiredDeliveryDate: rfq.required_delivery_date,
    expectedBudget: rfq.expected_budget,
    component: rfq.items?.[0]?.description || rfq.component,
    quantity: rfq.items?.[0]?.quantity || rfq.quantity,
    supplierIds,
    selectedSuppliers: supplierIds,
    sentTo: supplierIds,
    viewedBy,
    suppliers: assignedSuppliers,
  }
}

const normalizeQuotation = (quotation) => ({
  ...quotation,
  status: quotation.status?.toLowerCase(),
  rfqId: quotation.rfq_id,
  supplierId: quotation.supplier_id,
  unitPrice: Number(quotation.unit_price),
  totalPrice: Number(quotation.total_price),
  availableQuantity: quotation.available_quantity,
  deliveryAt: quotation.delivery_at,
  paymentTerms: quotation.payment_terms,
  warranty: quotation.warranty_quality,
  additionalNotes: quotation.additional_notes,
  submittedAt: quotation.submitted_at,
})

const normalizeApproval = (approval) => {
  const st = approval.status?.toLowerCase()
  return {
    ...approval,
    rfqId: approval.rfq_id,
    quotationId: approval.quotation_id,
    status: (st === 'pending' || st === 'pending_finance_approval') ? 'pending_finance_approval' : st,
    rejectionReason: approval.decision_reason,
  }
}

const normalizeNegotiation = (negotiation) => ({
  ...negotiation,
  rfqId: negotiation.rfq_id,
  quotationId: negotiation.quotation_id,
  supplierId: negotiation.supplier_id,
  negotiationHistory: (negotiation.messages || []).map(message => ({
    ...message,
    participant: message.sender_type === 'PROCUREMENT_MANAGER' ? 'procurement' : message.sender_type === 'SUPPLIER' ? 'supplier' : 'system',
    message: message.content,
    timestamp: message.created_at ? new Date(message.created_at).toLocaleString() : '',
  })),
})

const normalizeRisk = (risk) => {
  const level = score => score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'
  const risks = {
    delivery: { score: risk.delivery_risk ?? 0, level: level(risk.delivery_risk ?? 0), explanation: risk.risk_drivers?.join('; ') || 'No delivery risk driver recorded' },
    quality: { score: risk.quality_risk ?? 0, level: level(risk.quality_risk ?? 0), explanation: risk.risk_drivers?.join('; ') || 'No quality risk driver recorded' },
    capacity: { score: risk.capacity_risk ?? 0, level: level(risk.capacity_risk ?? 0), explanation: risk.risk_drivers?.join('; ') || 'No capacity risk driver recorded' },
  }
  return {
    ...risk,
    supplierId: risk.supplier_id,
    overallRiskScore: risk.overall_risk ?? 0,
    overallRiskLevel: level(risk.overall_risk ?? 0),
    primaryRiskCategory: risks.delivery.score >= risks.capacity.score ? 'Delivery' : 'Capacity',
    lastAnalysisDate: risk.assessed_at,
    metrics: {
      delivery: risks.delivery,
      quality: risks.quality,
      financial: { score: risk.inventory_exposure ?? 0, level: level(risk.inventory_exposure ?? 0) },
      capacity: risks.capacity,
    },
    recommendations: risk.escalation_required ? ['Initiate executive review', 'Prepare secondary supplier allocation'] : ['Maintain standard operational tracking'],
  }
}

const normalizePurchaseOrder = (purchaseOrder) => ({
  ...purchaseOrder,
  rfqId: purchaseOrder.rfq_id,
  quotationId: purchaseOrder.quotation_id,
  supplierId: purchaseOrder.supplier_id,
  totalAmount: Number(purchaseOrder.total_amount || 0),
  acknowledgementNotes: purchaseOrder.acknowledgement_notes,
  acknowledgedAt: purchaseOrder.acknowledged_at,
})

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}

export const WorkflowProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('prism_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [requirements, setRequirements] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [rfqs, setRFQs] = useState([])
  const [quotations, setQuotations] = useState([])
  const [negotiations, setNegotiations] = useState([])
  const [supplierComparisons] = useState([])
  const [approvals, setApprovals] = useState([])
  const [supplierRiskData, setSupplierRiskData] = useState({})
  const [riskRecommendations] = useState({})
  const [riskResponseHistory] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [decisionData, setDecisionData] = useState({})
  const [workflowExecutions, setWorkflowExecutions] = useState({})

  const refreshData = useCallback(async () => {
    if (!localStorage.getItem('mycelia_access_token')) return
    const [requirementData, supplierData, rfqData, approvalData] = await Promise.all([
      getRequirements().catch(() => []),
      listSuppliers().catch(() => []),
      listRfqs().catch(() => []),
      listApprovals().catch(() => []),
    ])
    const normalizedRequirements = requirementData.map(normalizeRequirement)
    const normalizedRfqs = rfqData.map(normalizeRfq)
    setRequirements(normalizedRequirements)
    setSuppliers(supplierData)
    setRFQs(normalizedRfqs)

    const quotationData = await Promise.all(rfqData.map(rfq => listRfqQuotations(rfq.id).catch(() => [])))
    const normalizedQuotations = quotationData.flat().map(normalizeQuotation)
    setQuotations(normalizedQuotations)

    const enrichedApprovals = approvalData.map(normalizeApproval).map(app => {
      const quote = normalizedQuotations.find(q => q.id === app.quotationId)
      const rfq = normalizedRfqs.find(r => r.id === app.rfqId)
      const sup = supplierData.find(s => s.id === (quote?.supplierId || app.supplier_id))
      return {
        ...app,
        supplierId: quote?.supplierId || app.supplierId,
        supplierName: sup?.name || quote?.supplierName || 'Selected Supplier',
        component: rfq?.component || quote?.component || 'Required Component',
        totalPrice: quote?.totalPrice || (quote?.unitPrice && quote?.quantity ? quote.unitPrice * quote.quantity : 0),
        unitPrice: quote?.unitPrice,
        quantity: quote?.quantity,
      }
    })
    setApprovals(enrichedApprovals)

    const riskData = await Promise.all(supplierData.map(supplier => getSupplierRisk(supplier.id).catch(() => null)))
    setSupplierRiskData(Object.fromEntries(riskData.filter(Boolean).map(item => [item.supplier_id, normalizeRisk(item)])))
    const rawNegotiations = await listNegotiations().catch(() => [])
    const enrichedNegotiations = rawNegotiations.map(normalizeNegotiation).map(neg => {
      const quote = normalizedQuotations.find(q => q.id === neg.quotationId)
      const rfq = normalizedRfqs.find(r => r.id === neg.rfqId)
      const sup = supplierData.find(s => s.id === (quote?.supplierId || neg.supplierId))
      const unitPrice = quote?.unitPrice || 100
      const quantity = rfq?.quantity || quote?.quantity || 1000
      const expectedBudget = rfq?.expectedBudget || (unitPrice * quantity * 0.9)
      const targetPrice = quantity > 0 ? Math.round(expectedBudget / quantity) : Math.round(unitPrice * 0.9)

      return {
        ...neg,
        supplierName: sup?.name || quote?.supplierName || 'Selected Supplier',
        component: rfq?.component || quote?.component || 'Required Component',
        quantity: quantity,
        originalPrice: unitPrice,
        revisedPrice: unitPrice,
        targetPrice: targetPrice,
        currentOffer: unitPrice,
        deliveryRequirement: quote?.deliveryTime || 14,
        paymentTerms: quote?.paymentTerms || 'Net 30',
        dealStatus: neg.status?.toLowerCase() === 'deal_agreed' ? 'agreed' : 'under_negotiation',
        lastUpdated: neg.negotiationHistory?.length > 0 ? neg.negotiationHistory[neg.negotiationHistory.length - 1].timestamp : new Date().toLocaleDateString(),
      }
    })
    setNegotiations(enrichedNegotiations)
    setPurchaseOrders((await listPurchaseOrders().catch(() => [])).map(normalizePurchaseOrder))
    const decisions = await Promise.all(rfqData.map(rfq => getDecision(rfq.id).catch(() => null)))
    setDecisionData(Object.fromEntries(decisions.filter(Boolean).map(item => [item.rfq_id, item])))
  }, [])

  useEffect(() => {
    if (localStorage.getItem('mycelia_access_token')) {
      me().then(user => setCurrentUser(normalizeUser(user))).then(refreshData).catch(() => clearAuthentication())
    }
  }, [refreshData])

  // Actions
  const login = async (username, password) => {
    const user = await authenticate(username, password)
    setCurrentUser(normalizeUser(user))
    await refreshData()
    return user
  }

  const logout = () => {
    setCurrentUser(null)
    clearAuthentication()
  }

  const updateRequirementStatus = () => refreshData()

  const createRFQ = async (rfqData) => {
    const newRFQ = await createRfqRequest({
      requirement_id: rfqData.requirementId || null,
      quotation_deadline: new Date(rfqData.quotationDeadline).toISOString(),
      required_delivery_date: new Date(rfqData.deliveryDeadline).toISOString(),
      evaluation_policy: rfqData.evaluationPolicy || 'Evaluate valid quotations after the deadline.',
      expected_supplier_count: rfqData.selectedSuppliers.length,
      minimum_valid_quotation_count: rfqData.minimumValidQuotationCount || 1,
      supplier_ids: rfqData.selectedSuppliers,
      items: [{ description: rfqData.component, quantity: rfqData.quantity }],
    })
    await refreshData()
    return newRFQ
  }

  const sendRFQ = async (rfqId, supplierIds) => {
    let targetSupplierIds = supplierIds
    if (!targetSupplierIds || !Array.isArray(targetSupplierIds) || targetSupplierIds.length === 0) {
      const targetRfq = rfqs.find(item => item.id === rfqId)
      targetSupplierIds = targetRfq?.supplierIds || targetRfq?.suppliers?.map(s => s.supplier_id || s) || []
    }
    const result = await sendRfqRequest(rfqId, targetSupplierIds)
    await refreshData()
    return result
  }

  const viewRFQ = (rfqId) => getRfqResponses(rfqId)

  const submitQuotation = async (quotationData) => {
    const rfq = rfqs.find(item => item.id === quotationData.rfqId)
    const result = await submitQuotationRequest({
      rfq_id: quotationData.rfqId,
      supplier_id: quotationData.supplierId,
      unit_price: quotationData.unitPrice,
      total_price: quotationData.totalPrice,
      quantity: quotationData.quantity,
      available_quantity: quotationData.availableQuantity,
      delivery_at: new Date(Date.now() + Number(quotationData.deliveryTime || 0) * 86400000).toISOString(),
      payment_terms: quotationData.paymentTerms || null,
      warranty_quality: quotationData.warranty || null,
      additional_notes: quotationData.additionalNotes || null,
    })
    await refreshData()
    return { ...result, component: rfq?.component }
  }

  const reviseQuotation = async (quotationId, revisedData) => {
    const existing = quotations.find(item => item.id === quotationId)
    if (!existing) return null
    const result = await reviseQuotationRequest(quotationId, {
      rfq_id: existing.rfq_id || existing.rfqId,
      supplier_id: existing.supplier_id || existing.supplierId,
      unit_price: revisedData.unitPrice,
      total_price: revisedData.totalPrice,
      quantity: revisedData.quantity || existing.quantity,
      available_quantity: revisedData.availableQuantity || existing.available_quantity,
      delivery_at: revisedData.deliveryAt || existing.delivery_at,
      payment_terms: revisedData.paymentTerms || existing.payment_terms,
      warranty_quality: revisedData.warranty || existing.warranty_quality,
      additional_notes: revisedData.additionalNotes || existing.additional_notes,
    })
    await refreshData()
    return result
  }

  const selectSupplier = async (rfqId, quotationId) => {
    const result = await selectSupplierRequest(rfqId, quotationId)
    await refreshData()
    return result
  }

  const approveRequest = async (approvalId) => {
    const result = await approveRequestApi(approvalId)
    await refreshData()
    return result
  }

  const rejectRequest = async (approvalId, reason) => {
    const result = await rejectRequestApi(approvalId, reason)
    await refreshData()
    return result
  }

  const sendFinalDecisionToSupplier = (approvalId, supplierId, message) => {
    return Promise.resolve({ approvalId, supplierId, message, status: 'STAGE_2_PLACEHOLDER' })
  }

  const resetWorkflow = () => {
    clearAuthentication()
    setCurrentUser(null)
    setRequirements([])
    setSuppliers([])
    setRFQs([])
    setQuotations([])
    setApprovals([])
  }

  const getSupplierRiskData = (supplierId) => {
    return supplierRiskData[supplierId] || null
  }

  const getRiskRecommendations = (supplierId) => {
    return riskRecommendations[supplierId] || null
  }

  const getDecisionData = (rfqId) => decisionData[rfqId] || null

  const trackWorkflowExecution = async (executionId) => {
    const execution = await getWorkflowExecution(executionId)
    setWorkflowExecutions(previous => ({ ...previous, [executionId]: execution }))
    return execution
  }

  const value = {
    // State
    currentUser,
    requirements,
    suppliers,
    rfqs,
    quotations,
    negotiations,
    supplierComparisons,
    approvals,
    supplierRiskData,
    riskRecommendations,
    riskResponseHistory,
    workflowStatuses,
    mockUsers: [],
    purchaseOrders,
    decisionData,
    workflowExecutions,
    refreshData,
    
    // Actions
    login,
    logout,
    updateRequirementStatus,
    createRFQ,
    sendRFQ,
    viewRFQ,
    submitQuotation,
    reviseQuotation,
    selectSupplier,
    approveRequest,
    rejectRequest,
    sendFinalDecisionToSupplier,
    resetWorkflow,
    getSupplierRiskData,
    getRiskRecommendations,
    getDecisionData,
    trackWorkflowExecution,
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}
