import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { useVenueSearchParameters } from 'features/venue/api/useVenueSearchParameters'
import { fetchAlgolia, filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { QueryKeys } from 'libs/queryKeys'

export const useVenueOffers = (venueId: number) => {
  const transformHits = useTransformAlgoliaHits()
  const params = useVenueSearchParameters(venueId)
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venueId],
    () => fetchAlgolia({ ...params, page: 0 }, null, isUserUnderageBeneficiary),
    {
      select: ({ hits, nbHits }) => ({
        hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformHits), 'objectID'),
        nbHits,
      }),
    }
  )
}
