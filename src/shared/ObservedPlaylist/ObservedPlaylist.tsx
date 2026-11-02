import { useFocusEffect } from '@react-navigation/native'
import React, { Ref, useCallback, useRef } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'

type ObservedPlaylistProps = {
  children: (props: {
    listRef: Ref<FlatList>
    handleViewableItemsChanged: ({ viewableItems }: { viewableItems: ViewToken[] }) => void
  }) => React.ReactNode
  onViewableItemsChanged?: (items: Pick<ViewToken, 'key' | 'index'>[]) => void
  onIntersectionChange?: (inView: boolean) => void
}

export const ObservedPlaylist = ({
  children,
  onViewableItemsChanged,
  onIntersectionChange,
}: ObservedPlaylistProps) => {
  const listRef = useRef<FlatList>(null)
  const lastViewableItems = useRef<ViewToken[]>([])
  const isInView = useRef(false)

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (isInView.current) {
        onViewableItemsChanged?.(viewableItems.map(({ key, index }) => ({ key, index })))
        lastViewableItems.current = viewableItems
      } else {
        // Store items even when not in view, so they can be sent when module becomes visible
        lastViewableItems.current = viewableItems
      }
    },
    // We cannot change onViewableItemsChanged on the fly
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useFocusEffect(
    useCallback(() => {
      if (lastViewableItems.current?.length) {
        handleViewableItemsChanged({
          viewableItems: lastViewableItems.current,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  const handleIntersectionObserverChange = useCallback(
    (value: boolean) => {
      isInView.current = value
      onIntersectionChange?.(value)
      if (!value) return

      if (lastViewableItems.current?.length) {
        handleViewableItemsChanged({ viewableItems: lastViewableItems.current })
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
