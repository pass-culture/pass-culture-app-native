import { uniqBy } from 'lodash'
import { useCallback } from 'react'
import { useQuery, UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState } from 'features/search/types'
import { VenueOffers } from 'features/venue/types'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import {
  filterOfferHitWithImage,
  filterValidOfferHit,
} from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOffer, HitOffer, SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'

type UseVenueOffersParams = {
  userLocation: Position
  selectedLocationMode: LocationMode
  isUserUnderage: boolean
  venueSearchParams: SearchState
  searchState: SearchState
  transformHits: (hit: AlgoliaOffer<HitOffer>) => AlgoliaOffer<HitOffer>
  venue?: VenueResponse
  includeHitsWithoutImage?: boolean
}

export const useVenueOffers = ({
  userLocation,
  selectedLocationMode,
  isUserUnderage,
  venueSearchParams,
  searchState,
  transformHits,
  venue,
  includeHitsWithoutImage,
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

  const venueOffersQueriesParamsList = [
    venueSearchedOffersQueryParams,
    venueTopOffersQueryParams,
    headlineOfferQueryParams,
  ]

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venue?.id, userLocation, selectedLocationMode],
    () =>
      fetchMultipleOffers({
        paramsList: venueOffersQueriesParamsList,
        isUserUnderage,
      }),
    {
      enabled: !!venue,
      select: ([venueSearchedOffersResults, venueTopOffersResults, headlineOfferResults]) => {
        const filterFn = includeHitsWithoutImage ? filterValidOfferHit : filterOfferHitWithImage
        const hits = [venueSearchedOffersResults, venueTopOffersResults]
          .flatMap((result) => result?.hits)
          .filter(filterFn)
          .map(transformHits)

        const uniqHits = uniqBy(hits, 'objectID')

        const headlineOfferHit = headlineOfferResults?.hits[0]
        const headlineOffer = headlineOfferHit ? transformHits(headlineOfferHit) : undefined

        return {
          hits: uniqHits,
          nbHits: uniqHits.length,
          headlineOffer,
        }
      },
    }
  )
}
