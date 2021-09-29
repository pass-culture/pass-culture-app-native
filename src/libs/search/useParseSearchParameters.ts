import { useCallback } from 'react'

import { SearchParametersFields } from 'features/home/contentful'
import { CategoryCriteria } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { useGeolocation } from 'libs/geolocation'
import { parseSearchParameters } from 'libs/search/parseSearchParameters'
import { filterAvailableCategories } from 'libs/search/utils'

const buildNewSearchParameters = (
  params: SearchState,
  availableCategories: Partial<CategoryCriteria>
): SearchState => ({
  ...params,
  offerCategories: filterAvailableCategories(params.offerCategories, availableCategories),
})

export const useParseSearchParameters = () => {
  const availableCategories = useAvailableCategories()
  const { position } = useGeolocation()

  return useCallback(
    (parameters: SearchParametersFields): Partial<SearchState> | undefined => {
      const searchState = parseSearchParameters(parameters, position)
      return searchState ? buildNewSearchParameters(searchState, availableCategories) : undefined
    },
    [availableCategories, !position]
  )
}
