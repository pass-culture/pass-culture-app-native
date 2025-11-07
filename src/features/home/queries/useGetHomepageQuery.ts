import { useQuery } from '@tanstack/react-query'

import { adaptHomepageEntry } from 'libs/contentful/adapters/adaptHomepageEntries'
import { fetchHomepageById } from 'libs/contentful/fetchHomepages'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_CONTENTFUL = 24 * 60 * 60 * 1000 // 24 hours

export const useFetchHomepageByIdQuery = (homepageId: string) =>
  useQuery({
    queryKey: [QueryKeys.HOMEPAGE_MODULE, homepageId],
    queryFn: () => fetchHomepageById(homepageId),
    staleTime: STALE_TIME_CONTENTFUL,
    meta: { persist: true },
    select: adaptHomepageEntry,
  })
