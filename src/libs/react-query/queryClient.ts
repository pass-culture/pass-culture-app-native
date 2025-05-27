import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

const queryCache = new QueryCache()
const mutationCache = new MutationCache()
// Read https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      retry: 0,
      useErrorBoundary: true,
    },
  },
})
