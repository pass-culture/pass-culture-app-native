import { useCallback } from 'react'

import { SearchParametersFields } from 'features/home/contentful'
import { OptionalCategoryCriteria } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { useGeolocation } from 'libs/geolocation'
import { parseSearchParameters } from 'libs/search/parseSearchParameters'
import { filterAvailableCategories, getCategoriesFacetFilters } from 'libs/search/utils'

const buildNewSearchParameters = (
  params: SearchParametersFields,
  availableCategories: OptionalCategoryCriteria
): SearchParametersFields => {
  const { categories: categoryLabels = [], ...otherParams } = params
  // We receive category labels from contentful. We first have to map to facetFilters used for search
  const facetFilters = categoryLabels.map(getCategoriesFacetFilters)
  const categories = filterAvailableCategories(facetFilters, availableCategories)
  return { ...otherParams, categories }
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
