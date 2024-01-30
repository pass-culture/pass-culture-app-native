import { useIsFocused } from '@react-navigation/native'
import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  ReactElement,
} from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
  Text,
} from 'react-native'
import { Button } from 'react-native-share'

import { Typo } from 'ui/theme'

interface CarouselScrollViewProps extends ScrollViewProps {
  itemWidth: number
  scrollViewWidth: number
  onScrollToSlide: (slideIndex: number) => void
  children: ReactNode
}

const Pagination = ({ activeIndex, total }: { activeIndex: number; total: number }) => {
  return (
    <Typo.ButtonText>
      {activeIndex + 1}/{total}
    </Typo.ButtonText>
  )
}

export const CarouselScrollView = forwardRef<
  { goToSlide: (slideIndex: number) => void },
  CarouselScrollViewProps
>(({ itemWidth, scrollViewWidth, onScrollToSlide, ...scrollViewAdditionalProps }, ref) => {
  const scrollViewRef = useRef<ScrollView>(null)
  useImperativeHandle(ref, () => ({
    goToSlide: (slideIndex: number) => {
      scrollViewRef.current?.scrollTo({
        x: itemWidth * slideIndex,
        animated: true,
      })
    },
  }))

  const scrollViewPadding = (scrollViewWidth - itemWidth) / 2

  /**
   * When itemWidth is not the same as the scrollview width, pagingEnabled doesn't work
   * we have to rely on other props, which means you can scroll multiple items at a time
   */
  const snappingOptions: Partial<ScrollViewProps> =
    itemWidth === scrollViewWidth
      ? { pagingEnabled: true }
      : { decelerationRate: 'fast', snapToInterval: itemWidth }

  const setSlideIndexOnScroll = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    /**
     * On certain devices we can have the division x/itemWidth returning ~0.99
     * We add a 10% margin in case that happens, which means we have scrolled 90% of an item we move to the next one
     */
    const epsilon = itemWidth / 10
    onScrollToSlide(Math.floor((x + epsilon) / itemWidth))
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: scrollViewPadding }}
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      {...snappingOptions}
      style={{ width: scrollViewWidth }}
      // Using scrollEventThrottle={0} makes sure we don't get a lot of onScroll events on the JS side
      scrollEventThrottle={0}
      onScroll={setSlideIndexOnScroll}
      {...scrollViewAdditionalProps}
    />
  )
})

CarouselScrollView.displayName = 'CarouselScrollView'

interface Props<TCardProps> {
  cardList: TCardProps[]
  paddingCardContainer: number
  renderCard: (card: TCardProps, index: number) => JSX.Element
  activeIndex: number
  onScrollToSlide: Dispatch<SetStateAction<number>>
  autoplay?: boolean
  containerStyle?: ViewStyle
}

const SCROLL_VIEW_WIDTH = 200
const AUTOPLAY_INTERVAL = 4000

export const PreviewCarousel = <TCardProps extends unknown>({
  cardList,
  paddingCardContainer,
  renderCard,
  activeIndex,
  onScrollToSlide,
  autoplay = false,
  containerStyle,
}: Props<TCardProps>): ReactElement => {
  // We forbid the carousel not focused not to autoplay, even if asked to
  const isAutoplaying = useIsFocused() && autoplay

  const cardCount = cardList.length
  const cardWidth = SCROLL_VIEW_WIDTH - paddingCardContainer

  const scrollViewRef = useRef<ElementRef<typeof CarouselScrollView>>(null)

  const goToNextSlide = useCallback(() => {
    const nextSlideIndex = (activeIndex + 1) % cardCount
    scrollViewRef.current?.goToSlide(nextSlideIndex)
  }, [activeIndex, cardCount])

  const goToPreviousSlide = useCallback(() => {
    const previousSlideIndex = (activeIndex - 1) % cardCount
    scrollViewRef.current?.goToSlide(previousSlideIndex)
  }, [activeIndex, cardCount])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (isAutoplaying) {
      timeout = setTimeout(goToNextSlide, AUTOPLAY_INTERVAL)
    }

    return () => clearTimeout(timeout)
  }, [activeIndex, isAutoplaying, cardCount, goToNextSlide])

  return (
    <View style={containerStyle}>
      <CarouselScrollView
        ref={scrollViewRef}
        itemWidth={cardWidth}
        onScrollToSlide={onScrollToSlide}
        scrollViewWidth={SCROLL_VIEW_WIDTH}
        contentContainerStyle={{
          ...styles.carouselContantContainerStyle,
          paddingHorizontal: paddingCardContainer / 2,
        }}
        testID="Carousel">
        {cardList.map(renderCard)}
      </CarouselScrollView>
      <Button onPress={goToNextSlide}>
        <Text>Click me!</Text>
      </Button>
      <Pagination activeIndex={activeIndex} total={cardCount} />
      <Button onPress={goToPreviousSlide}>
        <Text>Previous click me!</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  carouselContantContainerStyle: {
    flexGrow: 1,
  },
})
