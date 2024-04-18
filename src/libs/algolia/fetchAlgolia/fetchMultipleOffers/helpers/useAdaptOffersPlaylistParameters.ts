import { useCallback } from 'react'

import { PlaylistOffersParams, OffersModuleParameters } from 'features/home/types'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { adaptOffersPlaylistLocationParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/adaptOffersPlaylistLocationParameters'
import { adaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/adaptOffersPlaylistParameters'
import { useLocation } from 'libs/location'
import { useGenreTypeMapping, useSubcategoryLabelMapping } from 'libs/subcategories/mappings'

export const useAdaptOffersPlaylistParameters = () => {
  const defaultPriceMax = useMaxPrice()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()
  const genreTypeMapping = useGenreTypeMapping()
  const { userLocation } = useLocation()

  return useCallback(
    (parameters: OffersModuleParameters): PlaylistOffersParams => {
      const offersAdaptedParams = adaptOffersPlaylistParameters(
        { ...parameters, priceMax: parameters.priceMax ?? defaultPriceMax },
        subcategoryLabelMapping,
        genreTypeMapping
      )

      const offersLocationAdaptedParams = adaptOffersPlaylistLocationParameters(
        parameters,
        userLocation
      )

      return {
        offerParams: offersAdaptedParams,
        locationParams: offersLocationAdaptedParams,
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultPriceMax, subcategoryLabelMapping, userLocation]
  )
}
