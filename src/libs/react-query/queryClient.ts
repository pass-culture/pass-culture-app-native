import { QueryCache, QueryClient } from '@tanstack/react-query'

const queryCache = new QueryCache()
// Read https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: 0,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
})
