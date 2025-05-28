import React, { useCallback, useRef, useState } from 'react'
import { FlatList, FlatListProps } from 'react-native'
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated'

export const ExpandingFlatList = <T,>({
  isLoading,
  renderSkeleton,
  data,
  renderItem,
  skeletonListLength = 3,
  animationDuration = 300,
  ...props
}: FlatListProps<T> & {
  animationDuration?: number
  isLoading?: boolean
  skeletonListLength?: number
  renderSkeleton: FlatListProps<T>['renderItem']
}) => {
  const { animatedStyle, onContentSizeChange } = useAnimatedHeight(animationDuration)

  if (isLoading) {
    return (
      <FlatList
        {...props}
        data={Array(skeletonListLength).fill(undefined)}
        renderItem={renderSkeleton}
        onContentSizeChange={onContentSizeChange}
      />
    )
  }

  return (
    <Animated.View style={animatedStyle}>
      <FlatList
        {...props}
        data={data}
        renderItem={renderItem}
        onContentSizeChange={onContentSizeChange}
      />
    </Animated.View>
  )
}

const useAnimatedHeight = (duration: number) => {
  const [contentHeight, setContentHeight] = useState(0)
  const isFirstRender = useRef(true)

  const animatedStyle = useAnimatedStyle(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return { height: contentHeight }
    }

    return {
      height: withTiming(contentHeight, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    }
  }, [contentHeight])

  const onContentSizeChange = useCallback((_width: number, height: number) => {
    setContentHeight(height)
  }, [])

  return { animatedStyle, onContentSizeChange }
}
