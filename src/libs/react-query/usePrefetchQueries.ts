import { useEffect } from 'react'

import { api } from 'api/api'
import { GetHomeData } from 'features/home/api/useHomepageData'
import { useDependencies } from 'libs/dependencies/DependenciesContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

const prefetchQueries = async (getHomeData: GetHomeData) => {
  try {
    await queryClient.prefetchQuery([QueryKeys.HOMEPAGE_MODULES], getHomeData)
    await queryClient.prefetchQuery([QueryKeys.SETTINGS], () => api.getNativeV1Settings())
  } catch (err) {
    // do nothing in case the pretching of queries fails
  }
}

export const usePrefetchQueries = () => {
  const { isConnected } = useNetInfoContext()
  const { getHomeData } = useDependencies()
  useEffect(() => {
    if (isConnected) {
      prefetchQueries(getHomeData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])
}
