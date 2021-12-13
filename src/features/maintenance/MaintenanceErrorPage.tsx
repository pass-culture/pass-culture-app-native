import React, { useEffect } from 'react'

import { Maintenance } from 'features/maintenance/Maintenance'
import { useMaintenance } from 'features/maintenance/useMaintenance'
import { MAINTENANCE } from 'libs/firestore/maintenance'

type Props = {
  resetErrorBoundary: () => void
}

export const MaintenanceErrorPage = ({ resetErrorBoundary }: Props) => {
  const { status, message } = useMaintenance()
  // This first hook will be like a componentWillUnmount
  useEffect(() => resetErrorBoundary, [])
  // This one is for when feature flip switch back to off later
  useEffect(() => {
    // it must be false and not undefined (which means not fetched)
    if (status === MAINTENANCE.OFF) {
      resetErrorBoundary()
    }
  }, [status])
  return <Maintenance message={message} />
}
