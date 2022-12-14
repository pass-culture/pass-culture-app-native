import resolveResponse from 'contentful-resolve-response'

import { ContentTypes, EntryCollection, HomepageEntry } from 'libs/contentful'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 2

const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
export const BASE_URL = `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
export const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`

export async function fetchHomepageNatifContent() {
  const url = `${BASE_URL}/entries${PARAMS}`
  const json = await getExternal<EntryCollection<HomepageEntry, ContentTypes.HOMEPAGE_NATIF>>(url)
  return resolveResponse(json)
}
