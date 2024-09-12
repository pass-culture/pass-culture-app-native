import { useQuery } from 'react-query'

import { api } from 'api/api'
import { CategoriesResponseModel } from 'api/gen'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

import { CATEGORY_TREE_PLACE_HOLDER } from './placeholderData'

const STALE_TIME_CATEGORIES = 5 * 60 * 1000

export const useCategories = () => {
  const netInfo = useNetInfoContext()
  return useQuery<CategoriesResponseModel>(
    [QueryKeys.CATEGORIES],
    () => api.getNativeV1Categories(),
    {
      staleTime: STALE_TIME_CATEGORIES,
      placeholderData: CATEGORY_TREE_PLACE_HOLDER,
      enabled: !!netInfo.isConnected,
    }
  )
}
