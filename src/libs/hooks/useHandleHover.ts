import { useMemo, useState } from 'react'

export const useHandleHover = () => {
  const [isHover, setIsHover] = useState(false)

  return useMemo(() => {
    const onMouseEnter = () => setIsHover(true)
    const onMouseLeave = () => setIsHover(false)

    return { onMouseEnter, onMouseLeave, isHover }
  }, [isHover])
}
