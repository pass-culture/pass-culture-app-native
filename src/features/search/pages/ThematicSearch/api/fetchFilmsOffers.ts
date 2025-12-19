import { SearchForHits } from 'algoliasearch/lite'

import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location/types'
import { Offer } from 'shared/offer/types'

export const fetchFilmsOffers = async ({
  userLocation,
  isReplicaAlgoliaIndexActive,
}: {
  userLocation?: Position
  isReplicaAlgoliaIndexActive?: boolean
}) => {
  const queries: SearchForHits[] = [
    buildQueryHelper({
      indexName: isReplicaAlgoliaIndexActive
        ? env.ALGOLIA_OFFERS_INDEX_NAME_B
        : env.ALGOLIA_OFFERS_INDEX_NAME,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.ABO_PLATEFORME_VIDEO}"`,
    }),
    buildQueryHelper({
      indexName: isReplicaAlgoliaIndexActive
        ? env.ALGOLIA_OFFERS_INDEX_NAME_B
        : env.ALGOLIA_OFFERS_INDEX_NAME,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.VOD}"`,
    }),
    buildQueryHelper({
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      userLocation,
      filters: `offer.nativeCategoryId:"${NativeCategoryIdEnumv2.DVD_BLU_RAY}" AND offer.subcategoryId:"${SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM}" AND NOT offer.last30DaysBookingsRange:"very-low"`,
    }),
  ]

  try {
    const allQueries = await multipleQueries<Offer>(queries)
    return allQueries.filter(searchResponsePredicate)
  } catch (error) {
    captureAlgoliaError(error)
    return []
  }
}
