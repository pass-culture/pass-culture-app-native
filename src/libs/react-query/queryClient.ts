import { QueryCache, QueryClient } from 'react-query'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'

import { persistor } from 'libs/react-query/persistor'

import { build } from '../../../package.json'

const queryCache = new QueryCache()
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: 0,
      useErrorBoundary: true,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

persistQueryClient({
  queryClient,
  persistor,
  buster: build.toString(),
})
