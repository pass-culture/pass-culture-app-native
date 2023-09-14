import resolveResponse from 'contentful-resolve-response'
import { useEffect, useState } from 'react'

import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { ContentfulGtlPlaylistResponse } from 'features/venue/types'
import { SearchQueryParameters } from 'libs/algolia'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { ContentTypes, EntryCollection, HomepageNatifEntry } from 'libs/contentful/types'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'
import { Position } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'

const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
export const BASE_URL = `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
const PARAMS = `?content_type=gtlPlaylist&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`

async function fetchGTLPlaylists({
  position,
  isUserUnderage,
}: {
  position: Position
  isUserUnderage: boolean
}) {
  const url = `${BASE_URL}/entries${PARAMS}`
  const json = await getExternal<EntryCollection<HomepageNatifEntry, ContentTypes.HOMEPAGE_NATIF>>(
    url
  )

  const jsonResponse = resolveResponse(json) as ContentfulGtlPlaylistResponse

  return fetchOffersFromGTLPlaylist(jsonResponse, { position, isUserUnderage })
}

export type GTLPlaylistResponse = Awaited<ReturnType<typeof fetchGTLPlaylists>>

async function fetchOffersFromGTLPlaylist(
  data: ContentfulGtlPlaylistResponse,
  { position, isUserUnderage }: { position: Position; isUserUnderage: boolean }
) {
  const paramList = data.map(
    (item) =>
      ({
        offerGtlLevel: item.fields.algoliaParameters.fields.gtlLevel,
        offerGtlLabel: item.fields.algoliaParameters.fields.gtlLabel,
        hitsPerPage: item.fields.algoliaParameters.fields.hitsPerPage,
      } as SearchQueryParameters)
  )

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

  const allQueries = await multipleQueries<Offer>(queries)

  return data.map((item, index) => ({
    title: item.fields.displayParameters.fields.title,
    offers: allQueries[index] ?? { hits: [] },
    layout: item.fields.displayParameters.fields.layout,
  }))
}

export function useGTLPlaylists() {
  const { position } = useHomePosition()
  const isUserUnderage = useIsUserUnderage()
  const [gtlPlaylists, setGtlPlaylists] = useState<GTLPlaylistResponse>()
  const {} = useTransformOfferHits()

  useEffect(() => {
    fetchGTLPlaylists({ position, isUserUnderage }).then((response) => {
      setGtlPlaylists(response)
    })
  }, [isUserUnderage, position])

  return gtlPlaylists
}
