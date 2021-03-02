import React, { createContext, useContext, useEffect, useState } from 'react'

import { DEFAULT_REMOTE_CONFIG } from './ABTesting.constants'
import { abTesting } from './ABTesting.services'
import { CustomRemoteConfig } from './ABTesting.types'

const Context = createContext<CustomRemoteConfig>(DEFAULT_REMOTE_CONFIG)

export function useABTestingContext() {
  return useContext<CustomRemoteConfig>(Context)
}

export function ABTestingProvider(props: { children: Element }) {
  const [contextValue, setContextValue] = useState<CustomRemoteConfig>(DEFAULT_REMOTE_CONFIG)

  useEffect(() => {
    abTesting.configure().then(async () => {
      const isNewConfigRetrieved = await abTesting.refresh()
      if (isNewConfigRetrieved) {
        const abTestingParams = abTesting.getValues()
        setContextValue(abTestingParams)
      }
    })
  }, [])

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>
}
