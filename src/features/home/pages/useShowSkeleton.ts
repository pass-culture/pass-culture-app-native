import { useEffect, useState } from 'react'
import { QueryCache, useIsFetching, useQueryClient } from 'react-query'

import { DEFAULT_SPLASHSCREEN_DELAY } from 'libs/splashscreen'

export const ANIMATION_DELAY = 700 // Time for the skeleton animation to finish

const hasFetchedSubmodules = (queryCache: QueryCache): boolean => {
  const algoliaModules = queryCache.findAll(['algoliaModule'])
  if (algoliaModules.length === 0) return false
  return algoliaModules.every((q) => !q.state.isFetching)
}

export const useShowSkeleton = function () {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const queryClient = useQueryClient()
  const isFetching = useIsFetching()

  useEffect(() => {
    if (hasFetchedSubmodules(queryClient.getCache())) {
      // minimum delay so that the tiles images are loaded
      setTimeout(() => setShowSkeleton(false), ANIMATION_DELAY + DEFAULT_SPLASHSCREEN_DELAY)
    }
  }, [isFetching])

  return showSkeleton
}
