import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import { queryClient } from 'libs/react-query/queryClient'
import { usePrefetchQueries } from 'libs/react-query/usePrefetchQueries'

export const ReactQueryClientProvider = ({ children }: { children: React.JSX.Element }) => {
  usePrefetchQueries()

  // @ts-ignore - type incompatibility with React 19
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
