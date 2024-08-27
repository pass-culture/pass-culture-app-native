import uniqBy from 'lodash/uniqBy'
import { useQuery, UseQueryResult } from 'react-query'

import { VenueResponse } from 'api/gen'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { env } from 'libs/environment'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export type VenueOffers = { hits: Offer[]; nbHits: number }

export const useVenueOffers = (venue?: VenueResponse): UseQueryResult<VenueOffers> => {
  const { userLocation, selectedLocationMode } = useLocation()
  const transformHits = useTransformOfferHits()
  const params = useVenueSearchParameters(venue)
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()

  const { setCurrentQueryID } = useSearchAnalyticsState()

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venue?.id, userLocation, selectedLocationMode],
    () =>
      fetchOffers({
        parameters: { ...params, page: 0 },
        buildLocationParameterParams: {
          userLocation,
          selectedLocationMode,
          aroundMeRadius: MAX_RADIUS,
          aroundPlaceRadius: MAX_RADIUS,
        },
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        indexSearch: env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
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
