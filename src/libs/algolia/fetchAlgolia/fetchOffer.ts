import { Hit } from '@algolia/client-search'

import { initialSearchState } from 'features/search/pages/reducer'
import { Response } from 'features/search/pages/useSearchResults'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import {
  offerAttributesToRetrieve,
  buildOfferSearchParameters,
} from 'libs/algolia/fetchAlgolia/config'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchParametersQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'
import { SearchHit } from 'libs/search'

export const fetchOffer = async (
  parameters: SearchParametersQuery,
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
): Promise<Response> => {
  const searchParameters = buildOfferSearchParameters(parameters, userLocation, isUserUnderage)
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)

  try {
    return await index.search<SearchHit>(parameters.query || '', {
      page: parameters.page || 0,
      ...buildHitsPerPage(parameters.hitsPerPage),
      ...searchParameters,
      attributesToRetrieve: offerAttributesToRetrieve,
      attributesToHighlight: [], // We disable highlighting because we don't need it
    })
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as Hit<SearchHit>[], nbHits: 0, page: 0, nbPages: 0 }
  }
}

export const fetchOfferHits = async (
  objectIds: string[],
  isUserUnderage: boolean
): Promise<SearchHit[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)
  const searchParameters = buildOfferSearchParameters(
    { ...initialSearchState, hitsPerPage: objectIds.length, objectIds, query: '' },
    null,
    isUserUnderage
  )

  try {
    const response = await index.search<SearchHit>('', {
      page: 0,
      hitsPerPage: objectIds.length,
      ...searchParameters,
      attributesToRetrieve: offerAttributesToRetrieve,
      attributesToHighlight: [], // We disable highlighting because we don't need it
    })
    const hits = response.hits.filter(Boolean) as SearchHit[]
    return hits.filter(({ offer }) => !offer.isEducational)
  } catch (error) {
    captureAlgoliaError(error)
    return [] as SearchHit[]
  }
}
