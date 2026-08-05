import resolveResponse from 'contentful-resolve-response'

import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { adaptGtlPlaylist } from 'libs/contentful/adapters/adaptGtlPlaylist'
import { getContentfulBaseUrl } from 'libs/contentful/constants'
import { GtlPlaylist } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 2 // We need this to be able to fetch contentTypes referenced in our contentModel

export async function fetchGTLPlaylistConfig() {
  const params = `?include=${DEPTH_LEVEL}&content_type=gtlPlaylist&access_token=${env.CONTENTFUL_PUBLIC_ACCESS_TOKEN}`
  const url = `${getContentfulBaseUrl()}/entries${params}`
  const json = await getExternal(url)
  const jsonResponse = resolveResponse(json) as GtlPlaylist[]

  // Build parameters list from Contentful algolia parameters for algolia
  const gtlPlaylistRequests = jsonResponse
    .map(adaptGtlPlaylist)
    .filter((item): item is GtlPlaylistRequest => item !== null)

  return gtlPlaylistRequests
}
