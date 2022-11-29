import { MutableRefObject, useCallback, useState } from 'react'
import { LayoutChangeEvent, ScrollView } from 'react-native'

import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const useScrollWhenAccordionItemOpens = (
  scrollViewRef: MutableRefObject<ScrollView | null>
): {
  getPositionOnLayout: (event: LayoutChangeEvent) => void
  ScrollTo: () => void
} => {
  const { tabBarHeight, top } = useCustomSafeInsets()
  const [bodyPositionY, setBodyPositionY] = useState<number>(0)
  const ScrollTo = useCallback(() => {
    if (!!scrollViewRef && scrollViewRef !== null && scrollViewRef.current !== null) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: bodyPositionY - (tabBarHeight + top),
        animated: true,
      })
    }
  }, [bodyPositionY, scrollViewRef, tabBarHeight, top])

  const getPositionOnLayout = (event: LayoutChangeEvent) => {
    const position = event.nativeEvent.layout.y
    setBodyPositionY(position)
  }

  return {
    ScrollTo,
    getPositionOnLayout,
  }
}
