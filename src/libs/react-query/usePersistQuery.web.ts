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
  // eslint-disable-next-line local-rules/no-queries-outside-query-files, local-rules/queries-only-in-use-query-functions
) => useQuery({ queryKey, queryFn, ...options })

export { useQueryWeb as usePersistQuery }
