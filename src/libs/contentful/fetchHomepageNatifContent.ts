import resolveResponse from 'contentful-resolve-response'

import { Homepage } from 'features/home/types'
import { adaptHomepageEntries } from 'libs/contentful/adapters/adaptHomepageEntries'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ContentTypes, EntryCollection, HomepageNatifEntry } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 3

const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_PUBLIC_ACCESS_TOKEN}`

export const fetchHomepageNatifContent = async (): Promise<Homepage[]> => {
  const t0 = performance.now()
  const url = `${CONTENTFUL_BASE_URL}/entries${PARAMS}`
  const json =
    await getExternal<EntryCollection<HomepageNatifEntry, ContentTypes.HOMEPAGE_NATIF>>(url)
  const t1 = performance.now()
  console.log(`Time to fetch homes: ${t1 - t0}ms`)
  const resolvedHomepageNatifList = resolveResponse(json) as HomepageNatifEntry[]
  const t2 = performance.now()
  console.log(`Time to resolve response: ${t2 - t1}ms`)
  const result = adaptHomepageEntries(resolvedHomepageNatifList)
  const t3 = performance.now()
  console.log(`Time to adapt homepages: ${t3 - t2}ms`)
  return result
}
