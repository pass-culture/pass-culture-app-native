import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const flakyReactQueryProviderHOC = (component: React.ReactNode) => {
  const queryClient = new QueryClient()

  return <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
}
