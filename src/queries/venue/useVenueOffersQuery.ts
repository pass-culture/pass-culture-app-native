import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback } from 'react'

import { VenueResponse } from 'api/gen'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState } from 'features/search/types'
import { VenueOffers } from 'features/venue/types'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { AlgoliaOffer, HitOffer, SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { selectVenueOffers } from 'queries/selectors/selectVenueOffers'

type UseVenueOffersParams = {
  userLocation: Position
  selectedLocationMode: LocationMode
  isUserUnderage: boolean
  venueSearchParams: SearchState
  searchState: SearchState
  transformHits: (hit: AlgoliaOffer<HitOffer>) => AlgoliaOffer<HitOffer>
  venue?: Omit<VenueResponse, 'isVirtual'>
  includeHitsWithoutImage?: boolean
  mapping?: SubcategoriesMapping
}

export const useVenueOffersQuery = ({
  userLocation,
  selectedLocationMode,
  isUserUnderage,
  venueSearchParams,
  searchState,
  transformHits,
  venue,
  includeHitsWithoutImage,
  mapping,
}: UseVenueOffersParams): UseQueryResult<VenueOffers> => {
  const buildVenueOffersQueryParams = useCallback(
    (offerParams: SearchQueryParameters) => ({
      locationParams: {
        userLocation,
        selectedLocationMode,
        aroundMeRadius: MAX_RADIUS,
        aroundPlaceRadius: MAX_RADIUS,
      },
      offerParams,
    }),
    [userLocation, selectedLocationMode]
  )

  const venueSearchedOffersQueryParams = {
    ...buildVenueOffersQueryParams({
      ...searchState,
      venue: venueSearchParams.venue,
      hitsPerPage: venueSearchParams.hitsPerPage,
    }),
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
  }
  const venueTopOffersQueryParams = {
    ...buildVenueOffersQueryParams(venueSearchParams),
    indexName: env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
  }
  const headlineOfferQueryParams = {
    ...buildVenueOffersQueryParams({ ...venueSearchParams, isHeadline: true }),
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
  }

  return useQuery({
    queryKey: [QueryKeys.VENUE_OFFERS, venue?.id, userLocation, selectedLocationMode],

    queryFn: () =>
      fetchMultipleOffers({
        paramsList: [
          venueSearchedOffersQueryParams,
          venueTopOffersQueryParams,
          headlineOfferQueryParams,
        ],
        isUserUnderage,
      }),

    enabled: !!venue,

    select: ([venueSearchedOffersResults, venueTopOffersResults, headlineOfferResults]) =>
      selectVenueOffers({
        venueOffers: [venueSearchedOffersResults, venueTopOffersResults, headlineOfferResults],
        transformHits,
        includeHitsWithoutImage,
        mapping,
      }),
  })
}
