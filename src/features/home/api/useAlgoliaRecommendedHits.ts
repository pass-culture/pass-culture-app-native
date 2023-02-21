import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { IncompleteSearchHit, SearchHit } from 'libs/algolia'
import { fetchOfferHits, filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia'
import { QueryKeys } from 'libs/queryKeys'

export const useAlgoliaRecommendedHits = (
  ids: string[],
  moduleId: string
): SearchHit[] | undefined => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()

  const moduleQueryKey = moduleId
  const { data: hits } = useQuery(
    [QueryKeys.RECOMMENDATION_HITS, moduleQueryKey],
    async () => await fetchOfferHits({ objectIds: ids, isUserUnderage }),
    { enabled: ids.length > 0 }
  )

  return useMemo(() => {
    if (!hits || hits.length === 0) return

    return (hits as IncompleteSearchHit[]).filter(filterOfferHit).map(transformHits) as SearchHit[]
  }, [hits, transformHits])
}
