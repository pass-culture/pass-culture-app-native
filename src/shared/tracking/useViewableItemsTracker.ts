import { useCallback, useRef } from 'react'
import type { ViewToken } from 'react-native'

type Props = {
  onViewableItemsChanged?: (items: Pick<ViewToken, 'key' | 'index'>[]) => void
}

/**
 * Hook to track visible items in a list (FlatList, FlashList, etc.)
 * @param onViewableItemsChanged - The callback to execute when visible elements change.
 * @returns An object containing the `listRef` and `handleViewableItemsChanged` to pass to your list.
 */
export function useViewableItemsTracker<T>({ onViewableItemsChanged }: Props) {
  const listRef = useRef<T>(null)

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (onViewableItemsChanged) {
        const simplifiedItems = viewableItems.map(({ key, index }) => ({ key, index }))
        onViewableItemsChanged(simplifiedItems)
      }
    },
    [onViewableItemsChanged]
  )

  return { listRef, handleViewableItemsChanged }
}
