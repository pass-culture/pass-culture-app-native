import React, { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated'

export const ExpandingFlatList = <T,>({
  isLoading,
  renderSkeleton,
  data,
  renderItem,
  skeletonListLength = 3,
  animationDuration = 300,
  ...props
}: Animated.FlatListPropsWithLayout<T> & {
  animationDuration?: number
  isLoading?: boolean
  skeletonListLength?: number
  renderSkeleton: Animated.FlatListPropsWithLayout<T>['renderItem']
}) => {
  const { animatedStyle, onContentSizeChange } = useAnimatedHeight(animationDuration)

  return (
    <View>
      <Animated.FlatList
        {...props}
        data={isLoading ? Array(skeletonListLength).fill(undefined) : data}
        renderItem={isLoading ? renderSkeleton : renderItem}
        style={animatedStyle}
        onContentSizeChange={onContentSizeChange}
      />
    </View>
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
