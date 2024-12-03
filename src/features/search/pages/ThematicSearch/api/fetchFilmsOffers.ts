import { MultipleQueriesQuery } from '@algolia/client-search'

import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { buildQuery } from 'features/search/pages/ThematicSearch/api/utils'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { env } from 'libs/environment'
import { Position } from 'libs/location/types'
import { Offer } from 'shared/offer/types'

export const fetchFilmsOffers = async (userLocation?: Position) => {
  const commonQueryParams = {
    hitsPerPage: 20,
  }

  const queries: MultipleQueriesQuery[] = [
    buildQuery({
      ...commonQueryParams,
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.VOD}"`,
    }),
    buildQuery({
      ...commonQueryParams,
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      userLocation,
      filters: `offer.nativeCategoryId:"${NativeCategoryIdEnumv2.DVD_BLU_RAY}" AND offer.subcategoryId:"${SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM}" AND NOT offer.last30DaysBookingsRange:"very-low"`,
    }),
    buildQuery({
      ...commonQueryParams,
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
      filters: `offer.subcategoryId:"${SubcategoryIdEnum.ABO_PLATEFORME_VIDEO}"`,
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
