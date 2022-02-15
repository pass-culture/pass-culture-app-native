import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/utils'
import { useVenueSearchParameters } from 'features/venue/api/useVenueSearchParameters'
import { fetchAlgolia, filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'

export const useVenueOffers = (venueId: number) => {
  const { isConnected } = useNetwork()
  const transformHits = useTransformAlgoliaHits()
  const params = useVenueSearchParameters(venueId)
  const isUserUnderage = useIsUserUnderage()

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venueId],
    () => fetchAlgolia({ ...params, page: 0 }, null, isUserUnderage),
    {
      enabled: isConnected,
      select: ({ hits, nbHits }) => ({
        hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformHits), 'objectID') as SearchHit[],
        nbHits,
      }),
    }
  )
}
