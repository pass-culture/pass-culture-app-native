import { useFocusEffect } from '@react-navigation/native'
import React, { Ref, useCallback, useRef } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'

type ViewableItemsChangedInfo = {
  viewableItems: ViewToken[]
  changed: ViewToken[]
}

type ObservedPlaylistProps = {
  children: (props: {
    listRef: Ref<FlatList>
    handleViewableItemsChanged: (info: ViewableItemsChangedInfo) => void
  }) => React.ReactNode
  onIntersectionChange?: (inView: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemViewed?: (item: { key: string; index: number; item: any }) => void
}

export const ObservedPlaylist = ({
  children,
  onIntersectionChange,
  onItemViewed,
}: ObservedPlaylistProps) => {
  const listRef = useRef<FlatList>(null)
  const lastViewableItems = useRef<ViewToken[]>([])
  const isInView = useRef(false)
  // FlatList refuses a new onViewableItemsChanged, so the handler below stays stable
  // and always calls the latest parent callback through this ref.
  const onItemViewedRef = useRef(onItemViewed)
  onItemViewedRef.current = onItemViewed

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems, changed }: ViewableItemsChangedInfo) => {
      if (isInView.current) {
        changed
          .filter((token) => token.isViewable)
          .forEach(({ key, index, item }) =>
            onItemViewedRef.current?.({ key, index: index ?? -1, item })
          )
      }

      // Ignore the empty reset FlatList emits between two layouts, so the last
      // visible items stay available when the module comes back into view.
      if (viewableItems.length > 0) {
        lastViewableItems.current = viewableItems
      }
    },
    []
  )

  useFocusEffect(
    useCallback(() => {
      if (lastViewableItems.current.length === 0) return

      handleViewableItemsChanged({
        viewableItems: lastViewableItems.current,
        changed: lastViewableItems.current,
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  const handleIntersectionObserverChange = useCallback(
    (value: boolean) => {
      isInView.current = value
      onIntersectionChange?.(value)
      if (!value) return

      if (lastViewableItems.current.length > 0) {
        handleViewableItemsChanged({
          viewableItems: lastViewableItems.current,
          changed: lastViewableItems.current,
        })
      } else {
        listRef.current?.recordInteraction()
      }
    },
    [handleViewableItemsChanged, onIntersectionChange]
  )

  return (
    <IntersectionObserver onChange={handleIntersectionObserverChange}>
      {children({ listRef, handleViewableItemsChanged })}
    </IntersectionObserver>
  )
}
