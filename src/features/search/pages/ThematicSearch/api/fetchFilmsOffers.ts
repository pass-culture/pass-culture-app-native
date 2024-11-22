import { MultipleQueriesQuery } from '@algolia/client-search'

import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { env } from 'libs/environment'
import { Position } from 'libs/location/types'
import { Offer } from 'shared/offer/types'

export const fetchFilmsOffers = async (userLocation?: Position) => {
  const queryParams = {
    hitsPerPage: 20,
    attributesToRetrieve: offerAttributesToRetrieve,
    attributesToHighlight: [],
    ...(userLocation
      ? { aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}` }
      : {}),
  }

  const queries: MultipleQueriesQuery[] = [
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
      query: '',
      params: {
        ...queryParams,
        filters: `offer.subcategoryId:"${SubcategoryIdEnum.VOD}"`,
      },
    },
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: '',
      params: {
        ...queryParams,
        filters: `offer.nativeCategoryId:"${NativeCategoryIdEnumv2.DVD_BLU_RAY}" AND offer.subcategoryId:"${SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM}" AND NOT offer.last30DaysBookingsRange:"low"`,
      },
    },
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
      query: '',
      params: {
        ...queryParams,
        filters: `offer.subcategoryId:"${SubcategoryIdEnum.ABO_PLATEFORME_VIDEO}"`,
      },
    },
  ]

  try {
    const allQueries = await multipleQueries<Offer>(queries)
    return allQueries.filter(searchResponsePredicate)
  } catch (error) {
    captureAlgoliaError(error)
    return []
  }
}
