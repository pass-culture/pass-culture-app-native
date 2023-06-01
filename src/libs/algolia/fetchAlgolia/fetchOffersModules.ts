import { SearchResponse } from '@algolia/client-search'

import { SearchState } from 'features/search/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildOffersModulesQueries } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOffersModulesQueries'
import { Position } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'

type FetchMultipleOffersArgs = {
  paramsList: SearchState[][]
  userLocation: Position
  isUserUnderage: boolean
}

export const fetchOffersModules = async ({
  paramsList,
  userLocation,
  isUserUnderage,
}: FetchMultipleOffersArgs): Promise<SearchResponse<Offer>[]> => {
  const queries = buildOffersModulesQueries({
    paramsList,
    userLocation,
    isUserUnderage,
  })

  try {
    const { results } = await client.multipleQueries<Offer>(queries)
    return results
  } catch (error) {
    captureAlgoliaError(error)
    return []
  }
}
