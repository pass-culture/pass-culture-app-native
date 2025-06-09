import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

import { PLACEHOLDER_DATA } from './placeholderData'

const STALE_TIME_SUBCATEGORIES = 5 * 60 * 1000

export const useSubcategories = () => {
  return useQuery<SubcategoriesResponseModelv2>(
    [QueryKeys.SUBCATEGORIES],
    () => api.getNativeV1SubcategoriesV2(),
    {
      staleTime: STALE_TIME_SUBCATEGORIES,
      placeholderData: PLACEHOLDER_DATA,
    }
  )
}
