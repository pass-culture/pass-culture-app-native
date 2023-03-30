import { useEffect, useRef, useState } from 'react'
import { useIsFetching } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'

export const ANIMATION_DELAY = 700 // Time for the skeleton animation to finish

const useShowSkeletonFromFetchingCount = (fetchingCount: number) => {
  const timer = useRef<number>()
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    if (fetchingCount === 0) {
      timer.current = globalThis.setTimeout(() => setShowSkeleton(false), ANIMATION_DELAY)
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [fetchingCount])

  return showSkeleton
}

export const useShowSkeleton = function () {
  const isFetchingHomepageModules = useIsFetching([QueryKeys.HOMEPAGE_MODULES])
  const isFetchingHomeModules = useIsFetching([QueryKeys.HOME_MODULE])
  const fetchingCount = isFetchingHomepageModules + isFetchingHomeModules

  return useShowSkeletonFromFetchingCount(fetchingCount)
}
