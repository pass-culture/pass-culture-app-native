import resolveResponse from 'contentful-resolve-response'

import { VenueResponse } from 'api/gen'
import { ContentfulGtlPlaylistResponse } from 'features/gtlPlaylist/types'
import { SearchQueryParameters } from 'libs/algolia'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'
import { Offer } from 'shared/offer/types'

const PARAMS = `?content_type=gtlPlaylist&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`
const URL = `${CONTENTFUL_BASE_URL}/entries${PARAMS}`

export type FetchOffersFromGTLPlaylistProps = {
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
  venue: VenueResponse
}

export async function fetchGTLPlaylists({
  buildLocationParameterParams,
  isUserUnderage,
  venue,
}: FetchOffersFromGTLPlaylistProps) {
  const json = await getExternal(URL)
  const jsonResponse = resolveResponse(json) as ContentfulGtlPlaylistResponse

  return fetchOffersFromGTLPlaylist(jsonResponse, {
    buildLocationParameterParams,
    isUserUnderage,
    venue,
  })
}

export type GTLPlaylistResponse = Awaited<ReturnType<typeof fetchGTLPlaylists>>

export async function fetchOffersFromGTLPlaylist(
  data: ContentfulGtlPlaylistResponse,
  { buildLocationParameterParams, isUserUnderage, venue }: FetchOffersFromGTLPlaylistProps
) {
  // Build parameters list from Contentful algolia parameters for algolia
  const paramList = data.map(
    (item) =>
      ({
        offerGtlLevel: item.fields.algoliaParameters.fields.gtlLevel,
        offerGtlLabel: item.fields.algoliaParameters.fields.gtlLabel,
        hitsPerPage: item.fields.algoliaParameters.fields.hitsPerPage,
      } as unknown as SearchQueryParameters)
  )

  // Build a query list to send to Algolia
  const queries = paramList.map((params) => ({
    indexName: env.ALGOLIA_VENUE_OFFERS_INDEX_NAME,
    query: params.query,
    params: {
      ...buildHitsPerPage(params.hitsPerPage),
      ...buildOfferSearchParameters(
        {
          ...params,
          venue: {
            venueId: venue.id,
            info: venue.city ?? '',
            label: venue.name,
          },
        },
        buildLocationParameterParams,
        isUserUnderage
      ),
      attributesToHighlight: [], // We disable highlighting because we don't need it
      attributesToRetrieve: offerAttributesToRetrieve,
    },
  }))

  // Fetch all offers
  const allQueries = await multipleQueries<Offer>(queries)
  const searchResponseQueries = allQueries.filter(searchResponsePredicate)

  // Assign offers to playlist list
  return data.map((item, index) => ({
    title: item.fields.displayParameters.fields.title,
    offers: searchResponseQueries[index] ?? { hits: [] },
    layout: item.fields.displayParameters.fields.layout,
    minNumberOfOffers: item.fields.displayParameters.fields.minOffers,
    entryId: item.sys.id,
  }))
}
