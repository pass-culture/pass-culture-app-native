import { useEffect, useState } from 'react'
import { useIsFetching } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'

export const ANIMATION_DELAY = 700 // Time for the skeleton animation to finish

export const useShowSkeleton = function () {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const isFetchingHomepageModules = useIsFetching(QueryKeys.HOMEPAGE_MODULES)
  const isFetchingAlgoliaModules = useIsFetching([QueryKeys.ALGOLIA_MODULE])
  const isFetchingOfferIds = useIsFetching(QueryKeys.RECOMMENDATION_OFFER_IDS)
  const isFetchingRecommendedHits = useIsFetching(QueryKeys.RECOMMENDATION_HITS)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (
      isFetchingAlgoliaModules === 0 &&
      isFetchingHomepageModules === 0 &&
      isFetchingOfferIds === 0 &&
      isFetchingRecommendedHits === 0
    ) {
      timeout = global.setTimeout(() => setShowSkeleton(false), ANIMATION_DELAY)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [
    isFetchingAlgoliaModules,
    isFetchingHomepageModules,
    isFetchingOfferIds,
    isFetchingRecommendedHits,
  ])

  return showSkeleton
}
