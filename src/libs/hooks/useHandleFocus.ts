import { useMemo, useState } from 'react'

export const useHandleFocus = () => {
  const [isFocus, setIsFocus] = useState(false)

  return useMemo(() => {
    const onFocus = () => setIsFocus(true)
    const onBlur = () => setIsFocus(false)

    return { onFocus, onBlur, isFocus }
  }, [isFocus])
}
