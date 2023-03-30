import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

import { placeholderData } from './placeholderData'

const STALE_TIME_SUBCATEGORIES = 5 * 60 * 1000

export const useSubcategories = () => {
  const netInfo = useNetInfoContext()
  return useQuery<SubcategoriesResponseModelv2>(
    [QueryKeys.SUBCATEGORIES],
    () => api.getnativev1subcategoriesv2(),
    { staleTime: STALE_TIME_SUBCATEGORIES, placeholderData, enabled: !!netInfo.isConnected }
  )
}
