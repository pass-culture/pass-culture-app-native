import resolveResponse from 'contentful-resolve-response'

import { Homepage } from 'features/home/types'
import { adaptHomepageEntries } from 'libs/contentful/adapters/adaptHomepageEntries'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ContentTypes, EntryCollection, HomepageNatifEntry } from 'libs/contentful/types'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 3

const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`

export const fetchHomepageNatifContent = async (): Promise<Homepage[]> => {
  const url = `${CONTENTFUL_BASE_URL}/entries${PARAMS}`
  const json = await getExternal<EntryCollection<HomepageNatifEntry, ContentTypes.HOMEPAGE_NATIF>>(
    url
  )
  const resolvedHomepageNatifList = resolveResponse(json) as HomepageNatifEntry[]
  return adaptHomepageEntries(resolvedHomepageNatifList)
}
