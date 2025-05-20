import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { useSelectHomepageEntry } from 'features/home/helpers/selectHomepageEntry'
import { NoContentError } from 'features/home/pages/NoContentError'
import { Homepage } from 'features/home/types'
import { fetchHomepageNatifContent } from 'libs/contentful/fetchHomepageNatifContent'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError, LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_CONTENTFUL = 5 * 60 * 1000

const getHomepageNatifContent = async (logType: LogTypeEnum) => {
  try {
    return await fetchHomepageNatifContent()
  } catch (e) {
    const error = e as Error
    throw new ScreenError(error.message, {
      Screen: NoContentError,
      logType,
    })
  }
}

const emptyHomepage: Homepage = {
  id: '-1',
  modules: [],
  tags: [],
}

export const useHomepageData = (paramsHomepageEntryId?: string): Homepage => {
  const selectHomepageEntry = useSelectHomepageEntry(paramsHomepageEntryId)
  const { logType } = useLogTypeFromRemoteConfig()

  // this fetches all homepages available in contentful
  const { data: homepages } = useQuery<Homepage[]>(
    [QueryKeys.HOMEPAGE_MODULES],
    () => getHomepageNatifContent(logType),
    {
      staleTime: STALE_TIME_CONTENTFUL,
    }
  )

  const homepage = selectHomepageEntry(homepages ?? []) ?? emptyHomepage

  return useMemo(() => homepage, [homepage])
}
