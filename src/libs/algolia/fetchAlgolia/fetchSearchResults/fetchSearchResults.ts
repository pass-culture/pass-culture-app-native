import { Hit, SearchResponse } from 'algoliasearch/lite'

import { DisabilitiesProperties } from 'features/accessibility/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { buildVenueSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildVenueSearchParameters/buildVenueSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { getSearchVenueQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/getSearchVenueQuery'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { AlgoliaVenue, SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { Offer } from 'shared/offer/types'

const getDefaultReponse = <H>() => ({
  hits: [] as Hit<H>[],
  nbHits: 0,
  page: 0,
  nbPages: 0,
  userData: null,
})

type FetchOfferAndVenuesArgs = {
  parameters: SearchQueryParameters
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
  storeQueryID?: (queryID?: string) => void
  offersIndex?: string
  venuesIndex?: string
  disabilitiesProperties: DisabilitiesProperties
  aroundPrecision?: CustomRemoteConfig['aroundPrecision']
}

type RenderingContent = {
  redirect?: {
    url?: string
  }
}

export const fetchSearchResults = async ({
  parameters,
  buildLocationParameterParams,
  isUserUnderage,
  storeQueryID,
  offersIndex = env.ALGOLIA_OFFERS_INDEX_NAME,
  disabilitiesProperties,
  aroundPrecision,
}: FetchOfferAndVenuesArgs) => {
  const currentVenuesIndex = getCurrentVenuesIndex({
    selectedLocationMode: buildLocationParameterParams.selectedLocationMode,
    geolocPosition: buildLocationParameterParams.geolocPosition,
  })

  const offersQueryParams = {
    page: parameters.page || 0,
    ...buildOfferSearchParameters(
      parameters,
      buildLocationParameterParams,
      isUserUnderage,
      disabilitiesProperties,
      true
    ),
    attributesToRetrieve: offerAttributesToRetrieve,
    attributesToHighlight: [] as never[], // We disable highlighting because we don't need it
    /* Is needed to get a queryID, in order to send analytics events
     https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/ */
    clickAnalytics: true,
  }

  const queries = [
    // Offers
    {
      indexName: offersIndex,
      query: parameters.query || '',
      ...offersQueryParams,
      ...buildHitsPerPage(parameters.hitsPerPage),
      ...(aroundPrecision && { aroundPrecision }),
    },
    // Venues
    {
      indexName: currentVenuesIndex,
      query: getSearchVenueQuery(parameters),
      page: 0,
      ...buildHitsPerPage(35),
      ...buildVenueSearchParameters(
        buildLocationParameterParams,
        disabilitiesProperties,
        parameters.venue
      ),
      clickAnalytics: true,
    },
    // Offers without duplication limit
    {
      indexName: offersIndex,
      query: parameters.query || '',
      ...offersQueryParams,
      ...buildHitsPerPage(100),
      // To use exactly the query and not limit the duplicate offers
      distinct: false,
      typoTolerance: false,
    },
    // Artists in offers
    {
      indexName: offersIndex,
      query: '',
      ...buildOfferSearchParameters(
        { ...parameters, artistName: parameters.query },
        buildLocationParameterParams,
        isUserUnderage,
        disabilitiesProperties,
        true
      ),
      attributesToRetrieve: ['artists'],
      ...buildHitsPerPage(100),
    },
  ]

  try {
    const [offersResponse, venuesResponse, duplicatedOffersResponse, offerArtistsResponse] =
      (await multipleQueries<Offer | AlgoliaVenue>(queries)) as [
        SearchResponse<Offer>,
        SearchResponse<AlgoliaVenue>,
        SearchResponse<Offer>,
        SearchResponse<Offer>,
      ]

    if (storeQueryID) storeQueryID(offersResponse.queryID)
    const { renderingContent } = offersResponse
    const redirectUrl = (renderingContent as RenderingContent)?.redirect?.url

    return {
      offersResponse,
      venuesResponse,
      duplicatedOffersResponse,
      offerArtistsResponse,
      redirectUrl,
    }
  } catch (error) {
    captureAlgoliaError(error)
    return {
      offersResponse: getDefaultReponse<Offer>(),
      venuesResponse: getDefaultReponse<AlgoliaVenue>(),
      offerArtistsResponse: getDefaultReponse<Offer>(),
      duplicatedOffersResponse: getDefaultReponse<Offer>(),
      redirectUrl: undefined,
    }
  }
}
