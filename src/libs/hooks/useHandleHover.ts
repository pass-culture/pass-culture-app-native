import { useMemo, useState } from 'react'
import { useTheme } from 'styled-components/native'

export const useHandleHover = () => {
  const { isTouch } = useTheme()
  const [isHover, setIsHover] = useState(false)

  return useMemo(() => {
    // On touch devices, a tap emits mouseenter without mouseleave, which would keep the hover style
    const onMouseEnter = () => {
      if (!isTouch) setIsHover(true)
    }
    const onMouseLeave = () => setIsHover(false)

    return { onMouseEnter, onMouseLeave, isHover }
  }, [isHover, isTouch])
}
