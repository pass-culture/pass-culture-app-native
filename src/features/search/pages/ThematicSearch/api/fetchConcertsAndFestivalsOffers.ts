import { MultipleQueriesQuery } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import { fetchThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/fetchThematicSearchPlaylists'
import { buildQuery } from 'features/search/pages/ThematicSearch/api/utils'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location/types'

export const fetchConcertsAndFestivalsOffers = async (userLocation?: Position) => {
  const commonQueryParams = {
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
    userLocation,
  }

  const queries: MultipleQueriesQuery[] = [
    buildQuery({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.CONCERT}" AND NOT offer.last30DaysBookingsRange:"very-low"`,
    }),
    buildQuery({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.FESTIVAL_MUSIQUE}" AND NOT offer.last30DaysBookingsRange:"very-low"`,
      withRadius: false,
    }),
  ]

  return fetchThematicSearchPlaylists(queries)
}
