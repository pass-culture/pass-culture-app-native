import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SubcategoriesResponseModel } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

import subcategories from './subcategories.json'

const STALE_TIME_SUBCATEGORIES = 5 * 60 * 1000

export const useSubcategories = () =>
  useQuery<SubcategoriesResponseModel>(QueryKeys.SUBCATEGORIES, api.getnativev1subcategories, {
    staleTime: STALE_TIME_SUBCATEGORIES,
    placeholderData: subcategories as SubcategoriesResponseModel,
  })
