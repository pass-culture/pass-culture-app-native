import { useCallback, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'

export function useShouldEnableScrollOnView() {
  const [scrollViewHeight, setScrollViewHeight] = useState(0)
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0)
  const [isScrollEnabled, setIsScrollEnabled] = useState(false)

  const onScrollViewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout
      setScrollViewHeight(height)
      setIsScrollEnabled(scrollViewContentHeight > height)
    },
    [scrollViewContentHeight]
  )

  const onScrollViewContentSizeChange = useCallback(
    (_width: number, height: number) => {
      setScrollViewContentHeight(height)
      setIsScrollEnabled(height > scrollViewHeight)
    },
    [scrollViewHeight]
  )

  return { isScrollEnabled, onScrollViewLayout, onScrollViewContentSizeChange }
}
