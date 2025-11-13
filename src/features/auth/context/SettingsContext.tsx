import { UseQueryResult } from '@tanstack/react-query'
import React, { memo, useContext, useMemo } from 'react'

import { SettingsResponse } from 'api/gen'
import { useAppSettingsQuery } from 'features/auth/queries/useAppSettingsQuery'

export interface ISettingsContext {
  data: UseQueryResult<SettingsResponse>['data']
  isLoading: UseQueryResult<SettingsResponse>['isLoading']
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
  children: React.JSX.Element
}) {
  const { data, isLoading } = useAppSettingsQuery()

  const value = useMemo(() => ({ data, isLoading }), [data, isLoading])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
})
