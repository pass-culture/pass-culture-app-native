import { MultipleQueriesQuery } from '@algolia/client-search'
import { subDays } from 'date-fns'

import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { fetchThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/fetchThematicSearchPlaylists'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location/types'

export const fetchCinemaOffers = async ({
  userLocation,
  isReplicaAlgoliaIndexActive,
}: {
  userLocation?: Position
  isReplicaAlgoliaIndexActive?: boolean
}) => {
  const commonQueryParams = {
    indexName: isReplicaAlgoliaIndexActive
      ? env.ALGOLIA_OFFERS_INDEX_NAME_B
      : env.ALGOLIA_OFFERS_INDEX_NAME,
    userLocation,
    distinct: true,
  }

  // We need the timestamps in seconds format for Algolia search
  const today = Math.floor(new Date().getTime() / 1000)
  const sevenDaysAgo = Math.floor(subDays(new Date(), 7).getTime() / 1000)

  const queries: MultipleQueriesQuery[] = [
    buildQueryHelper({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.SEANCE_CINE}"`,
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.SEANCE_CINE}"`,
      numericFilters: `offer.releaseDate: ${sevenDaysAgo} TO ${today}`,
    }),
    buildQueryHelper({
      ...commonQueryParams,
      userLocation: undefined,
      filters: `offer.nativeCategoryId:"${NativeCategoryIdEnumv2.CARTES_CINEMA}" AND (offer.subcategoryId:"${SubcategoryIdEnum.CARTE_CINE_MULTISEANCES}" OR offer.subcategoryId:"${SubcategoryIdEnum.CINE_VENTE_DISTANCE}")`,
    }),
  ]

  return fetchThematicSearchPlaylists(queries)
}
