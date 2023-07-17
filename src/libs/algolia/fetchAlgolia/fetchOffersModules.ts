import { SearchResponse } from '@algolia/client-search'
import { chunk } from 'lodash'

import { OffersPlaylistParameters } from 'features/home/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildOffersModulesQueries } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOffersModulesQueries'
import { Position } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'

type FetchMultipleOffersArgs = {
  paramsList: OffersPlaylistParameters[]
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

  // Algolia multiple queries has a limit of 50 queries per call
  // so we split the queries in chunks of 50
  // https://www.algolia.com/doc/api-reference/api-methods/multiple-queries/#about-this-method
  const queriesChunks = chunk(queries, 50)

  try {
    const resultsChunks = await Promise.all(
      queriesChunks.map(async (queriesChunk) => await client.multipleQueries<Offer>(queriesChunk))
    )
    return resultsChunks.reduce<SearchResponse<Offer>[]>(
      (prev, curr) => prev.concat(curr.results),
      []
    )
  } catch (error) {
    captureAlgoliaError(error)
    return []
  }
}
