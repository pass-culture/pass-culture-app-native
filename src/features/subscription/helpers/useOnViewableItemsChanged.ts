import { RefObject, useCallback } from 'react'
import { ViewToken } from 'react-native'

import { AnimatedViewRefType } from 'libs/react-native-animatable'

export const useOnViewableItemsChanged = (
  gradientRef: RefObject<AnimatedViewRefType | null>,
  listItems: Array<unknown>
) => {
  const onViewableItemsChanged = useCallback(
    ({ viewableItems, changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (!gradientRef.current) return

      const lastItem = listItems[listItems.length - 1]
      const lastItemVisibilityChanged = changed.some((view) => view.item === lastItem)

      if (!lastItemVisibilityChanged) return

      const isLastItemVisible = viewableItems.some((view) => {
        if (view.item === lastItem) return view.isViewable
        return false
      })
      gradientRef.current.transition(
        { transform: [{ translateY: isLastItemVisible ? 0 : 100 }] },
        { transform: [{ translateY: isLastItemVisible ? 100 : 0 }] },
        500
      )
    },
    [gradientRef, listItems]
  )
  return { onViewableItemsChanged }
}
