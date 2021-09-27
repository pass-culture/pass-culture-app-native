import { useEffect, useState } from 'react'

import { maintenanceStatusListener } from 'libs/firestore/maintenance'

export const useIsUnderMaintenance = () => {
  const [maintenance, setMaintenance] = useState<boolean | undefined>()
  useEffect(() => {
    const subscriber = maintenanceStatusListener(setMaintenance)

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])
  return maintenance
}
