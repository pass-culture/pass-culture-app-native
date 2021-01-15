import { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'

export const useElementWidth = () => {
  const [elementWidth, setElementWidth] = useState<number>(0)

  const onLayout = (event: LayoutChangeEvent) => {
    if (elementWidth !== 0) return
    const { width } = event.nativeEvent.layout
    setElementWidth(width)
  }

  return { width: elementWidth, onLayout }
}
