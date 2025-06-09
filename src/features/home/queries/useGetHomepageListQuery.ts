import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { NoContentError } from 'features/home/pages/NoContentError'
import { Homepage } from 'features/home/types'
import { fetchHomepageNatifContent } from 'libs/contentful/fetchHomepageNatifContent'
import { LogTypeEnum, ScreenError } from 'libs/monitoring/errors'
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

export const useGetHomepageListQuery = (logType: LogTypeEnum): UseQueryResult<Homepage[]> =>
  useQuery<Homepage[]>({
    queryKey: [QueryKeys.HOMEPAGE_MODULES],
    queryFn: () => getHomepageNatifContent(logType),
    staleTime: STALE_TIME_CONTENTFUL,
  })
