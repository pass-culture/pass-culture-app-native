import React from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'

export const reactQueryProviderHOC = (component: React.ReactNode) => {
  const queryClient = new QueryClient({ cache: new QueryCache() })
  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
