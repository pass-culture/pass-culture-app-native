import { useEffect } from 'react'

import { api } from 'api/api'
import { fetchHomepageNatifContent } from 'features/home/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

const prefetchQueries = async () => {
  try {
    await queryClient.prefetchQuery(QueryKeys.HOMEPAGE_MODULES, fetchHomepageNatifContent)
    await queryClient.prefetchQuery(QueryKeys.SETTINGS, () => api.getnativev1settings())
  } catch (err) {
    // do nothing in case the pretching of queries fails
  }
}

export const usePrefetchQueries = () => {
  const { isConnected } = useNetInfoContext()
  useEffect(() => {
    if (isConnected) {
      prefetchQueries()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])
}
