import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useMemo, useState } from 'react'
import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query'
import { QueryFunction } from 'react-query/types/core/types'

import { eventMonitoring } from 'libs/monitoring/services'

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
          eventMonitoring.captureException(error, { extra: { queryKey } })
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
        eventMonitoring.captureException(error, { extra: { queryKey, data: query.data } })
      })
    }
  }, [query.data, query.isLoading, queryKey])
}

type UsePersistQueryResult<TData, TError> = UseQueryResult<TData, TError> & {
  isOfflineData?: boolean
}

export function usePersistQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'initialData'
  >
): UsePersistQueryResult<TData, TError> {
  const persistData = useGetPersistData(queryKey)

  const query = useQuery(queryKey, queryFn, {
    ...options,
    enabled: options?.enabled,
  })

  const persistQuery = useMemo<UsePersistQueryResult<TData, TError>>(
    () =>
      persistData
        ? ({
            ...query,
            // @ts-ignore useQuery select options does not offer to pass typing to useQuery, cast should happen within passed selected
            data: options?.select ? options.select(persistData as any) : persistData, // eslint-disable-line @typescript-eslint/no-explicit-any
            isOfflineData: true,
          } as UsePersistQueryResult<TData, TError>)
        : query,
    [persistData, query, options]
  )

  useSetPersistQuery(query, queryKey)

  return !query.data && persistData ? persistQuery : query
}
