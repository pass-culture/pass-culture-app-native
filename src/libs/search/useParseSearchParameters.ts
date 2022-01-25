import { useCallback } from 'react'

import { SearchParametersFields } from 'features/home/contentful'
import { SearchState } from 'features/search/types'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { useGeolocation } from 'libs/geolocation'
import { parseSearchParameters } from 'libs/search/parseSearchParameters'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'

export const useParseSearchParameters = () => {
  const { position } = useGeolocation()
  const priceMax = useMaxPrice()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()

  return useCallback(
    (parameters: SearchParametersFields): Partial<SearchState> | undefined =>
      parseSearchParameters(
        { ...parameters, priceMin: 0, priceMax },
        position,
        subcategoryLabelMapping
      ),
    [!position, priceMax, subcategoryLabelMapping]
  )
}
