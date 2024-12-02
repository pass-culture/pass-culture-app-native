import { MultipleQueriesQuery } from '@algolia/client-search'
import { subDays } from 'date-fns'

import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { fetchThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/fetchThematicSearchPlaylists'
import { buildQuery } from 'features/search/pages/ThematicSearch/api/utils'
import { env } from 'libs/environment'
import { Position } from 'libs/location/types'

export const fetchCinemaOffers = async (userLocation?: Position) => {
  const commonQueryParams = {
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
    userLocation,
    distinct: true,
  }

  // We need the timestamps in seconds format for Algolia search
  const today = Math.floor(new Date().getTime() / 1000)
  const sevenDaysAgo = Math.floor(subDays(new Date(), 7).getTime() / 1000)

  const queries: MultipleQueriesQuery[] = [
    buildQuery({
      ...commonQueryParams,
      hitsPerPage: 20,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.SEANCE_CINE}"`,
    }),
    buildQuery({
      ...commonQueryParams,
      hitsPerPage: 30,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.SEANCE_CINE}"`,
      numericFilters: `offer.releaseDate: ${sevenDaysAgo} TO ${today}`,
    }),
    buildQuery({
      ...commonQueryParams,
      hitsPerPage: 30,
      filters: `offer.nativeCategoryId:"${NativeCategoryIdEnumv2.CARTES_CINEMA}" AND (offer.subcategoryId:"${SubcategoryIdEnum.CARTE_CINE_MULTISEANCES}" OR offer.subcategoryId:"${SubcategoryIdEnum.CINE_VENTE_DISTANCE}")`,
    }),
  ]

  return fetchThematicSearchPlaylists(queries)
}
