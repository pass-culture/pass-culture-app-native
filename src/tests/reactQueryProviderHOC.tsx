import React from 'react'
import { QueryCache, QueryClient, QueryClientProvider, setLogger } from 'react-query'

export const queryCache = new QueryCache()

export const reactQueryProviderHOC = (
  component: React.ReactNode,
  setup?: (queryClient: QueryClient) => void
) => {
  const queryClient = new QueryClient({ queryCache })
  if (setup) setup(queryClient)
  setLogger({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  })
  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
