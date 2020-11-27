import resolveResponse from 'contentful-resolve-response'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import {
  EntryCollection,
  EntryFields,
  HomepageEntries,
  ProcessedModule,
  processHomepageEntries,
} from 'features/home/contentful'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'

export const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
const DEPTH_LEVEL = 2

const adaptHomepageEntries = (
  homepageData: EntryCollection<EntryFields, string>
): HomepageEntries => {
  const formattedResponse = resolveResponse(homepageData)
  /* Support good practice is to configure on Contentful dashboard only 1 contenttype homepage
    But there is not blocking on the dashboard, that's why we select first one here */
  return formattedResponse[0]
}

export async function getHomepageEntries() {
  const json = await getExternal<EntryCollection<EntryFields, string>>(
    `${CONTENTFUL_BASE_URL}` +
      `/spaces/${env.CONTENTFUL_SPACE_ID}` +
      `/environments/${env.CONTENTFUL_ENVIRONMENT}` +
      `/entries?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`
  )
  return adaptHomepageEntries(json)
}

export function useHomepageModules() {
  return useQuery<ProcessedModule[]>('homepageModules', async () =>
    processHomepageEntries(await getHomepageEntries())
  )
}

export function useUserProfileInfo() {
  const { isLoggedIn } = useAuthContext()

  return useQuery<UserProfileResponse>('userProfile', () => api.nativeV1MeGet(), {
    enabled: isLoggedIn,
  })
}
