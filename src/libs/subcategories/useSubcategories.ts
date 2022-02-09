import { useNetInfo } from '@react-native-community/netinfo'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SubcategoriesResponseModel } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

import { placeholderData } from './placeholderData'

export const useSubcategories = () => {
  const networkInfo = useNetInfo()

  return useQuery<SubcategoriesResponseModel>(
    QueryKeys.SUBCATEGORIES,
    () => api.getnativev1subcategories(),
    { enabled: networkInfo.isConnected, placeholderData }
  )
}
