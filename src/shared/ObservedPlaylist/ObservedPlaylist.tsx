import { useFocusEffect } from '@react-navigation/native'
import React, { Ref, useCallback, useRef } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { logPlaylistDebug } from 'shared/analytics/logViewItem'
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
      logPlaylistDebug('', `handleViewableItemsChanged called`, {
        isInView: isInView.current,
        viewableItemsCount: viewableItems.length,
        viewableItems: viewableItems.map(({ key, index }) => ({ key, index })),
      })
      if (isInView.current) {
        logPlaylistDebug('', `✅ IS IN VIEW - sending items to tracking`, {
          itemsCount: viewableItems.length,
        })
        onViewableItemsChanged?.(viewableItems.map(({ key, index }) => ({ key, index })))
        lastViewableItems.current = viewableItems
      } else {
        logPlaylistDebug('', `❌  NOT IN VIEW - storing items for later`, {
          itemsCount: viewableItems.length,
        })
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
      logPlaylistDebug('', `Focus effect triggered`, {
        hasLastViewableItems: !!lastViewableItems.current?.length,
        lastViewableItemsCount: lastViewableItems.current?.length || 0,
      })
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
