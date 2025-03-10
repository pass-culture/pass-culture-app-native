import React from 'react'

import { MustUpdateAppState, useMustUpdateApp } from 'features/forceUpdate/helpers/useMustUpdateApp'
import { ForceUpdateWithResetErrorBoundary } from 'features/forceUpdate/pages/ForceUpdateWithResetErrorBoundary'
import { useMaintenance } from 'features/maintenance/helpers/useMaintenance/useMaintenance'
import { MaintenanceErrorPage } from 'features/maintenance/pages/MaintenanceErrorPage'
import { MAINTENANCE } from 'libs/firebase/firestore/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

export const ScreenErrorProvider = ({
  children,
}: {
  children?: React.JSX.Element | React.JSX.Element[]
}) => {
  const { status } = useMaintenance()
  const mustUpdateApp = useMustUpdateApp()
  const { logType } = useLogTypeFromRemoteConfig()

  if (mustUpdateApp === MustUpdateAppState.SHOULD_UPDATE) {
    throw new ScreenError('Must update app', {
      Screen: ForceUpdateWithResetErrorBoundary,
      logType,
    })
  }

  if (status === MAINTENANCE.ON) {
    throw new ScreenError('Under maintenance', {
      Screen: MaintenanceErrorPage,
      logType,
    })
  }

  return children ? <React.Fragment>{children}</React.Fragment> : null
}
