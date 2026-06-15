import { QueryCache, QueryClient } from '@tanstack/react-query'

import { env } from 'libs/environment/env'
import { isServerError } from 'shared/isServerError/isServerError'

const queryCache = new QueryCache()
// Read https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: 0,
      throwOnError: (error) => !isServerError(error),
      refetchOnWindowFocus: !(__DEV__ || env.ENV !== 'testing'),
    },
  },
})
