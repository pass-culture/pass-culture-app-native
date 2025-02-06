import { onlineManager, useQuery } from 'react-query'

import { getMinimalBuildNumber } from 'libs/firebase/firestore/getMinimalBuildNumber/getMinimalBuildNumber'
import { QueryKeys } from 'libs/queryKeys'

export const useMinimalBuildNumber = () => {
  const { data: minimalBuildNumber } = useQuery(
    QueryKeys.MINIMAL_BUILD_NUMBER,
    getMinimalBuildNumber,
    {
      staleTime: 1000 * 30,
      cacheTime: 1000 * 30,
      enabled: onlineManager.isOnline(),
    }
  )

  return minimalBuildNumber
}
