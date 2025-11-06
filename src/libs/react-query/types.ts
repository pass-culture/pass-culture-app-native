import { QueryKey, UseQueryOptions } from '@tanstack/react-query'

export type CustomQueryOptions<
  TQueryFnData = unknown,
  TSelect = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFnData, Error, TSelect, TQueryKey>, 'queryKey' | 'queryFn'>
