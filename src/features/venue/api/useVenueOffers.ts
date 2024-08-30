import uniqBy from 'lodash/uniqBy'
import { useCallback } from 'react'
import { useQuery, UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export type VenueOffers = { hits: Offer[]; nbHits: number }

export const useVenueOffers = (venue?: VenueResponse): UseQueryResult<VenueOffers> => {
  const { userLocation, selectedLocationMode } = useLocation()
  const transformHits = useTransformOfferHits()
  const venueSearchParams = useVenueSearchParameters(venue)
  const { searchState } = useSearch()
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()

  const buildPlaylistOfferParams = useCallback(
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

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venue?.id, userLocation, selectedLocationMode],
    () =>
      fetchMultipleOffers({
        paramsList: [
          buildPlaylistOfferParams({
            ...searchState,
            venue: venueSearchParams.venue,
          }),
          buildPlaylistOfferParams(venueSearchParams),
        ],
        isUserUnderage,
        indexName: env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
      }),
    {
      enabled: !!(netInfo.isConnected && venue),
      select: ({ hits, nbHits }) => ({
        hits: uniqBy(hits.filter(filterOfferHit).map(transformHits), 'objectID') as Offer[],
        nbHits,
      }),
    }
  )
}
