import { useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle } from 'react-native'

export const useLayout = () => {
  const [layout, setLayout] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 })

  const onLayout = (event: LayoutChangeEvent) => {
    setLayout(event.nativeEvent.layout)
  }

  return { ...layout, onLayout }
}
