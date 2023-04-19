import { useCallback } from 'react'

import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { OffersModuleParameters } from 'features/home/types'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
import { adaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/adaptOffersPlaylistParameters'
import { useGenreTypeMapping, useSubcategoryLabelMapping } from 'libs/subcategories/mappings'

export const useAdaptOffersPlaylistParameters = () => {
  const { position } = useHomePosition()
  const defaultPriceMax = useMaxPrice()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  const genreTypeMapping = useGenreTypeMapping()

  return useCallback(
    (parameters: OffersModuleParameters): Partial<SearchState> | undefined =>
      adaptOffersPlaylistParameters(
        { ...parameters, priceMin: 0, priceMax: parameters.priceMax ?? defaultPriceMax },
        position,
        subcategoryLabelMapping,
        genreTypeMapping
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [!position, defaultPriceMax, subcategoryLabelMapping]
  )
}
