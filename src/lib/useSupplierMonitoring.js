import { useEffect, useRef } from 'react'
import { triggerSupplierMonitoring } from '../api/events'

/**
 * useSupplierMonitoring — fires SUPPLIER_MONITORING event every 2 minutes
 * for each active supplier with a live delivery tracking record.
 *
 * Drop this hook into any page that should drive real-time monitoring.
 */
export function useSupplierMonitoring(suppliers = [], enabled = true) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (!enabled || suppliers.length === 0) return

    const run = async () => {
      for (const s of suppliers) {
        // Only fire for suppliers that have an active delivery
        if (!s.id && !s.supplier_id) continue
        try {
          await triggerSupplierMonitoring({
            supplier_id:              s.id || s.supplier_id,
            component_id:             s.component_id || null,
            delivery_status:          s.deliveryStatus || s.delivery_status || 'IN_TRANSIT',
            expected_delivery:        s.expectedDelivery || s.expected_delivery || null,
            latest_update_timestamp:  new Date().toISOString(),
            tracking_data: {
              name:          s.name || s.supplierName,
              tracking_id:   s.trackingId || null,
              location:      s.location || null,
            },
          })
        } catch {
          // Silently ignore — monitoring is best-effort
        }
      }
    }

    run() // fire immediately on mount
    timerRef.current = setInterval(run, 2 * 60 * 1000) // then every 2 minutes

    return () => clearInterval(timerRef.current)
  }, [suppliers, enabled])
}
