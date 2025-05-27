import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export const queryCache = new QueryCache()

export const reactQueryProviderHOC = (
  component: React.ReactNode,
  setup?: (queryClient: QueryClient) => void
) => {
  const queryClient = new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        retry: false, // react-query documentation recommends to disable retry when testing https://tanstack.com/query/v3/docs/framework/react/guides/testing#turn-off-retries
        cacheTime: Infinity, // react-query documentation recommends to disable cache when testing https://tanstack.com/query/v3/docs/framework/react/guides/testing#set-cachetime-to-infinity-with-jest
      },
    },
  })
  if (setup) setup(queryClient)

  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
