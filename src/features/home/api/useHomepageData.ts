import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { useSelectHomepageEntry } from 'features/home/helpers/selectHomepageEntry'
import { NoContentError } from 'features/home/pages/NoContentError'
import { Homepage } from 'features/home/types'
import { useDependencies } from 'libs/dependencies/DependenciesContext'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME = 5 * 60 * 1000
export type GetHomeData = () => Promise<Homepage[]>

const getHomepageNatifContent = (getHomeData: GetHomeData, logType: LogTypeEnum) => async () => {
  try {
    return await getHomeData()
  } catch (e) {
    const error = e as Error
    throw new ScreenError(error.message, {
      Screen: NoContentError,
      logType,
    })
  }
}
const useGetHomepageList = () => {
  const { logType } = useLogTypeFromRemoteConfig()
  const { getHomeData } = useDependencies()
  const { data: homepages } = useQuery<Homepage[]>(
    [QueryKeys.HOMEPAGE_MODULES],
    getHomepageNatifContent(getHomeData, logType),
    {
      staleTime: STALE_TIME,
    }
  )
  return homepages
}

const emptyHomepage: Homepage = {
  id: '-1',
  modules: [],
  tags: [],
}
export const useHomepageData = (paramsHomepageEntryId?: string): Homepage => {
  const selectHomepageEntry = useSelectHomepageEntry(paramsHomepageEntryId)
  const homepages = useGetHomepageList()

  const homepage = selectHomepageEntry(homepages ?? []) ?? emptyHomepage

  return useMemo(() => homepage, [homepage])
}
