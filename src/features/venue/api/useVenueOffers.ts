import uniqBy from 'lodash/uniqBy'
import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters/useVenueSearchParameters'
import { useSearchAnalyticsState } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers/fetchOffers'
import { env } from 'libs/environment'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
export const useVenueOffers = (venueId: number) => {
  const params = useVenueSearchParameters(venueId)
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfoContext()

  const { setCurrentQueryID } = useSearchAnalyticsState()

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venueId],
    () =>
      fetchOffers({
        parameters: { ...params, page: 0 },
        userLocation: null,
        isUserUnderage,
        storeQueryID: setCurrentQueryID,
        indexSearch: env.ALGOLIA_VENUE_OFFERS_INDEX_NAME,
      }),
    {
      enabled: !!netInfo.isConnected,
      select: ({ offers, nbOffers }) => ({
        hits: uniqBy(offers, 'objectID'),
        nbHits: nbOffers,
      }),
    }
  )
}
