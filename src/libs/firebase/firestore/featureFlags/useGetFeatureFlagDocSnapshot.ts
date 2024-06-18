import { useQuery } from 'react-query'

import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { QueryKeys } from 'libs/queryKeys'

export const useGetFeatureFlagDocSnapshot = () => {
  const { data: docSnapshot } = useQuery(QueryKeys.FEATURE_FLAGS, getAllFeatureFlags, {
    staleTime: 1000 * 30, // 30 seconds
  })

  return docSnapshot
}
