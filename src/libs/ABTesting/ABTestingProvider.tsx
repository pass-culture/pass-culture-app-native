import React, { memo, createContext, useContext, useEffect, useState } from 'react'

import { DEFAULT_REMOTE_CONFIG } from './ABTesting.constants'
import { abTesting } from './ABTesting.services'
import { CustomRemoteConfig } from './ABTesting.types'

const Context = createContext<CustomRemoteConfig>(DEFAULT_REMOTE_CONFIG)

export function useABTestingContext() {
  return useContext<CustomRemoteConfig>(Context)
}

export const ABTestingProvider = memo(function ABTestingProvider(props: { children: JSX.Element }) {
  const [contextValue, setContextValue] = useState<CustomRemoteConfig>(DEFAULT_REMOTE_CONFIG)

  useEffect(() => {
    abTesting
      .configure()
      .then(async () => {
        const isNewConfigRetrieved = await abTesting.refresh()
        if (isNewConfigRetrieved) {
          const abTestingParams = abTesting.getValues()
          setContextValue(abTestingParams)
        }
      })
      .catch(() => {
        // We do nothing if this call fails as we don't even use remote config
      })
  }, [])

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>
})
