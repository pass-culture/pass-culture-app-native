import { useEffect } from 'react'

import { api } from 'api/api'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

const prefetchQueries = async () => {
  try {
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.SETTINGS],
      queryFn: () => api.getNativeV1Settings(),
    })
  } catch (err) {
    // do nothing in case the pretching of queries fails
  }
}

export const usePrefetchQueries = () => {
  const { isConnected } = useNetInfoContext()
  useEffect(() => {
    if (isConnected) prefetchQueries()
  }, [isConnected])
}
