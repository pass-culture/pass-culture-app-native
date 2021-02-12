import { useEffect, useState } from 'react'
import { useIsFetching } from 'react-query'

import { DEFAULT_SPLASHSCREEN_DELAY } from 'libs/splashscreen'

export const ANIMATION_DELAY = 700 // Time for the skeleton animation to finish

export const useShowSkeleton = function () {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const isFetching = useIsFetching({ queryKey: 'algoliaModule' })

  useEffect(() => {
    if (isFetching === 0) {
      // minimum delay so that the tiles images are loaded
      setTimeout(() => setShowSkeleton(false), ANIMATION_DELAY + DEFAULT_SPLASHSCREEN_DELAY)
    }
  }, [isFetching])

  return showSkeleton
}
