import { useCallback } from 'react'

import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { OffersModuleParameters } from 'features/home/types'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { adaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/adaptOffersPlaylistParameters'
import { SearchQueryParameters } from 'libs/algolia/types'
import { useGenreTypeMapping, useSubcategoryLabelMapping } from 'libs/subcategories/mappings'

export const useAdaptOffersPlaylistParameters = () => {
  const { position } = useHomePosition()
  const defaultPriceMax = useMaxPrice()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  const genreTypeMapping = useGenreTypeMapping()

  return useCallback(
    (parameters: OffersModuleParameters): SearchQueryParameters | undefined =>
      adaptOffersPlaylistParameters(
        { ...parameters, priceMax: parameters.priceMax ?? defaultPriceMax },
        position,
        subcategoryLabelMapping,
        genreTypeMapping
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [!position, defaultPriceMax, subcategoryLabelMapping]
  )
}
