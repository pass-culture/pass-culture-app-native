import { useCallback } from 'react'

export const useLogScrollHandler = (logFunction: VoidFunction) => {
  return useCallback(
    (inView: boolean) => {
      if (inView) {
        logFunction()
      }
    },
    [logFunction]
  )
}
