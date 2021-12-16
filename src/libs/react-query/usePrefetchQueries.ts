import { useEffect } from 'react'

import { api } from 'api/api'
import { getEntries } from 'features/home/api'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

export const usePrefetchQueries = () => {
  useEffect(() => {
    try {
      queryClient.prefetchQuery(QueryKeys.HOMEPAGE_MODULES, getEntries)
      queryClient.prefetchQuery(QueryKeys.SETTINGS, () => api.getnativev1settings())
    } catch (err) {
      // do nothing in case the pretching of queries fails
    }
  }, [])
}
