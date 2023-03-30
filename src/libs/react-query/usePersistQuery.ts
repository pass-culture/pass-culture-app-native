import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMemo, useState, useEffect } from 'react'
import { useQuery, UseQueryOptions, UseQueryResult, QueryKey } from 'react-query'
import { QueryFunction } from 'react-query/types/core/types'

import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'

function useGetPersistData<TData, TQueryKey>(queryKey: TQueryKey) {
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
  return persistData
}

function useSetPersistQuery<TData, TError, TQueryKey>(
  query: UseQueryResult<TData, TError>,
  queryKey: TQueryKey
) {
  useEffect(() => {
    if (!query.isLoading && query.data) {
      AsyncStorage.setItem(String(queryKey), JSON.stringify(query.data)).catch((error) => {
        eventMonitoring.captureException(error, { context: { queryKey, data: query.data } })
      })
    }
  }, [query.data, query.isLoading, queryKey])
}

export type UsePersistQueryResult<TData, TError> = UseQueryResult<TData, TError> & {
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
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'initialData'
  >
): UsePersistQueryResult<TData, TError> {
  const netInfo = useNetInfoContext()
  const persistData = useGetPersistData(queryKey)

  const query = useQuery(queryKey, queryFn, {
    ...options,
    enabled:
      options?.enabled !== undefined
        ? options.enabled && !!netInfo.isConnected
        : !!netInfo.isConnected,
  })

  const persistQuery = useMemo<UsePersistQueryResult<TData, TError>>(
    () =>
      !persistData
        ? query
        : ({
            ...query,
            // @ts-ignore useQuery select options does not offer to pass typing to useQuery, cast should happen within passed selected
            data: options?.select ? options.select(persistData as any) : persistData, // eslint-disable-line @typescript-eslint/no-explicit-any
            isOfflineData: true,
          } as UsePersistQueryResult<TData, TError>),
    [persistData, query, options]
  )

  useSetPersistQuery(query, queryKey)

  return !query.data && persistData ? persistQuery : query
}
