import { NavigationContainer, useIsFocused } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
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
} from 'react-native'

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
      {activeIndex}/{total}
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

const DEVICE_WIDTH = 500
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
  const cardWidth = DEVICE_WIDTH - paddingCardContainer

  const scrollViewRef = useRef<ElementRef<typeof CarouselScrollView>>(null)

  const goToNextSlide = useCallback(() => {
    const nextSlideIndex = (activeIndex + 1) % cardCount
    scrollViewRef.current?.goToSlide(nextSlideIndex)
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
        scrollViewWidth={DEVICE_WIDTH}
        contentContainerStyle={{
          ...styles.carouselContantContainerStyle,
          paddingHorizontal: paddingCardContainer / 2,
        }}
        testID="Carousel">
        {cardList.map(renderCard)}
      </CarouselScrollView>
      <Pagination activeIndex={activeIndex} total={cardCount} />
    </View>
  )
}

const styles = StyleSheet.create({
  carouselContantContainerStyle: {
    flexGrow: 1,
  },
})

const meta: ComponentMeta<typeof PreviewCarousel> = {
  title: 'features/offer/PreviewCarousel',
  component: PreviewCarousel,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof PreviewCarousel> = (props) => <PreviewCarousel {...props} />
export const StoryName1 = Template.bind({})
StoryName1.args = {
  cardList: [1, 2, 3, 4],
  paddingCardContainer: 20,
  renderCard: (card, index) => (
    <View style={{ height: 300, width: 200, backgroundColor: 'royalblue', marginHorizontal: 16 }}>
      <Typo.Body>{card}</Typo.Body>
    </View>
  ),
  activeIndex: 0,
  onScrollToSlide: () => {},
}
