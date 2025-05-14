import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from 'libs/react-query/queryClient'
import { usePrefetchQueries } from 'libs/react-query/usePrefetchQueries'

export const ReactQueryClientProvider = ({ children }: { children: React.JSX.Element }) => {
  usePrefetchQueries()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
