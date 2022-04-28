import { useEffect, useState } from 'react'

import {
  MAINTENANCE,
  Maintenance,
  maintenanceStatusListener,
} from 'libs/firebase/firestore/maintenance'

export const useMaintenance = (): Maintenance => {
  const [maintenance, setMaintenance] = useState<Maintenance>({
    status: MAINTENANCE.UNKNOWN,
    message: undefined,
  })
  useEffect(() => {
    const subscriber = maintenanceStatusListener(setMaintenance)

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])
  return maintenance
}
