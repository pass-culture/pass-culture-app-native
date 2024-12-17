import { Hit, SearchResponse } from '@algolia/client-search'

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
import { env } from 'libs/environment'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { Offer } from 'shared/offer/types'

type FetchOfferAndVenuesArgs = {
  parameters: SearchQueryParameters
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
  storeQueryID?: (queryID?: string) => void
  excludedObjectIds?: string[]
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
    userLocation: buildLocationParameterParams.userLocation,
  })

  const queries = [
    // Offers
    {
      indexName: offersIndex,
      query: parameters.query || '',
      params: {
        page: parameters.page || 0,
        ...buildHitsPerPage(parameters.hitsPerPage),
        ...buildOfferSearchParameters(
          parameters,
          buildLocationParameterParams,
          isUserUnderage,
          disabilitiesProperties
        ),
        attributesToRetrieve: offerAttributesToRetrieve,
        attributesToHighlight: [], // We disable highlighting because we don't need it
        /* Is needed to get a queryID, in order to send analytics events
         https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/ */
        clickAnalytics: true,
        ...(aroundPrecision && aroundPrecision !== 0 && { aroundPrecision }),
      },
    },
    // Venues
    {
      indexName: currentVenuesIndex,
      query: getSearchVenueQuery(parameters),
      params: {
        page: 0,
        ...buildHitsPerPage(35),
        ...buildVenueSearchParameters(
          buildLocationParameterParams,
          disabilitiesProperties,
          parameters.venue
        ),
        clickAnalytics: true,
      },
    },
    // Facets
    // this request should be reworked because we have a problem on genreType view
    {
      indexName: offersIndex,
      query: parameters.query || '',
      params: {
        page: 0,
        ...buildHitsPerPage(parameters.hitsPerPage),
        ...buildOfferSearchParameters(
          {
            ...parameters,
            offerCategories: [],
            offerNativeCategories: undefined,
            offerGenreTypes: undefined,
          },
          buildLocationParameterParams,
          isUserUnderage,
          disabilitiesProperties
        ),
      },
      facets: [
        'offer.bookMacroSection',
        'offer.movieGenres',
        'offer.musicType',
        'offer.nativeCategoryId',
        'offer.showType',
      ],
    },
    // Offers without duplication limit
    {
      indexName: offersIndex,
      query: parameters.query || '',
      params: {
        page: parameters.page || 0,
        ...buildHitsPerPage(1000),
        ...buildOfferSearchParameters(
          parameters,
          buildLocationParameterParams,
          isUserUnderage,
          disabilitiesProperties
        ),
        attributesToRetrieve: offerAttributesToRetrieve,
        attributesToHighlight: [], // We disable highlighting because we don't need it
        /* Is needed to get a queryID, in order to send analytics events
             https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/ */
        clickAnalytics: true,
        // To use exactly the query and not limit the duplicate offers
        distinct: false,
        typoTolerance: false,
      },
    },
  ]

  try {
    const [offersResponse, venuesResponse, facetsResponse, duplicatedOffersResponse] =
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
      facetsResponse,
      duplicatedOffersResponse,
      redirectUrl,
    }
  } catch (error) {
    captureAlgoliaError(error)
    return {
      offersResponse: { hits: [] as Hit<Offer>[], nbHits: 0, page: 0, nbPages: 0, userData: null },
      venuesResponse: {
        hits: [] as Hit<AlgoliaVenue>[],
        nbHits: 0,
        page: 0,
        nbPages: 0,
        userData: null,
      },
      facetsResponse: {},
      duplicatedOffersResponse: {
        hits: [] as Hit<Offer>[],
        nbHits: 0,
        page: 0,
        nbPages: 0,
        userData: null,
      },
      redirectUrl: undefined,
    }
  }
}
