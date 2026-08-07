import React, { useEffect, useState } from 'react'

import {
  applyEnvironmentOverride,
  isEnvironmentSwitchAvailable,
} from 'libs/environment/envOverride/envOverride'

export const EnvironmentOverrideBootGate = ({
  children,
}: {
  children: React.JSX.Element
}): React.JSX.Element | null => {
  const [isEnvironmentReady, setIsEnvironmentReady] = useState(
    () => !isEnvironmentSwitchAvailable()
  )

  useEffect(() => {
    if (isEnvironmentSwitchAvailable()) {
      void applyEnvironmentOverride().then(() => setIsEnvironmentReady(true))
    }
  }, [])

  return isEnvironmentReady ? children : null
}
