import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMemo, useState, useEffect } from 'react'
import { useQuery, UseQueryOptions, UseQueryResult, QueryKey } from 'react-query'
import { QueryFunction } from 'react-query/types/core/types'

import { eventMonitoring } from 'libs/monitoring'
import { useNetInfo } from 'libs/network/useNetInfo'

export type UsePersistQuery<TData, TError> = UseQueryResult<TData, TError> & {
  isOfflineData?: boolean
}

export function usePersistQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>
): UsePersistQuery<TData, TError> {
  const netInfo = useNetInfo()
  const [persistData, setPersistData] = useState<TData | undefined>()

  useEffect(() => {
    if (!persistData) {
      AsyncStorage.getItem(String(queryKey))
        .then((cachedDataStr) => {
          if (cachedDataStr) {
            setPersistData(JSON.parse(cachedDataStr))
          }
        })
        .catch((error) => {
          eventMonitoring.captureException(error, { context: { queryKey } })
        })
    }
  }, [persistData, queryKey])

  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>(queryKey, queryFn, {
    ...options,
    enabled:
      options?.enabled !== undefined
        ? options.enabled && !!netInfo.isConnected
        : !!netInfo.isConnected,
  })

  const persistQuery = useMemo<UsePersistQuery<TData, TError>>(() => {
    if (persistData) {
      return { ...query, data: persistData, isOfflineData: true } as UsePersistQuery<TData, TError>
    }
    return query
  }, [persistData, query])

  useEffect(() => {
    if (!query.isLoading && query.data) {
      AsyncStorage.setItem(String(queryKey), JSON.stringify(query.data)).catch((error) => {
        eventMonitoring.captureException(error, { context: { queryKey, data: query.data } })
      })
    }
  }, [query.data, query.isLoading, queryKey])

  if (!query.data && persistData) {
    return persistQuery
  }
  return query
}
