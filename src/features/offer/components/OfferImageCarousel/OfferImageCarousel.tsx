import React, { FunctionComponent, ReactElement, useCallback, useRef } from 'react'
import { Platform, StyleProp, ViewStyle } from 'react-native'
import Animated, { FadeIn, SharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled, { useTheme } from 'styled-components/native'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Spacer } from 'ui/theme'

type Props = {
  progressValue: SharedValue<number>
  offerImages: string[]
  onItemPress?: (index: number) => void
  onLoad?: () => void
  style?: StyleProp<ViewStyle>
}

const isWeb = Platform.OS === 'web'

export const OfferImageCarousel: FunctionComponent<Props> = ({
  progressValue,
  offerImages,
  onItemPress,
  onLoad,
  style,
}) => {
  const { imageStyle } = useOfferImageContainerDimensions()
  const headerHeight = useGetHeaderHeight()
  const { borderRadius, isDesktopViewport } = useTheme()
  const carouselRef = useRef<ICarouselInstance>(null)
  const carouselStyle = useRef({
    borderRadius: borderRadius.radius,
  }).current
  const isSticky = isWeb && isDesktopViewport
  const imagesLoadedCount = useRef(0)

  // TODO(PC-000): this method should be excluded in a dedicated .web file
  const handlePressButton = (direction: 1 | -1) => {
    const newIndex = calculateCarouselIndex({
      currentIndex: progressValue.value,
      direction,
      maxIndex: offerImages.length - 1,
    })
    progressValue.value = newIndex
    carouselRef.current?.scrollTo({ index: newIndex, animated: true })
  }

  const handleImageLoad = useCallback(() => {
    imagesLoadedCount.current += 1

    if (imagesLoadedCount.current === offerImages.length) {
      onLoad?.()
    }
  }, [offerImages.length, onLoad])

  const renderItem: ({ item, index }: { item: string; index: number }) => ReactElement =
    useCallback(
      ({ index, item }) => (
        <Animated.View entering={FadeIn}>
          <OfferImageCarouselItem
            index={index}
            imageURL={item}
            onLoad={handleImageLoad}
            onPress={onItemPress}
            isInCarousel
          />
        </Animated.View>
      ),
      [onItemPress, handleImageLoad]
    )

  return (
    <CarouselContainer style={style} headerHeight={headerHeight} isSticky={isSticky}>
      <Carousel
        ref={carouselRef}
        testID="offerImageContainerCarousel"
        vertical={false}
        height={imageStyle.height}
        width={imageStyle.width}
        loop={false}
        enabled={!isWeb && offerImages.length > 1}
        scrollAnimationDuration={500}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress
        }}
        data={offerImages}
        renderItem={renderItem}
        style={carouselStyle}
      />
      {offerImages.length > 1 && progressValue ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={isDesktopViewport ? 6 : 4} />

          <OfferImageCarouselPagination
            progressValue={progressValue}
            offerImages={offerImages}
            handlePressButton={handlePressButton}
          />
        </React.Fragment>
      ) : null}
    </CarouselContainer>
  )
}

const CarouselContainer = styled(Animated.View)<{ headerHeight: number; isSticky?: boolean }>(
  ({ headerHeight, isSticky }) => ({
    ...(isSticky ? { position: 'sticky', top: 48 + headerHeight, zIndex: 1 } : {}),
  })
)
