import React, { FunctionComponent, useRef } from 'react'
import { Platform } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled, { useTheme } from 'styled-components/native'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Spacer } from 'ui/theme'

type Props = {
  progressValue: SharedValue<number>
  offerImages: string[]
  shouldDisplayOfferPreview?: boolean
  onItemPress?: (index: number) => void
}

const isWeb = Platform.OS === 'web'

export const OfferImageCarousel: FunctionComponent<Props> = ({
  progressValue,
  offerImages,
  onItemPress,
  shouldDisplayOfferPreview,
}) => {
  const { imageStyle } = useOfferImageContainerDimensions()
  const headerHeight = useGetHeaderHeight()
  const { borderRadius, isDesktopViewport } = useTheme()
  const carouselRef = useRef<ICarouselInstance>(null)
  const carouselStyle = {
    borderRadius: borderRadius.radius,
  }
  const isSticky = isWeb && isDesktopViewport

  const handlePressButton = (direction: 1 | -1) => {
    const newIndex = calculateCarouselIndex({
      currentIndex: progressValue.value,
      direction,
      maxIndex: offerImages.length - 1,
    })
    progressValue.value = newIndex
    carouselRef.current?.scrollTo({ index: newIndex, animated: true })
  }

  return (
    <CarouselContainer
      style={isSticky ? imageStyle : undefined}
      headerHeight={headerHeight}
      isSticky={isSticky}>
      <Carousel
        ref={carouselRef}
        testID="offerImageContainerCarousel"
        vertical={false}
        height={imageStyle.height}
        width={imageStyle.width}
        loop={false}
        enabled={!isWeb}
        scrollAnimationDuration={500}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress
        }}
        data={offerImages}
        renderItem={({ item: image, index }) => (
          <TouchableOpacity
            disabled={!onItemPress}
            onPress={() => onItemPress?.(index)}
            delayPressIn={70}>
            <OfferImageWrapper
              imageUrl={image}
              shouldDisplayOfferPreview={shouldDisplayOfferPreview}
              isInCarousel>
              <OfferBodyImage imageUrl={image} isInCarousel />
            </OfferImageWrapper>
          </TouchableOpacity>
        )}
        style={carouselStyle}
      />
      {progressValue ? (
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

const CarouselContainer = styled.View<{ headerHeight: number; isSticky?: boolean }>(
  ({ headerHeight, isSticky }) => ({
    ...(isSticky ? { position: 'sticky', top: 48 + headerHeight, zIndex: 1 } : {}),
  })
)
