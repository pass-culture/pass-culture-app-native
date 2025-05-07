import { DefaultOptions, QueryCache, QueryClient } from 'react-query'

const queryCache = new QueryCache()

export const defaultOptions: DefaultOptions<unknown> = {
  queries: {
    retry: 0,
    useErrorBoundary: true,
  },
}

// Read https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions,
})
