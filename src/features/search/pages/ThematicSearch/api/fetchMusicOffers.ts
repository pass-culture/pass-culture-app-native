import { SearchForHits } from 'algoliasearch/lite'

import { SubcategoryIdEnum } from 'api/gen'
import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { fetchThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/fetchThematicSearchPlaylists'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location/types'

export const fetchMusicOffers = async ({
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
  }

  const queries: SearchForHits[] = [
    buildQueryHelper({
      ...commonQueryParams,
      userLocation: undefined,
      filters: `(offer.subcategoryId:"${SubcategoryIdEnum.ABO_PLATEFORME_MUSIQUE}" OR offer.subcategoryId:"${SubcategoryIdEnum.LIVESTREAM_MUSIQUE}" OR offer.subcategoryId:"${SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE}") AND NOT offer.last30DaysBookingsRange:"very-low"`,
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.CONCERT}" AND NOT offer.last30DaysBookingsRange:"very-low"`,
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.FESTIVAL_MUSIQUE}" AND NOT offer.last30DaysBookingsRange:"very-low"`,
      withRadius: false,
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: `(offer.subcategoryId:"${SubcategoryIdEnum.ACHAT_INSTRUMENT}" OR offer.subcategoryId:"${SubcategoryIdEnum.LOCATION_INSTRUMENT}") AND NOT offer.last30DaysBookingsRange:"very-low"`,
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD}" AND NOT offer.last30DaysBookingsRange:"very-low"`,
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}" AND NOT offer.last30DaysBookingsRange:"very-low"`,
    }),
  ]

  return fetchThematicSearchPlaylists(queries)
}
