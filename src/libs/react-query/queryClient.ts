import { QueryCache, QueryClient } from '@tanstack/react-query'
// every query is considered stale once it's triggered. As a result,
// every time we consult an offer, the request will be made to the server
// this allows us to have a direct feedback when changing home playlist for instance
// the tradeoff is that more requests are made to the server
export const GLOBAL_STALE_TIME = 1000 * 60 * 60 * 24 // 24 hours

const queryCache = new QueryCache()
// Read https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: 0,
      useErrorBoundary: true,
    },
  },
})
