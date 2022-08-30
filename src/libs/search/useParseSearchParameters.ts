import { useCallback } from 'react'

import { SearchParametersFields } from 'features/home/contentful'
import { SearchState } from 'features/search/types'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
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
