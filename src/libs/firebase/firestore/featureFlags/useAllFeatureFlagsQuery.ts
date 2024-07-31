import { useQuery, UseQueryOptions } from 'react-query'

import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { QueryKeys } from 'libs/queryKeys'

export const useAllFeatureFlagsQuery = (
  options?: Pick<UseQueryOptions, 'staleTime' | 'cacheTime'>
) =>
  useQuery(QueryKeys.FEATURE_FLAGS, getAllFeatureFlags, {
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  })
