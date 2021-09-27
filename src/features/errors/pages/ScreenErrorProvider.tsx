import React from 'react'

import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { useMustUpdateApp } from 'features/forceUpdate/useMustUpdateApp'
import { Maintenance } from 'features/maintenance/Maintenance'
import { useIsUnderMaintenance } from 'features/maintenance/useMaintenance'
import { ScreenError } from 'libs/monitoring/errors'

export const ScreenErrorProvider = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
  const isUnderMaintenance = useIsUnderMaintenance()
  const mustUpdateApp = useMustUpdateApp()

  if (mustUpdateApp) {
    throw new ScreenError('Must update app', ForceUpdate)
  }

  if (isUnderMaintenance) {
    throw new ScreenError('Under maintenance', Maintenance)
  }

  return children ? <React.Fragment>{children}</React.Fragment> : null
}
