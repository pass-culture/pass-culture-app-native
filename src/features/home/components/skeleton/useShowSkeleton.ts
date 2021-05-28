import { useEffect, useState } from 'react'

export const SKELETON_DELAY = 1000

export const useShowSkeleton = (cond: boolean) => {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cond) {
      timer = setTimeout(() => {
        setShowSkeleton(false)
      }, SKELETON_DELAY)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [cond])

  return showSkeleton
}
