import { useQuery } from '@tanstack/react-query'

import { adaptHomepageEntry } from 'libs/contentful/adapters/adaptHomepageEntries'
import { fetchHomepageById } from 'libs/contentful/fetchHomepages'
import { QueryKeys } from 'libs/queryKeys'
import { isServerError } from 'shared/isServerError/isServerError'

export const useFetchHomepageByIdQuery = (homepageId: string) =>
  useQuery({
    queryKey: [QueryKeys.HOMEPAGE_MODULE, homepageId],
    queryFn: () => fetchHomepageById(homepageId),
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    staleTime: 60 * 60 * 1000, // 1 hour
    meta: { persist: true },
    select: adaptHomepageEntry,
    throwOnError: (error) => !isServerError(error),
  })
