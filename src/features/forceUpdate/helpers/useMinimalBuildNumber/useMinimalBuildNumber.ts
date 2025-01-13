import { onlineManager, useQuery } from 'react-query'

import { getMinimalBuildNumber } from 'libs/firebase/firestore/getMinimalBuildNumber/getMinimalBuildNumber'

export const useMinimalBuildNumber = () => {
  const { data: minimalBuildNumber } = useQuery('MINIMAL_BUILD_NUMBER', getMinimalBuildNumber, {
    staleTime: 1000 * 30,
    enabled: onlineManager.isOnline(),
  })

  return minimalBuildNumber
}
