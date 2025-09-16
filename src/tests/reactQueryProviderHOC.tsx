import { QueryCache, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export const queryCache = new QueryCache()
export const mutationCache = new MutationCache()

export const reactQueryProviderHOC = (
  component: React.ReactNode,
  setup?: (queryClient: QueryClient) => void
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // react-query documentation recommends to disable retry when testing https://tanstack.com/query/v3/docs/framework/react/guides/testing#turn-off-retries
        gcTime: Infinity, // react-query documentation recommends to disable cache when testing https://tanstack.com/query/v3/docs/framework/react/guides/testing#set-cachetime-to-infinity-with-jest
      },
    },
    queryCache,
    mutationCache,
  })

  if (setup) setup(queryClient)

  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
