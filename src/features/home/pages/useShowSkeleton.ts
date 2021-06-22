import { useEffect, useState } from 'react'
import { useIsFetching } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'

export const ANIMATION_DELAY = 700 // Time for the skeleton animation to finish

const useShowSkeletonFromFetchingCount = (fetchingCount: number) => {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (fetchingCount === 0) {
      timeout = global.setTimeout(() => setShowSkeleton(false), ANIMATION_DELAY)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [fetchingCount])

  return showSkeleton
}

export const useShowSkeleton = function () {
  const isFetchingHomepageModules = useIsFetching(QueryKeys.HOMEPAGE_MODULES)
  const isFetchingHomeModules = useIsFetching([QueryKeys.HOME_MODULE])
  const fetchingCount = isFetchingHomepageModules + isFetchingHomeModules

  return useShowSkeletonFromFetchingCount(fetchingCount)
}
