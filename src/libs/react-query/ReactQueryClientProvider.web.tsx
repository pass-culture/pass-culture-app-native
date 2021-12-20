import React from 'react'
import { QueryClientProvider } from 'react-query'

import { queryClient } from 'libs/react-query/queryClient'

export const ReactQueryClientProvider = ({ children }: { children: JSX.Element }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
