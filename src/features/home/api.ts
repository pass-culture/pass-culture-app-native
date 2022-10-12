import resolveResponse from 'contentful-resolve-response'
import { useMemo, useEffect } from 'react'
import { useQuery } from 'react-query'

import { NoContentError } from 'features/home/components/NoContentError'
import {
  EntryCollection,
  EntryFields,
  processHomepageEntry,
  HomepageEntry,
  ContentTypes,
} from 'features/home/contentful'
import { useSelectHomepageEntry } from 'features/home/selectHomepageEntry'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'
import { analytics } from 'libs/firebase/analytics'
import { ScreenError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

const DEPTH_LEVEL = 2
const STALE_TIME_CONTENTFUL = 5 * 60 * 1000

export const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
export const BASE_URL = `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
export const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`

export async function getEntries() {
  const url = `${BASE_URL}/entries${PARAMS}`
  try {
    const json = await getExternal<EntryCollection<EntryFields, ContentTypes.HOMEPAGE_NATIF>>(url)
    return resolveResponse(json)
  } catch (e) {
    const error = e as Error
    throw new ScreenError(error?.message, NoContentError)
  }
}

export function useHomepageModules(paramsHomepageEntryId?: string) {
  const selectHomepageEntry = useSelectHomepageEntry(paramsHomepageEntryId)
  // this fetches all homepages available in contentful
  const { data: homepageEntries } = useQuery<HomepageEntry[]>(
    QueryKeys.HOMEPAGE_MODULES,
    getEntries,
    {
      staleTime: STALE_TIME_CONTENTFUL,
    }
  )

  const homepageEntry = selectHomepageEntry(homepageEntries || [])
  const homepageEntryId = homepageEntry?.sys.id

  useEffect(() => {
    if (homepageEntryId) {
      analytics.logConsultHome({ homeEntryId: homepageEntryId })
    }
  }, [homepageEntryId])

  return useMemo(
    () =>
      homepageEntry
        ? { modules: processHomepageEntry(homepageEntry), homeEntryId: homepageEntryId }
        : { modules: [] },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homepageEntryId]
  )
}
