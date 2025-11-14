import resolveResponse from 'contentful-resolve-response'

import { Homepage } from 'features/home/types'
import { adaptHomepageEntry } from 'libs/contentful/adapters/adaptHomepageEntries'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ContentTypes, EntryCollection, HomepageNatifEntry } from 'libs/contentful/types'
import { env } from 'libs/environment/env'
import { getExternal } from 'libs/fetch'

const DEPTH_LEVEL = 3

const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_PUBLIC_ACCESS_TOKEN}`

export const fetchHomepageNatifContent = async (): Promise<Homepage[]> => {
  // const url = `${CONTENTFUL_BASE_URL}/entries${PARAMS}`
  // const json =
  //   await getExternal<EntryCollection<HomepageNatifEntry, ContentTypes.HOMEPAGE_NATIF>>(url)
  // const homepageEntries = resolveResponse(json) as HomepageNatifEntry[]
  return [] // homepageEntries.map(adaptHomepageEntry)
}

export const fetchHomepageById = async (homepageId: string): Promise<Homepage> => {
  const url = `${CONTENTFUL_BASE_URL}/entries${PARAMS}&sys.id=${homepageId}`
  const json =
    await getExternal<EntryCollection<HomepageNatifEntry, ContentTypes.HOMEPAGE_NATIF>>(url)
  const result = resolveResponse(json) as HomepageNatifEntry[]
  const homepageEntry = result[0]
  return adaptHomepageEntry(homepageEntry)
}
