import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import type { ViewToken } from 'react-native'

type ObservedListWithRefProps<T> = {
  onViewableItemsChanged?: (items: Pick<ViewToken, 'key' | 'index'>[]) => void
  children: (params: {
    listRef: React.RefObject<T>
    handleViewableItemsChanged: (info: { viewableItems: ViewToken[] }) => void
  }) => React.ReactNode
}

export const ObservedListWithRef = forwardRef(function ObservedListWithRef<T>(
  { onViewableItemsChanged, children }: ObservedListWithRefProps<T>,
  ref: React.ForwardedRef<T>
) {
  const innerRef = useRef<T>(null)

  useImperativeHandle(ref, () => innerRef.current as T)

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      onViewableItemsChanged?.(viewableItems.map(({ key, index }) => ({ key, index })))
    },
    [onViewableItemsChanged]
  )

  return (
    <React.Fragment>{children({ listRef: innerRef, handleViewableItemsChanged })}</React.Fragment>
  )
}) as <T>(
  p: ObservedListWithRefProps<T> & { ref?: React.ForwardedRef<T> }
) => React.ReactElement | null
