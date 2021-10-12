import uniqBy from 'lodash.uniqby'
import { useQuery } from 'react-query'

import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { useVenueSearchParameters } from 'features/venue/api/useVenueSearchParameters'
import { filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'
import { fetchVenueOffers } from 'libs/search/fetch/search'

export const useVenueOffers = (venueId: number) => {
  const transformHits = useTransformAlgoliaHits()
  const params = useVenueSearchParameters(venueId)
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()

  return useQuery(
    [QueryKeys.VENUE_OFFERS, venueId],
    () => fetchVenueOffers(params, isUserUnderageBeneficiary),
    {
      select: ({ hits, nbHits }) => ({
        hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformHits), 'objectID') as SearchHit[],
        nbHits,
      }),
    }
  )
}
