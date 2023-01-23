import resolveResponse from 'contentful-resolve-response'

import { Homepage } from 'features/home/types'
import { ContentTypes, EntryCollection, HomepageNatifEntry } from 'libs/contentful'
import { adaptHomepageNatifEntries } from 'libs/contentful/adapters/adaptHomepageEntries'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 3

const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
export const BASE_URL = `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
export const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`

export const fetchHomepageNatifContent = async (): Promise<Homepage[]> => {
  const url = `${BASE_URL}/entries${PARAMS}`
  const json = await getExternal<EntryCollection<HomepageNatifEntry, ContentTypes.HOMEPAGE_NATIF>>(
    url
  )
  const resolvedHomepageNatifList = resolveResponse(json) as HomepageNatifEntry[]
  return adaptHomepageNatifEntries(resolvedHomepageNatifList)
}
