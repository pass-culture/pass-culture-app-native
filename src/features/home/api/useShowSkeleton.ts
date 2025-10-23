import { useIsFetching } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { QueryKeys } from 'libs/queryKeys'

export const useShowSkeleton = () => {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const isFetchingHomepageModules = useIsFetching({
    queryKey: [QueryKeys.HOMEPAGE_MODULES],
  })
  const isFetchingHomeModules = useIsFetching({
    queryKey: [QueryKeys.HOME_MODULE],
  })
  const fetchingCount = isFetchingHomepageModules + isFetchingHomeModules

  useEffect(() => {
    if (fetchingCount === 0) {
      // We use useState and useEffect here to prevent a "blink" on the initial render.
      // A simple derived state (`fetchingCount > 0`) would be `false` on mount
      // before the queries have initiated. The resulting cascading render is an
      // accepted trade-off for a better user experience.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSkeleton(false)
    }
  }, [fetchingCount])

  return showSkeleton
}
