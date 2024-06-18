import React, { FunctionComponent, useRef } from 'react'
import { Platform } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled, { useTheme } from 'styled-components/native'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { WebOfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/WebOfferImageCarouselPagination'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Spacer } from 'ui/theme'

type Props = {
  progressValue: SharedValue<number>
  setIndex: React.Dispatch<React.SetStateAction<number>>
  offerImages: string[]
  shouldDisplayOfferPreview?: boolean
}

const isWeb = Platform.OS === 'web'

export const OfferImageCarousel: FunctionComponent<Props> = ({
  progressValue,
  setIndex,
  offerImages,
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
    setIndex(newIndex)
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
          setIndex(Math.round(absoluteProgress))
        }}
        data={offerImages}
        renderItem={({ item: image }) => (
          <OfferImageWrapper
            imageUrl={image}
            shouldDisplayOfferPreview={shouldDisplayOfferPreview}
            isInCarousel>
            <OfferBodyImage imageUrl={image} isInCarousel />
          </OfferImageWrapper>
        )}
        style={carouselStyle}
      />
      {progressValue ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={isDesktopViewport ? 6 : 4} />
          {isWeb ? (
            <WebOfferImageCarouselPagination
              progressValue={progressValue}
              offerImages={offerImages}
              handlePressButton={handlePressButton}
            />
          ) : (
            <OfferImageCarouselPagination progressValue={progressValue} offerImages={offerImages} />
          )}
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
