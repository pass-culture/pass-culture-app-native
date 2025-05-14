import React from 'react'
import { QueryCache, QueryClient, QueryClientProvider, setLogger } from 'react-query'

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
      },
    },
  })
  if (setup) setup(queryClient)
  setLogger({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  })
  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
