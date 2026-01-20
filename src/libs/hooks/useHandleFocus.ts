import { useMemo, useState } from 'react'

let isKeyboardNavigation = false
let initialized = false

const isKeyboardFocus = () => {
  const canUseDOM =
    'window' in globalThis && typeof globalThis.window.addEventListener === 'function'

  if (!initialized && canUseDOM) {
    initialized = true
    globalThis.window.addEventListener('mousedown', () => (isKeyboardNavigation = false))
    globalThis.window.addEventListener('touchstart', () => (isKeyboardNavigation = false))
    globalThis.window.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') isKeyboardNavigation = true
    })
  }
  return isKeyboardNavigation
}

export const useHandleFocus = () => {
  const [isFocus, setIsFocus] = useState(false)

  return useMemo(() => {
    const onBlur = () => setIsFocus(false)
    const onFocus = () => {
      if (isKeyboardFocus()) setIsFocus(true)
    }
    return { onFocus, onBlur, isFocus }
  }, [isFocus])
}
