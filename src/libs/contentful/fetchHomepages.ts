import resolveResponse from 'contentful-resolve-response'

import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ContentTypes, EntryCollection, HomepageNatifEntry } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 3

const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_PUBLIC_ACCESS_TOKEN}`

export const fetchHomepageById = async (
  homepageId: string
): Promise<HomepageNatifEntry | undefined> => {
  const url = `${CONTENTFUL_BASE_URL}/entries${PARAMS}&sys.id=${homepageId}`
  const json =
    await getExternal<EntryCollection<HomepageNatifEntry, ContentTypes.HOMEPAGE_NATIF>>(url)
  const response = resolveResponse(json) as HomepageNatifEntry[]
  const homepageEntry = response[0]
  return homepageEntry
}
