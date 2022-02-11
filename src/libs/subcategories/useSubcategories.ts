import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SubcategoriesResponseModel } from 'api/gen'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'

import { placeholderData } from './placeholderData'

export const useSubcategories = () => {
  const { isConnected } = useNetwork()

  return useQuery<SubcategoriesResponseModel>(
    QueryKeys.SUBCATEGORIES,
    () => api.getnativev1subcategories(),
    { enabled: isConnected, placeholderData }
  )
}
