import { useFocusEffect } from '@react-navigation/native'
import React, { Ref, useCallback, useRef } from 'react'
import { ViewToken } from 'react-native'

import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'

type ObservedListProps<T> = {
  children: (props: {
    listRef: Ref<T>
    handleViewableItemsChanged: ({ viewableItems }: { viewableItems: ViewToken[] }) => void
  }) => React.ReactNode
  onViewableItemsChanged?: (items: Pick<ViewToken, 'key' | 'index'>[]) => void
}

export const ObservedList = <T,>({ children, onViewableItemsChanged }: ObservedListProps<T>) => {
  const listRef = useRef<T>(null)
  const lastViewableItems = useRef<ViewToken[]>([])
  const isInView = useRef(false)

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

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (isInView.current) {
        onViewableItemsChanged?.(viewableItems.map(({ key, index }) => ({ key, index })))
        lastViewableItems.current = viewableItems
      }
    },
    [onViewableItemsChanged]
  )

  const handleIntersectionObserverChange = useCallback(
    (value: boolean) => {
      isInView.current = value
      if (value) {
        if (lastViewableItems.current?.length) {
          handleViewableItemsChanged({ viewableItems: lastViewableItems.current })
        } else {
          // @ts-expect-error : recordInteraction peut ne pas exister selon la liste
          listRef.current?.recordInteraction?.()
        }
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
