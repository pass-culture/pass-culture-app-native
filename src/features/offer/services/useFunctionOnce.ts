import { useRef } from 'react'

// TODO(antoinewg) factoriser avec ui/components/hook/useFunctionOnce
export const useFunctionOnce = (callback: (() => void) | undefined) => {
  const hasRenderedOnce = useRef<boolean>(false)

  return () => {
    if (!hasRenderedOnce.current) {
      hasRenderedOnce.current = true
      if (callback) callback()
    }
  }
}
