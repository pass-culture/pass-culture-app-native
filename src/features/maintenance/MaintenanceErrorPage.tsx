import React, { useEffect } from 'react'

import { Maintenance } from 'features/maintenance/Maintenance'
import { useIsUnderMaintenance } from 'features/maintenance/useMaintenance'

type Props = {
  resetErrorBoundary: () => void
}

export const MaintenanceErrorPage = ({ resetErrorBoundary }: Props) => {
  const isUnderMaintenance = useIsUnderMaintenance()
  // This first hook will be like a componentWillUnmount
  useEffect(() => resetErrorBoundary, [])
  // This one is for when feature flip switch back to off later
  useEffect(() => {
    // it must be false and not undefined (which means not fetched)
    if (isUnderMaintenance === false) {
      resetErrorBoundary()
    }
  }, [isUnderMaintenance])
  return <Maintenance />
}
