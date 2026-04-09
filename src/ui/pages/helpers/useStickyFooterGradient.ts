import { useCallback, useRef, useState } from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from 'react-native'

import { AnimatedViewRefType } from 'libs/react-native-animatable'

function getShouldShowGradient(contentHeight: number, viewportHeight: number, offsetY: number) {
  const canScroll = contentHeight > viewportHeight + 1
  const isLastContentVisible = offsetY + viewportHeight >= contentHeight - 1
  return canScroll && !isLastContentVisible
}

type Params = {
  hasFixedBottomChildren: boolean
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle'>
  onScrollViewLayout: (event: LayoutChangeEvent) => void
  onScrollViewContentSizeChange: (width: number, height: number) => void
}

export function useStickyFooterGradient({
  hasFixedBottomChildren,
  scrollViewProps,
  onScrollViewLayout,
  onScrollViewContentSizeChange,
}: Params) {
  const gradientRef = useRef<AnimatedViewRefType>(null)
  const isGradientVisibleRef = useRef(false)
  const contentHeightRef = useRef(0)
  const viewportHeightRef = useRef(0)
  const offsetYRef = useRef(0)

  const [bottomChildrenViewHeight, setBottomChildrenViewHeight] = useState(0)

  const onFixedBottomChildrenViewLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setBottomChildrenViewHeight(height)
  }, [])

  const updateGradientVisibility = useCallback(() => {
    if (!hasFixedBottomChildren) {
      isGradientVisibleRef.current = false
      return
    }

    const shouldShowGradient = getShouldShowGradient(
      contentHeightRef.current,
      viewportHeightRef.current,
      offsetYRef.current
    )

    if (isGradientVisibleRef.current === shouldShowGradient) return

    gradientRef.current?.transition(
      { transform: [{ translateY: shouldShowGradient ? 100 : 0 }] },
      { transform: [{ translateY: shouldShowGradient ? 0 : 100 }] },
      500
    )

    isGradientVisibleRef.current = shouldShowGradient
  }, [hasFixedBottomChildren])

  const onChildrenScrollViewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onScrollViewLayout(event)
      scrollViewProps?.onLayout?.(event)
      viewportHeightRef.current = event.nativeEvent.layout.height
      updateGradientVisibility()
    },
    [onScrollViewLayout, scrollViewProps, updateGradientVisibility]
  )

  const onChildrenScrollViewContentSizeChange = useCallback(
    (width: number, height: number) => {
      onScrollViewContentSizeChange(width, height)
      scrollViewProps?.onContentSizeChange?.(width, height)
      contentHeightRef.current = height
      updateGradientVisibility()
    },
    [onScrollViewContentSizeChange, scrollViewProps, updateGradientVisibility]
  )

  const onChildrenScrollViewScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollViewProps?.onScroll?.(event)
      offsetYRef.current = event.nativeEvent.contentOffset.y
      updateGradientVisibility()
    },
    [scrollViewProps, updateGradientVisibility]
  )

  return {
    gradientRef,
    bottomChildrenViewHeight,
    onFixedBottomChildrenViewLayout,
    onChildrenScrollViewLayout,
    onChildrenScrollViewContentSizeChange,
    onChildrenScrollViewScroll,
  }
}
