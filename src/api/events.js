import { api } from './client'

/**
 * Core event dispatcher → POST /api/workflows/events
 * Every procurement event is forwarded to n8n via the backend.
 */
export const fireEvent = (eventType, priority = 'MEDIUM', source = {}, context = {}) =>
  api.post('/workflows/events', { event_type: eventType, priority, source, context })

/**
 * Monitoring event dispatcher → POST /api/monitoring/events
 * For operational/supply-chain monitoring events.
 */
export const fireMonitoringEvent = (eventType, priority = 'HIGH', source = {}, context = {}) =>
  api.post('/monitoring/events', { event_type: eventType, priority, source, context })

// ─────────────────────────────────────────────────────────────────────────────
// FINAL TRIGGER / EVENT SET
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. RFQ Deadline Reached
 * Automatic when RFQ quotation deadline is reached.
 * Details: rfq_id, component_id, required_delivery_date, expected_supplier_count, quotation_count, priority
 */
export const triggerRfqDeadlineReached = ({ rfq_id, component_id, required_delivery_date, expected_supplier_count, quotation_count, priority = 'HIGH' }) =>
  fireEvent('RFQ_DEADLINE_REACHED', priority, { rfq_id, component_id }, {
    rfq_id,
    component_id,
    required_delivery_date,
    expected_supplier_count,
    quotation_count,
  })

/**
 * 2. Required Negotiation
 * Procurement Manager clicks "Required Negotiation" on a supplier quotation.
 * Details: rfq_id, quotation_id, supplier_id, component_id, quoted_price, quoted_quantity, quoted_delivery_date, negotiation_reason, priority
 */
export const triggerNegotiationRequest = ({ rfq_id, quotation_id, supplier_id, component_id, quoted_price, quoted_quantity, quoted_delivery_date, negotiation_reason, priority = 'HIGH' }) =>
  fireEvent('NEGOTIATION_REQUEST', priority, { rfq_id, quotation_id: undefined, supplier_id, component_id }, {
    rfq_id,
    quotation_id,
    supplier_id,
    component_id,
    quoted_price,
    quoted_quantity,
    quoted_delivery_date,
    negotiation_reason,
  })

/**
 * 3. Real-Time Supplier Monitoring
 * Scheduled automatically every 2 minutes.
 * Details: supplier_id, component_id, delivery_status, expected_delivery, latest_update_timestamp, tracking_data
 */
export const triggerSupplierMonitoring = ({ supplier_id, component_id, delivery_status, expected_delivery, latest_update_timestamp, tracking_data = {} }) =>
  fireMonitoringEvent('SUPPLIER_MONITORING', 'MEDIUM', { supplier_id, component_id }, {
    supplier_id,
    component_id,
    delivery_status,
    expected_delivery,
    latest_update_timestamp: latest_update_timestamp || new Date().toISOString(),
    tracking_data,
  })

/**
 * 4. Report Supplier Delay
 * User/manual or supplier update.
 * Details: supplier_id, component_id, rfq_id, delay_details, new_expected_date, priority
 */
export const triggerSupplierDelay = ({ supplier_id, component_id, rfq_id, delay_details, new_expected_date, priority = 'HIGH' }) =>
  fireMonitoringEvent('SUPPLIER_DELAY', priority, { supplier_id, component_id, rfq_id }, {
    supplier_id,
    component_id,
    rfq_id,
    delay_details,
    new_expected_date,
  })

/**
 * 5. Inventory Shortage
 * Manual/system detection.
 * Details: component_id, current_inventory, required_quantity, shortage_quantity, required_date
 */
export const triggerInventoryShortage = ({ component_id, current_inventory, required_quantity, shortage_quantity, required_date, priority = 'CRITICAL' }) =>
  fireMonitoringEvent('INVENTORY_SHORTAGE', priority, { component_id }, {
    component_id,
    current_inventory,
    required_quantity,
    shortage_quantity,
    required_date,
  })

/**
 * 6. Alternative Supplier Request
 * Procurement Manager/system escalation.
 * Details: component_id, required_quantity, required_delivery_date, reason, priority
 */
export const triggerAlternativeSupplierRequest = ({ component_id, required_quantity, required_delivery_date, reason, priority = 'HIGH' }) =>
  fireEvent('ALTERNATIVE_SUPPLIER_REQUEST', priority, { component_id }, {
    component_id,
    required_quantity,
    required_delivery_date,
    reason,
  })

/**
 * 7. Supplier Risk Review
 * Manual/system escalation.
 * Details: supplier_id, component_id, reason, priority
 */
export const triggerSupplierRiskReview = ({ supplier_id, component_id, reason, priority = 'HIGH' }) =>
  fireEvent('SUPPLIER_RISK_REVIEW', priority, { supplier_id, component_id }, {
    supplier_id,
    component_id,
    reason,
  })

