import resolveResponse from 'contentful-resolve-response'

import { ArtistPlaylistModule } from 'features/home/types'
import { adaptArtistPlaylistModule } from 'libs/contentful/adapters/modules/adaptArtistPlaylistModule'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ArtistPlaylistContentModel } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 2 // We need this to be able to fetch contentTypes referenced in our contentModel

const PARAMS = `?include=${DEPTH_LEVEL}&content_type=artistPlaylist&access_token=${env.CONTENTFUL_PUBLIC_ACCESS_TOKEN}`
const URL = `${CONTENTFUL_BASE_URL}/entries${PARAMS}`

export async function fetchArtistPlaylistConfig() {
  const json = await getExternal(URL)
  const jsonResponse = resolveResponse(json) as ArtistPlaylistContentModel[]

  // Build parameters list from Contentful algolia parameters for algolia
  const artistPlaylistRequests = jsonResponse
    .map(adaptArtistPlaylistModule)
    .filter((item): item is ArtistPlaylistModule => item !== null)

  return artistPlaylistRequests
}
