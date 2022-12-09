import { useCallback } from 'react'

import { SearchParametersFields } from 'libs/contentful'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
import { useGeolocation } from 'libs/geolocation'
import { parseSearchParameters } from 'libs/search/parseSearchParameters'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'

export const useParseSearchParameters = () => {
  const { position } = useGeolocation()
  const defaultPriceMax = useMaxPrice()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()

  return useCallback(
    (parameters: SearchParametersFields): Partial<SearchState> | undefined =>
      parseSearchParameters(
        { ...parameters, priceMin: 0, priceMax: parameters.priceMax ?? defaultPriceMax },
        position,
        subcategoryLabelMapping
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [!position, defaultPriceMax, subcategoryLabelMapping]
  )
}
