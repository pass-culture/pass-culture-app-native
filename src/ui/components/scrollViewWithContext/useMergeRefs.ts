import { useEffect, useRef, MutableRefObject, RefObject } from 'react'

export const useMergeRefs = <T>(
  ...refs: (
    | MutableRefObject<T | null>
    | ((instance: T | null) => void)
    | RefObject<T>
    | null
    | undefined
  )[]
): RefObject<T> => {
  const targetRef = useRef<T>(null)

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else if (ref) {
        ;(ref as MutableRefObject<T | null>).current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}
