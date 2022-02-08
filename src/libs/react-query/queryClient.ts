import { QueryCache, QueryClient } from 'react-query'

import { saveQueryClient } from 'libs/react-query/persistor'

// Read https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query
export const GLOBAL_STALE_TIME = 1000 * 60 * 60 * 24 // 24 hours

const queryCache = new QueryCache()
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: 0,
      useErrorBoundary: true,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: GLOBAL_STALE_TIME,
    },
  },
})

saveQueryClient(queryClient)
