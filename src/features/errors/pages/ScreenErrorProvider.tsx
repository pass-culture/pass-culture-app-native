import React from 'react'

import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { useMustUpdateApp } from 'features/forceUpdate/useMustUpdateApp'
import { useMaintenance } from 'features/maintenance/helpers/useMaintenance'
import { MaintenanceErrorPage } from 'features/maintenance/pages/MaintenanceErrorPage'
import { MAINTENANCE } from 'libs/firebase/firestore/maintenance'
import { ScreenError } from 'libs/monitoring/errors'

export const ScreenErrorProvider = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
  const { status } = useMaintenance()
  const mustUpdateApp = useMustUpdateApp()

  if (mustUpdateApp) {
    throw new ScreenError('Must update app', ForceUpdate)
  }

  if (status === MAINTENANCE.ON) {
    throw new ScreenError('Under maintenance', MaintenanceErrorPage)
  }

  return children ? <React.Fragment>{children}</React.Fragment> : null
}
