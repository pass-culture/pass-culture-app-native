import { notifyManager } from '@tanstack/query-core'
import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export const queryCache = new QueryCache()
export const mutationCache = new MutationCache()

export const reactQueryProviderHOC = (
  component: React.ReactNode,
  setup?: (queryClient: QueryClient) => void
) => {
  // Configure React Query to batch updates with `act` in tests - can be suppressed with v5
  const batchNotifyFunctionMock = (fn: () => void) => fn()
  notifyManager.setBatchNotifyFunction(batchNotifyFunctionMock)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // react-query documentation recommends to disable retry when testing https://tanstack.com/query/v3/docs/framework/react/guides/testing#turn-off-retries
        cacheTime: Infinity, // react-query documentation recommends to disable cache when testing https://tanstack.com/query/v3/docs/framework/react/guides/testing#set-cachetime-to-infinity-with-jest
      },
    },
    queryCache,
    mutationCache,
    logger: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  })

  if (setup) setup(queryClient)

  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
