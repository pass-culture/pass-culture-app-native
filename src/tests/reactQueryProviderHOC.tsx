import React from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'

export const queryCache = new QueryCache()

export const reactQueryProviderHOC = (component: React.ReactNode) => {
  const queryClient = new QueryClient({ cache: queryCache })
  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
