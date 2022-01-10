import React from 'react'

import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { useMustUpdateApp } from 'features/forceUpdate/useMustUpdateApp'
import { LandscapePositionPage } from 'features/landscapePosition/LandscapePositionPage'
import { useIsLandscapePosition } from 'features/landscapePosition/useIsLandscapePosition'
import { MaintenanceErrorPage } from 'features/maintenance/MaintenanceErrorPage'
import { useMaintenance } from 'features/maintenance/useMaintenance'
import { MAINTENANCE } from 'libs/firestore/maintenance'
import { ScreenError } from 'libs/monitoring/errors'

export const ScreenErrorProvider = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
  const { status } = useMaintenance()
  const mustUpdateApp = useMustUpdateApp()
  const isLandscapePosition = useIsLandscapePosition()

  if (mustUpdateApp) {
    throw new ScreenError('Must update app', ForceUpdate)
  }

  if (status === MAINTENANCE.ON) {
    throw new ScreenError('Under maintenance', MaintenanceErrorPage)
  }

  return children ? (
    <React.Fragment>
      <LandscapePositionPage isVisible={isLandscapePosition} />
      {children}
    </React.Fragment>
  ) : null
}
