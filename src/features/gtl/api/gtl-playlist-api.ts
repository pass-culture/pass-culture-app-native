import resolveResponse from 'contentful-resolve-response'

import { ContentfulGtlPlaylistResponse } from 'features/gtl/types'
import { SearchQueryParameters } from 'libs/algolia'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'
import { Position } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'

const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
export const BASE_URL = `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
const PARAMS = `?content_type=gtlPlaylist&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`
const URL = `${BASE_URL}/entries${PARAMS}`

export async function fetchGTLPlaylists({
  position,
  isUserUnderage,
}: {
  position: Position
  isUserUnderage: boolean
}) {
  const json = await getExternal(URL)
  const jsonResponse = resolveResponse(json) as ContentfulGtlPlaylistResponse

  return fetchOffersFromGTLPlaylist(jsonResponse, { position, isUserUnderage })
}

export type GTLPlaylistResponse = Awaited<ReturnType<typeof fetchGTLPlaylists>>

export async function fetchOffersFromGTLPlaylist(
  data: ContentfulGtlPlaylistResponse,
  { position, isUserUnderage }: { position: Position; isUserUnderage: boolean }
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
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
    query: params.query,
    params: {
      ...buildHitsPerPage(params.hitsPerPage),
      ...buildOfferSearchParameters(params, position, isUserUnderage),
      attributesToHighlight: [], // We disable highlighting because we don't need it
      attributesToRetrieve: offerAttributesToRetrieve,
    },
  }))

  // Fetch all offers
  const allQueries = await multipleQueries<Offer>(queries)

  // Assign offers to playlist list
  return data.map((item, index) => ({
    title: item.fields.displayParameters.fields.title,
    offers: allQueries[index] ?? { hits: [] },
    layout: item.fields.displayParameters.fields.layout,
  }))
}
