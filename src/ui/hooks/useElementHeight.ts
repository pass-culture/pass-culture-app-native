import { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'

export const useElementHeight = () => {
  const [elementHeight, setElementHeight] = useState<number>(0)

  const onLayout = (event: LayoutChangeEvent) => {
    if (elementHeight !== 0) return
    const { height } = event.nativeEvent.layout
    setElementHeight(height)
  }

  return { height: elementHeight, onLayout }
}
