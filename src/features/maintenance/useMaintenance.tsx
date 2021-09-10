import { useEffect } from 'react'

import { navigationRef } from 'features/navigation/navigationRef'
import { maintenanceStatusListener } from 'libs/firestore/maintenance'

const resetToMaintenancePage = () => {
  navigationRef.current?.reset({
    index: 0,
    routes: [
      {
        name: 'Maintenance',
      },
    ],
  })
}

const onMaintenanceStatusChange = (isUnderMaintenance: boolean) => {
  if (isUnderMaintenance) resetToMaintenancePage()
}

export const useBlockForMaintenance = () => {
  useEffect(() => {
    const subscriber = maintenanceStatusListener(onMaintenanceStatusChange)

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])
}
