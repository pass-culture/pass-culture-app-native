import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query'

export type CustomQueryOptions<
  TQueryFnData = unknown,
  TSelect = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFnData, Error, TSelect, TQueryKey>, 'queryKey' | 'queryFn'>

export type CustomInfiniteQueryOptions<
  TQueryFnData = unknown,
  TSelect = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number,
> = Omit<
  UseInfiniteQueryOptions<TQueryFnData, Error, TSelect, TQueryKey, TPageParam>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>
