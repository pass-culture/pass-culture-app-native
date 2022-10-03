import React, { memo, createContext, useContext, useEffect, useState } from 'react'

import { DEFAULT_REMOTE_CONFIG } from './remoteConfig.constants'
import { remoteConfig } from './remoteConfig.services'
import { CustomRemoteConfig } from './remoteConfig.types'

const Context = createContext<CustomRemoteConfig>(DEFAULT_REMOTE_CONFIG)

export function useRemoteConfigContext() {
  return useContext<CustomRemoteConfig>(Context)
}

export const RemoteConfigProvider = memo(function RemoteConfigProvider(props: {
  children: JSX.Element
}) {
  const [contextValue, setContextValue] = useState<CustomRemoteConfig>(DEFAULT_REMOTE_CONFIG)
  useEffect(() => {
    remoteConfig
      .refresh()
      .then(() => {
        const remoteConfigParams = remoteConfig.getValues()
        setContextValue(remoteConfigParams)
      })
      .catch(() => {
        console.error('Failed to retrieve firebase remote config')
      })
  }, [])

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>
})
