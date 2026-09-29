import resolveResponse from 'contentful-resolve-response'

import { ArtistEditorialModule } from 'features/home/types'
import { adaptArtistEditorialModule } from 'libs/contentful/adapters/modules/adaptArtistEditorialModule'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ArtistEditorialContentModel } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 2 // We need this to be able to fetch contentTypes referenced in our contentModel

const PARAMS = `?include=${DEPTH_LEVEL}&content_type=artistEditorial&access_token=${env.CONTENTFUL_PUBLIC_ACCESS_TOKEN}`
const URL = `${CONTENTFUL_BASE_URL}/entries${PARAMS}`

export async function fetchArtistEditorialConfig() {
  const json = await getExternal(URL)
  const jsonResponse = resolveResponse(json) as ArtistEditorialContentModel[]

  const artistEditorialRequests = jsonResponse
    .map(adaptArtistEditorialModule)
    .filter((item): item is ArtistEditorialModule => item !== null)

  return artistEditorialRequests
}
