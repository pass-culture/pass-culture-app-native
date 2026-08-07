import resolveResponse from 'contentful-resolve-response'

import { getContentfulBaseUrl } from 'libs/contentful/constants'
import { ContentTypes, EntryCollection, HomepageNatifEntry } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 3

export const fetchHomepageById = async (
  homepageId: string
): Promise<HomepageNatifEntry | undefined> => {
  const params = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_PUBLIC_ACCESS_TOKEN}`
  const url = `${getContentfulBaseUrl()}/entries${params}&sys.id=${homepageId}`
  const json =
    await getExternal<EntryCollection<HomepageNatifEntry, ContentTypes.HOMEPAGE_NATIF>>(url)
  const response = resolveResponse(json) as HomepageNatifEntry[]
  const homepageEntry = response[0]
  return homepageEntry
}
