import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/utils'
import {
  fetchAlgoliaHits,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
import { QueryKeys } from 'libs/queryKeys'
import { IncompleteSearchHit, SearchHit } from 'libs/search'

export const useAlgoliaRecommendedHits = (
  ids: string[],
  moduleId: string
): SearchHit[] | undefined => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformAlgoliaHits()

  const moduleQueryKey = moduleId
  const { data: hits } = useQuery(
    [QueryKeys.RECOMMENDATION_HITS, moduleQueryKey],
    async () => await fetchAlgoliaHits(ids, isUserUnderage),
    { enabled: ids.length > 0 }
  )

  return useMemo(() => {
    if (!hits || hits.length === 0) return

    return (hits as IncompleteSearchHit[])
      .filter(filterAlgoliaHit)
      .map(transformHits) as SearchHit[]
  }, [hits, transformHits])
}
