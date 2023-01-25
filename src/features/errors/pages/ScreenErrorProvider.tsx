import React from 'react'

import { useMustUpdateApp } from 'features/forceUpdate/helpers/useMustUpdateApp'
import { ForceUpdate } from 'features/forceUpdate/pages/ForceUpdate'
import { MaintenanceErrorPage } from 'features/maintenance/MaintenanceErrorPage'
import { useMaintenance } from 'features/maintenance/useMaintenance'
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
