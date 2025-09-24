import { useIsFetching } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import { QueryKeys } from 'libs/queryKeys'

export const ANIMATION_DELAY = 700 // Time for the skeleton animation to finish

const useShowSkeletonFromFetchingCount = (fetchingCount: number) => {
  const timer = useRef<NodeJS.Timeout>()
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

export const useShowSkeleton = () => {
  const isFetchingHomepageModules = useIsFetching({
    queryKey: [QueryKeys.HOMEPAGE_MODULES],
  })
  const isFetchingHomeModules = useIsFetching({
    queryKey: [QueryKeys.HOME_MODULE],
  })
  const fetchingCount = isFetchingHomepageModules + isFetchingHomeModules

  return useShowSkeletonFromFetchingCount(fetchingCount)
}
