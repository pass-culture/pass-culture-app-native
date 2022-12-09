import resolveResponse from 'contentful-resolve-response'
import { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'

import { NoContentError } from 'features/home/components/NoContentError'
import { useSelectHomepageEntry } from 'features/home/selectHomepageEntry'
import { ContentTypes, EntryCollection, HomepageEntry, processHomepageEntry } from 'libs/contentful'
import { ProcessedModule } from 'libs/contentful/moduleTypes'
import { env } from 'libs/environment'
import { getExternal } from 'libs/fetch'
import { analytics } from 'libs/firebase/analytics'
import { ScreenError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

const DEPTH_LEVEL = 2
const STALE_TIME_CONTENTFUL = 5 * 60 * 1000

const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com'
export const BASE_URL = `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}`
export const PARAMS = `?include=${DEPTH_LEVEL}&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`

export async function fetchHomepageNatifContent() {
  const url = `${BASE_URL}/entries${PARAMS}`
  const json = await getExternal<EntryCollection<HomepageEntry, ContentTypes.HOMEPAGE_NATIF>>(url)
  return resolveResponse(json)
}

const getHomepageNatifContent = async () => {
  try {
    return await fetchHomepageNatifContent()
  } catch (e) {
    const error = e as Error
    // FIXME(voisinhugo): do we need this optional chaining? If yes, ScreenError should accept undefined message
    throw new ScreenError(error?.message, NoContentError)
  }
}

interface HomepageData {
  homeEntryId: string | undefined
  modules: ProcessedModule[]
  thematicHeader:
    | {
        title: string | undefined
        subtitle: string | undefined
      }
    | undefined
}

export const useHomepageData = (paramsHomepageEntryId?: string): HomepageData => {
  const selectHomepageEntry = useSelectHomepageEntry(paramsHomepageEntryId)
  // this fetches all homepages available in contentful
  const { data: homepageEntries } = useQuery<HomepageEntry[]>(
    QueryKeys.HOMEPAGE_MODULES,
    getHomepageNatifContent,
    {
      staleTime: STALE_TIME_CONTENTFUL,
    }
  )

  const homepageEntry = selectHomepageEntry(homepageEntries || [])
  const homepageEntryId = homepageEntry?.sys.id
  const homepageData = {
    homeEntryId: homepageEntryId,
    modules: homepageEntry ? processHomepageEntry(homepageEntry) : [],
    thematicHeader: homepageEntry?.fields.thematicHeaderTitle
      ? {
          title: homepageEntry?.fields.thematicHeaderTitle,
          subtitle: homepageEntry?.fields.thematicHeaderSubtitle,
        }
      : undefined,
  }

  useEffect(() => {
    if (homepageEntryId) {
      analytics.logConsultHome({ homeEntryId: homepageEntryId })
    }
  }, [homepageEntryId])

  return useMemo(
    () => ({ ...homepageData }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homepageEntryId]
  )
}
