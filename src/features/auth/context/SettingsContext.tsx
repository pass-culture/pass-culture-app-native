import React, { memo, useContext, useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'

import { api } from 'api/api'
import { SettingsResponse } from 'api/gen'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

interface ISettingsContext {
  data: UseQueryResult<SettingsResponse, unknown>['data']
  isLoading: UseQueryResult<SettingsResponse, unknown>['isLoading']
}

const SettingsContext = React.createContext<ISettingsContext>({
  data: undefined,
  isLoading: false,
})

export function useSettingsContext(): ISettingsContext {
  return useContext(SettingsContext)
}

export const SettingsWrapper = memo(function SettingsWrapper({
  children,
}: {
  children: JSX.Element
}) {
  const { data, isLoading } = useAppSettings()

  const value = useMemo(() => ({ data, isLoading }), [data, isLoading])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
})

// arbitrary. Should not change that often though
const STALE_TIME_APP_SETTINGS = 5 * 60 * 1000

function useAppSettings() {
  const netInfo = useNetInfoContext()
  return useQuery<SettingsResponse>([QueryKeys.SETTINGS], () => api.getnativev1settings(), {
    enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable,
    staleTime: STALE_TIME_APP_SETTINGS,
  })
}
