import React, { FunctionComponent, ReactElement, useCallback, useRef } from 'react'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'
import Animated, { FadeIn, SharedValue } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { Carousel } from 'ui/components/Carousel/Carousel'
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
}) => {
  const { imageStyle } = useOfferImageContainerDimensions()
  const { borderRadius, isDesktopViewport } = useTheme()
  const [index, setIndex] = React.useState(0)
  const carouselStyle = useRef({
    borderRadius: borderRadius.radius,
    height: imageStyle.height,
  }).current
  const imagesLoadedCount = useRef(0)

  // TODO(PC-000): this method should be excluded in a dedicated .web file
  const handlePressButton = (direction: 1 | -1) => {
    const newIndex = calculateCarouselIndex({
      currentIndex: progressValue.value,
      direction,
      maxIndex: offerImages.length - 1,
    })
    setIndex(newIndex)
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
    <CarouselContainer width={imageStyle.width}>
      <Carousel
        currentIndex={index}
        width={imageStyle.width}
        setIndex={setIndex}
        data={offerImages}
        renderItem={renderItem}
        scrollEnabled={!isWeb && offerImages.length > 1}
        style={{ ...carouselStyle }}
        progressValue={progressValue}
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

const CarouselContainer = styled(View)<{ width: number }>(({ width }) => ({
  width,
}))
