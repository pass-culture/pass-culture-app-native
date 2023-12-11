import { useCallback } from 'react'

import { OffersModuleParameters } from 'features/home/types'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { adaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/adaptOffersPlaylistParameters'
import { AlgoliaLocationFilter, SearchQueryParameters } from 'libs/algolia/types'
import { useGenreTypeMapping, useSubcategoryLabelMapping } from 'libs/subcategories/mappings'

export const useAdaptOffersPlaylistParameters = (locationFilter: AlgoliaLocationFilter) => {
  const defaultPriceMax = useMaxPrice()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  const genreTypeMapping = useGenreTypeMapping()
  return useCallback(
    (parameters: OffersModuleParameters): SearchQueryParameters | undefined =>
      adaptOffersPlaylistParameters(
        { ...parameters, priceMax: parameters.priceMax ?? defaultPriceMax },
        subcategoryLabelMapping,
        genreTypeMapping,
        locationFilter
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultPriceMax, subcategoryLabelMapping]
  )
}
