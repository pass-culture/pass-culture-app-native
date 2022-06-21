import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/utils'
import { useVenueSearchParameters } from 'features/venue/api/useVenueSearchParameters'
import { fetchOffer, filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'

export const useVenueOffers = (venueId: number) => {
  const transformHits = useTransformAlgoliaHits()
  const params = useVenueSearchParameters(venueId)
  const isUserUnderage = useIsUserUnderage()

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venueId],
    () => fetchOffer({ ...params, page: 0 }, null, isUserUnderage),
    {
      select: ({ hits, nbHits }) => ({
        hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformHits), 'objectID') as SearchHit[],
        nbHits,
      }),
    }
  )
}
