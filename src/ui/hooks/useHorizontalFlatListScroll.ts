import { FlashListRef } from '@shopify/flash-list'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

type UseFlatListScrollArgs = {
  ref: React.RefObject<FlatList | FlashListRef<unknown> | null>
  scrollRatio?: number
  isActive?: boolean
}
export const useHorizontalFlatListScroll = ({
  ref,
  scrollRatio = 1,
  isActive = true,
}: UseFlatListScrollArgs) => {
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [contentWidth, setContentWidth] = useState<number>(0)
  const [scrollPosition, setScrollPosition] = useState<number>(0)
  const [isStart, setIsStart] = useState<boolean>(true)
  const [isEnd, setIsEnd] = useState<boolean>(false)

  useEffect(() => {
    setIsEnd(contentWidth <= containerWidth)
  }, [containerWidth, contentWidth])

  const onContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!isActive) {
        return
      }
      const { width } = event.nativeEvent.layout
      setContainerWidth(width)
    },
    [isActive]
  )

  const onContentSizeChange = useCallback((contentWidth: number, _contentHeight: number) => {
    setContentWidth(contentWidth)
  }, [])

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isActive) {
        return
      }
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent
      const currentScrollPosition = contentOffset.x
      const endScrollPosition = currentScrollPosition + layoutMeasurement.width
      const endPosition = contentSize.width

      setScrollPosition(currentScrollPosition)
      setIsStart(currentScrollPosition <= 0)
      setIsEnd(endScrollPosition >= endPosition - 1) // -1px to make the isEnd being triggered
    },
    [isActive]
  )

  const handleScrollNext = useCallback(() => {
    const nextOffset = scrollPosition + containerWidth * scrollRatio
    ref.current?.scrollToOffset({ offset: nextOffset, animated: true })
  }, [containerWidth, ref, scrollPosition, scrollRatio])

  const handleScrollPrevious = useCallback(() => {
    const prevOffset = Math.max(scrollPosition - containerWidth * scrollRatio, 0)
    ref.current?.scrollToOffset({ offset: prevOffset, animated: true })
  }, [containerWidth, ref, scrollPosition, scrollRatio])

  return {
    isStart,
    isEnd,
    handleScrollNext,
    handleScrollPrevious,
    onScroll,
    onContainerLayout,
    onContentSizeChange,
  }
}
