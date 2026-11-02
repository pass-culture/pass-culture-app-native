import { useFocusEffect } from '@react-navigation/native'
import React, { RefObject, useCallback, useRef } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'

type ViewableItemsChangedInfo = {
  viewableItems: ViewToken[]
  changed: ViewToken[]
}

type PlaylistRef = {
  recordInteraction: () => void
}

type ObservedPlaylistProps<T extends PlaylistRef> = {
  listRef?: RefObject<T | null>
  children: (props: {
    listRef: RefObject<T | null>
    handleViewableItemsChanged: (info: ViewableItemsChangedInfo) => void
  }) => React.ReactNode
  onIntersectionChange?: (inView: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemViewed?: (item: { key: string; index: number; item: any }) => void
  fill?: boolean
}

export const ObservedPlaylist = <T extends PlaylistRef = FlatList>({
  listRef: listRefProp,
  children,
  onIntersectionChange,
  onItemViewed,
  fill = false,
}: ObservedPlaylistProps<T>) => {
  const internalListRef = useRef<T | null>(null)
  const listRef = listRefProp ?? internalListRef
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
          .forEach(({ key, index, item }) => {
            return onItemViewedRef.current?.({ key, index: index ?? -1, item })
          })
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
    [handleViewableItemsChanged, listRef, onIntersectionChange]
  )

  return (
    <IntersectionObserver onChange={handleIntersectionObserverChange} threshold={0.8} fill={fill}>
      {children({ listRef, handleViewableItemsChanged })}
    </IntersectionObserver>
  )
}
