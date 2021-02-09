import React from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'

export const queryCache = new QueryCache()

export const reactQueryProviderHOC = (
  component: React.ReactNode,
  setup?: (queryClient: QueryClient) => void
) => {
  const queryClient = new QueryClient({ queryCache })
  if (setup) setup(queryClient)
  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
