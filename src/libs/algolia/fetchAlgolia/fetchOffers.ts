import { Hit, SearchResponse } from '@algolia/client-search'
import flatten from 'lodash/flatten'

import { Response } from 'features/search/api/useSearchResults/useSearchResults'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildVenue } from 'libs/algolia/fetchAlgolia/fetchVenuesModules'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchParametersQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'

type FetchOfferArgs = {
  parameters: SearchParametersQuery
  userLocation: Position
  isUserUnderage: boolean
  storeQueryID?: (queryID?: string) => void
  excludedObjectIds?: string[]
  indexSearch?: string
  isFromOffer?: boolean
}

export const fetchOffers = async ({
  parameters,
  userLocation,
  isUserUnderage,
  storeQueryID,
  indexSearch = env.ALGOLIA_OFFERS_INDEX_NAME,
  isFromOffer,
}: FetchOfferArgs): Promise<Response> => {
  const searchParameters = buildOfferSearchParameters(parameters, userLocation, isUserUnderage)
  const index = client.initIndex(indexSearch)

  const getVenuesQuery = () => {
    if (parameters.offerNativeCategories && parameters.offerNativeCategories.length > 0)
      return String(parameters.offerNativeCategories[0])
    if (parameters.offerCategories && parameters.offerCategories.length > 0)
      return String(parameters.offerCategories[0])
    return ''
  }

  const queries = [
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: parameters.query || '',
      params: {
        page: parameters.page || 0,
        ...buildHitsPerPage(parameters.hitsPerPage),
        ...searchParameters,
        attributesToRetrieve: offerAttributesToRetrieve,
        attributesToHighlight: [], // We disable highlighting because we don't need it
        /* Is needed to get a queryID, in order to send analytics events
         https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/ */
        clickAnalytics: true,
        // To use exactly the query and not limit the duplicate offers
        ...(isFromOffer ? { typoTolerance: false, distinct: false } : {}),
      },
    },
    {
      indexName: env.ALGOLIA_VENUES_INDEX_NAME,
      query: getVenuesQuery(),
      params: {
        page: 0,
        ...buildHitsPerPage(35),
        aroundLatLng: searchParameters.aroundLatLng,
        aroundRadius: searchParameters.aroundRadius,
        clickAnalytics: true,
      },
    },
  ]

  try {
    // const response = await index.search<Offer>(parameters.query || '', {
    //   page: parameters.page || 0,
    //   ...buildHitsPerPage(parameters.hitsPerPage),
    //   ...searchParameters,
    //   attributesToRetrieve: offerAttributesToRetrieve,
    //   attributesToHighlight: [], // We disable highlighting because we don't need it
    //   /* Is needed to get a queryID, in order to send analytics events
    //      https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/ */
    //   clickAnalytics: true,
    //   // To use exactly the query and not limit the duplicate offers
    //   ...(isFromOffer ? { typoTolerance: false, distinct: false } : {}),
    // })
    const response = await client.multipleQueries(queries)
    const { results } = response

    if (storeQueryID) storeQueryID(results[0].queryID)

    const offersResponse = results[0] as unknown as Response
    const venuesResponse = results[1] as unknown as Response

    return { offersResponse, venuesResponse }
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as Hit<Offer>[], nbHits: 0, page: 0, nbPages: 0 }
  }
}
