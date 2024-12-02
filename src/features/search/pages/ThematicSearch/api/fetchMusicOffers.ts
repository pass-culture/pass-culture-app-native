import { MultipleQueriesQuery } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import { fetchThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/fetchThematicSearchPlaylists'
import { buildQuery } from 'features/search/pages/ThematicSearch/api/utils'
import { env } from 'libs/environment'
import { Position } from 'libs/location/types'

export const fetchMusicOffers = async (userLocation?: Position) => {
  const commonQueryParams = {
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
    userLocation,
    hitsPerPage: 20,
  }

  const queries: MultipleQueriesQuery[] = [
    buildQuery({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.CONCERT}" AND NOT offer.last30DaysBookingsRange:"low"`,
    }),
    buildQuery({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.FESTIVAL_MUSIQUE}" AND NOT offer.last30DaysBookingsRange:"low"`,
    }),
    buildQuery({
      ...commonQueryParams,
      filters: `(offer.subcategoryId:"${SubcategoryIdEnum.ACHAT_INSTRUMENT}" OR offer.subcategoryId:"${SubcategoryIdEnum.LOCATION_INSTRUMENT}") AND NOT offer.last30DaysBookingsRange:"low"`,
    }),
    buildQuery({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD}" AND NOT offer.last30DaysBookingsRange:"low"`,
    }),
    buildQuery({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}" AND NOT offer.last30DaysBookingsRange:"low"`,
    }),
  ]

  return fetchThematicSearchPlaylists(queries)
}
