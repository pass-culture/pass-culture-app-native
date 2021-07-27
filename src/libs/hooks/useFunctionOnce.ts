import { useRef } from 'react'

const useFunctionOnce = (callback: (() => void) | undefined) => {
  const hasRenderedOnce = useRef<boolean>(false)

  return () => {
    if (!hasRenderedOnce.current) {
      hasRenderedOnce.current = true
      if (callback) callback()
    }
  }
}

export default useFunctionOnce
