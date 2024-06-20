import React from 'react'

import { useMustUpdateApp } from 'features/forceUpdate/helpers/useMustUpdateApp'
import { ForceUpdate } from 'features/forceUpdate/pages/ForceUpdate'
import { useMaintenance } from 'features/maintenance/helpers/useMaintenance'
import { MaintenanceErrorPage } from 'features/maintenance/pages/MaintenanceErrorPage'
import { MAINTENANCE } from 'libs/firebase/firestore/maintenance'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

export const ScreenErrorProvider = ({
  children,
}: {
  children?: React.JSX.Element | React.JSX.Element[]
}) => {
  const { status } = useMaintenance()
  const mustUpdateApp = useMustUpdateApp()
  const { shouldLogInfo } = useRemoteConfigContext()

  if (mustUpdateApp) {
    throw new ScreenError('Must update app', {
      Screen: ForceUpdate,
      shouldBeCapturedAsInfo: shouldLogInfo,
    })
  }

  if (status === MAINTENANCE.ON) {
    throw new ScreenError('Under maintenance', {
      Screen: MaintenanceErrorPage,
      shouldBeCapturedAsInfo: shouldLogInfo,
    })
  }

  return children ? <React.Fragment>{children}</React.Fragment> : null
}
