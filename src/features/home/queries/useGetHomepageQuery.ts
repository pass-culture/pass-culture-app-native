import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { Homepage } from 'features/home/types'
import { fetchHomepageById } from 'libs/contentful/fetchHomepages'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_CONTENTFUL = 24 * 60 * 60 * 1000 // 24 hour

export const useFetchHomepageByIdQuery = (homepageId: string): UseQueryResult<Homepage> =>
  useQuery<Homepage>({
    queryKey: [QueryKeys.HOMEPAGE_MODULES, homepageId],
    queryFn: () => fetchHomepageById(homepageId),
    staleTime: STALE_TIME_CONTENTFUL,
  })
