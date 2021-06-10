import resolveResponse from 'contentful-resolve-response'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { HomepageEntry } from 'features/home/contentful'
import { EntryCollection, EntryFields, processHomepageEntry } from 'features/home/contentful'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'
import { QueryKeys } from 'libs/queryKeys'

const DEPTH_LEVEL = 2
const STALE_TIME_CONTENTFUL = 5 * 60 * 1000

export const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
export const BASE_URL = `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
export const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`

const selectEntry = (entries?: HomepageEntry[], entryId?: string): HomepageEntry | undefined => {
  if (!entries) return undefined
  /* Support good practice is to configure on Contentful dashboard only 1 contenttype homepage
    But there is not blocking on the dashboard, that's why we select first one here */
  const firstEntry = entries[0]
  if (!entryId) return firstEntry

  return entries.find(({ sys }) => sys.id === entryId) || firstEntry
}

export async function getEntries() {
  const url = `${BASE_URL}/entries${PARAMS}`
  const json = await getExternal<EntryCollection<EntryFields, 'homepageNatif'>>(url)

  return resolveResponse(json)
}

export function useHomepageModules(entryId?: string) {
  const { data: entries } = useQuery<HomepageEntry[]>(QueryKeys.HOMEPAGE_MODULES, getEntries, {
    staleTime: STALE_TIME_CONTENTFUL,
  })

  const entry = selectEntry(entries, entryId)
  return { data: entry ? processHomepageEntry(entry) : [] }
}

export function useUserProfileInfo(options = {}) {
  const { isLoggedIn } = useAuthContext()

  return useQuery<UserProfileResponse>(QueryKeys.USER_PROFILE, () => api.getnativev1me(), {
    enabled: isLoggedIn,
    ...options,
  })
}
