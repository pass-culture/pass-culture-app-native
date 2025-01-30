import resolveResponse from 'contentful-resolve-response'

import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { adaptGtlPlaylist } from 'libs/contentful/adapters/adaptGtlPlaylist'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { GtlPlaylist } from 'libs/contentful/types'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'

const PARAMS = `?include=2&content_type=gtlPlaylist&access_token=${env.CONTENTFUL_PUBLIC_ACCESS_TOKEN}`
const URL = `${CONTENTFUL_BASE_URL}/entries${PARAMS}`

export async function fetchGTLPlaylistConfig() {
  const json = await getExternal(URL)
  const jsonResponse = resolveResponse(json) as GtlPlaylist[]

  // Build parameters list from Contentful algolia parameters for algolia
  const gtlPlaylistRequests = jsonResponse
    .map(adaptGtlPlaylist)
    .filter((item): item is GtlPlaylistRequest => item !== null)

  return gtlPlaylistRequests
}
