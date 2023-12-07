import { Hit, SearchResponse } from '@algolia/client-search'

import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { getSearchVenueQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/getSearchVenueQuery'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { AlgoliaVenue, SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'

type FetchOfferAndVenuesArgs = {
  parameters: SearchQueryParameters
  userPosition: Position
  isUserUnderage: boolean
  storeQueryID?: (queryID?: string) => void
  excludedObjectIds?: string[]
  offersIndex?: string
  venuesIndex?: string
  enableAppLocation?: boolean
}

export const fetchSearchResults = async ({
  parameters,
  userPosition,
  isUserUnderage,
  storeQueryID,
  offersIndex = env.ALGOLIA_OFFERS_INDEX_NAME,
  enableAppLocation,
}: FetchOfferAndVenuesArgs) => {
  const searchParameters = buildOfferSearchParameters(
    parameters,
    userPosition,
    isUserUnderage,
    enableAppLocation
  )

  const currentVenuesIndex = getCurrentVenuesIndex({
    locationType: parameters?.locationFilter?.locationType,
    userPosition,
    venue: parameters?.venue,
  })

  const queries = [
    // Offers
    {
      indexName: offersIndex,
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
      },
    },
    // Venues
    {
      indexName: currentVenuesIndex,
      query: getSearchVenueQuery(parameters),
      params: {
        page: 0,
        ...buildHitsPerPage(35),
        ...buildSearchVenuePosition(parameters.locationFilter, userPosition, parameters.venue),
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
          userPosition,
          isUserUnderage
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
  ]

  try {
    const [offersResponse, venuesResponse, facetsResponse] = (await multipleQueries<
      Offer | AlgoliaVenue
    >(queries)) as [SearchResponse<Offer>, SearchResponse<AlgoliaVenue>, SearchResponse<Offer>]

    if (storeQueryID) storeQueryID(offersResponse.queryID)

    return { offersResponse, venuesResponse, facetsResponse }
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
    }
  }
}
