import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'

const useQueryWeb = <
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'initialData'
  >
) => useQuery({ queryKey, queryFn, ...options })

export { useQueryWeb as usePersistQuery }
