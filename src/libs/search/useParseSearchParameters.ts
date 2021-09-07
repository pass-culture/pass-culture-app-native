import { useCallback } from 'react'

import { SearchParametersFields } from 'features/home/contentful'
import { SearchState } from 'features/search/types'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { useGeolocation } from 'libs/geolocation'
import { parseSearchParameters } from 'libs/search/parseSearchParameters'

export const useParseSearchParameters = () => {
  const availableCategories = useAvailableCategories()
  const { position } = useGeolocation()

  return useCallback(
    (parameters: SearchParametersFields): Partial<SearchState> | undefined =>
      parseSearchParameters(parameters, position, availableCategories),
    [availableCategories]
  )
}
