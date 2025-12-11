import { useIsFetching } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { QueryKeys } from 'libs/queryKeys'

export const useShowSkeleton = () => {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const isFetching = useIsFetching({
    queryKey: [QueryKeys.HOME_MODULE],
  })

  useEffect(() => {
    if (!isFetching) {
      // We use useState and useEffect here to prevent a "blink" on the initial render.
      // A simple derived state (`isFetching === true`) would be `false` on mount
      // before the queries have initiated. The resulting cascading render is an
      // accepted trade-off for a better user experience.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSkeleton(false)
    }
  }, [isFetching])

  return showSkeleton
}
