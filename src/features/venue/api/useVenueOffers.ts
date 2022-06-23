import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/utils'
import { useVenueSearchParameters } from 'features/venue/api/useVenueSearchParameters'
import { fetchOffer, filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia'
import { useNetInfo } from 'libs/network/useNetInfo'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'

export const useVenueOffers = (venueId: number) => {
  const transformHits = useTransformOfferHits()
  const params = useVenueSearchParameters(venueId)
  const isUserUnderage = useIsUserUnderage()
  const netInfo = useNetInfo()

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venueId],
    () =>
      fetchOffer({
        parameters: { ...params, page: 0 },
        userLocation: null,
        isUserUnderage,
      }),
    {
      enabled: !!netInfo.isConnected,
      select: ({ hits, nbHits }) => ({
        hits: uniqBy(hits.filter(filterOfferHit).map(transformHits), 'objectID') as SearchHit[],
        nbHits,
      }),
    }
  )
}
