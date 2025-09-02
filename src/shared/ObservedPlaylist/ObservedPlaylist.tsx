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
}

export const ObservedPlaylist = ({ children, onViewableItemsChanged }: ObservedPlaylistProps) => {
  const listRef = useRef<FlatList>(null)
  const lastViewableItems = useRef<ViewToken[]>([])
  const isInView = useRef(false)

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!isInView.current) return

      onViewableItemsChanged?.(viewableItems.map(({ key, index }) => ({ key, index })))
      lastViewableItems.current = viewableItems
    },
    [onViewableItemsChanged]
  )

  useFocusEffect(
    useCallback(() => {
      if (lastViewableItems.current.length) {
        handleViewableItemsChanged({
          viewableItems: lastViewableItems.current,
        })
      }
    }, [handleViewableItemsChanged])
  )

  const handleIntersectionObserverChange = useCallback(
    (value: boolean) => {
      isInView.current = value
      if (!value) return

      if (lastViewableItems.current?.length) {
        handleViewableItemsChanged({ viewableItems: lastViewableItems.current })
      } else {
        listRef.current?.recordInteraction()
      }
    },
    [handleViewableItemsChanged]
  )

  return (
    <IntersectionObserver onChange={handleIntersectionObserverChange}>
      {children({ listRef, handleViewableItemsChanged })}
    </IntersectionObserver>
  )
}
