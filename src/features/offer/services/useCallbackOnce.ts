import { useRef } from 'react'

export const useCallbackOnce = (callback: () => void | undefined) => {
  const hasRenderedOnce = useRef<boolean>(false)

  return () => {
    if (!hasRenderedOnce.current) {
      hasRenderedOnce.current = true
      callback()
    }
  }
}
