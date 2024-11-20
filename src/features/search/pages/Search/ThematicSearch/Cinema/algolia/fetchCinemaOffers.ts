import { MultipleQueriesQuery } from '@algolia/client-search'

import { NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { FetchThematicSearchOffers } from 'features/search/pages/Search/ThematicSearch/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { env } from 'libs/environment'
import { Offer } from 'shared/offer/types'

export const fetchCinemaOffers = async ({ userLocation }: FetchThematicSearchOffers) => {
  const queryIndex = {
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
    query: '',
  }
  const queryParams = {
    hitsPerPage: 30,
    attributesToRetrieve: offerAttributesToRetrieve,
    attributesToHighlight: [],
    ...(userLocation
      ? { aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}` }
      : {}),
    distinct: true,
  }

  const queries: MultipleQueriesQuery[] = [
    {
      ...queryIndex,
      params: {
        ...queryParams,
        hitsPerPage: 20,
        filters: `offer.subcategoryId:"${SubcategoryIdEnum.SEANCE_CINE}"`,
      },
    },
    {
      ...queryIndex,
      params: {
        ...queryParams,
        filters: `offer.subcategoryId:"${SubcategoryIdEnum.SEANCE_CINE}"`,
        attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.releaseDate'],
      },
    },
    {
      ...queryIndex,
      params: {
        ...queryParams,
        filters: `offer.nativeCategoryId:"${NativeCategoryIdEnumv2.CARTES_CINEMA}" AND (offer.subcategoryId:"${SubcategoryIdEnum.CARTE_CINE_MULTISEANCES}" OR offer.subcategoryId:"${SubcategoryIdEnum.CINE_VENTE_DISTANCE}")`,
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
