import { notifyManager } from '@tanstack/query-core'
import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { batch } from 'solid-js'

export const queryCache = new QueryCache()
export const mutationCache = new MutationCache()

export const reactQueryProviderHOC = (
  component: React.ReactNode,
  setup?: (queryClient: QueryClient) => void
) => {
  // Configure React Query to batch updates with `act` in tests
  notifyManager.setBatchNotifyFunction(batch)

  const queryClient = new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
      queries: {
        retry: false, // react-query documentation recommends to disable retry when testing https://tanstack.com/query/v3/docs/framework/react/guides/testing#turn-off-retries
        cacheTime: Infinity, // react-query documentation recommends to disable cache when testing https://tanstack.com/query/v3/docs/framework/react/guides/testing#set-cachetime-to-infinity-with-jest
      },
    },
    logger: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  })

  if (setup) setup(queryClient)

  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
