import uniqBy from 'lodash/uniqBy'
import { useCallback } from 'react'
import { useQuery, UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { VenueOffers } from 'features/venue/types'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'

export const useVenueOffers = (venue?: VenueResponse): UseQueryResult<VenueOffers> => {
  // TODO(PC-33493): hook refacto
  const { userLocation, selectedLocationMode } = useLocation()
  const transformHits = useTransformOfferHits()
  const venueSearchParams = useVenueSearchParameters(venue)
  const { searchState } = useSearch()
  const isUserUnderage = useIsUserUnderage()

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
        const hits = [venueSearchedOffersResults, venueTopOffersResults]
          .flatMap((result) => result?.hits)
          .filter(filterOfferHit)
          .map(transformHits)

        const headlineOfferHit = headlineOfferResults?.hits[0]
        const headlineOffer = headlineOfferHit ? transformHits(headlineOfferHit) : undefined

        return {
          hits: uniqBy(hits, 'objectID'),
          nbHits: hits.length,
          headlineOffer,
        }
      },
    }
  )
}
