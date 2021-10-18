import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { useVenueSearchParameters } from 'features/venue/api/useVenueSearchParameters'
import { fetchAlgolia, filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'
import { fetchHits as fetchAppSearchHits } from 'libs/search/fetch/search'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'

export const useVenueOffers = (venueId: number) => {
  const transformHits = useTransformAlgoliaHits()
  const params = useVenueSearchParameters(venueId)
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  const { enabled, isAppSearchBackend } = useAppSearchBackend()

  const fetchHits = isAppSearchBackend ? fetchAppSearchHits : fetchAlgolia

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venueId],
    () => fetchHits({ ...params, page: 0 }, null, isUserUnderageBeneficiary),
    {
      select: ({ hits, nbHits }) => ({
        hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformHits), 'objectID') as SearchHit[],
        nbHits,
      }),
      enabled,
    }
  )
}
