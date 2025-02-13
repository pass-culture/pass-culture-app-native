import { ViewToken } from '@shopify/flash-list'
import React, { useEffect, useRef } from 'react'
import {
  ViewabilityConfigCallbackPairs,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Animated, {
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'

type CarouselProps = {
  data: unknown[]
  // We use any on purpose in this file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem: ({ item, index }: { item: any; index: number }) => any
  currentIndex: number
  setIndex: React.Dispatch<React.SetStateAction<number>>
  width: number
  style?: StyleProp<ViewStyle>
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollEnabled?: boolean
  progressValue: SharedValue<number>
  shouldHandleAutoScroll?: boolean
  testID?: string
}

const isWeb = Platform.OS === 'web'

export const Carousel = (props: CarouselProps) => {
  const carouselRef = useAnimatedRef<Animated.FlatList<string>>()

  const { style, width, setIndex, progressValue, data, shouldHandleAutoScroll, currentIndex } =
    props

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    changed: ViewToken[]
    viewableItems: ViewToken[]
  }) => {
    if (viewableItems[0]?.index != null) {
      setIndex(viewableItems[0].index)
    }
  }

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
  }

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      const absoluteProgress = Math.abs(e.contentOffset.x / width)
      progressValue.value = absoluteProgress
    },
  })

  useEffect(() => {
    if (shouldHandleAutoScroll || isWeb) {
      try {
        data.length > 0 && carouselRef.current?.scrollToIndex({ index: currentIndex })
      } catch {
        return
      }
    }
  }, [currentIndex, data, carouselRef, shouldHandleAutoScroll])

  return (
    <Animated.FlatList
      ref={carouselRef}
      horizontal
      testID="carousel"
      keyExtractor={(_, index) => index.toString()}
      style={style}
      snapToInterval={width}
      snapToAlignment="center"
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      getItemLayout={(data, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      onScroll={onScroll}
      bounces={false}
      pagingEnabled
      viewabilityConfigCallbackPairs={
        viewabilityConfigCallbackPairs.current as ViewabilityConfigCallbackPairs
      }
      nestedScrollEnabled
      disableIntervalMomentum
      {...props}
    />
  )
}
