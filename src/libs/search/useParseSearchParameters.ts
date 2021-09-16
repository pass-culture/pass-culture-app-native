import { useCallback } from 'react'

import { SearchParametersFields } from 'features/home/contentful'
import { OptionalCategoryCriteria } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { useGeolocation } from 'libs/geolocation'
import { parseSearchParameters } from 'libs/search/parseSearchParameters'
import { filterAvailableCategories } from 'libs/search/utils/filterAvailableCategories'

const buildNewSearchParameters = (
  params: SearchParametersFields,
  availableCategories: OptionalCategoryCriteria
): SearchParametersFields => {
  return {
    ...params,
    categories: filterAvailableCategories(params.categories || [], availableCategories),
  }
}

export const useParseSearchParameters = () => {
  const availableCategories = useAvailableCategories()
  const { position } = useGeolocation()

  return useCallback(
    (parameters: SearchParametersFields): Partial<SearchState> | undefined => {
      const newParameters = buildNewSearchParameters(parameters, availableCategories)
      return parseSearchParameters(newParameters, position)
    },
    [availableCategories, !position]
  )
}
