import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { ICarouselInstance } from 'react-native-reanimated-carousel'

import {
  OfferImageCarouselBase,
  OfferImageCarouselBaseProps,
} from 'features/offer/components/OfferImageCarousel/OfferImageCarouselBase'
import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'

export const OfferImageCarousel = forwardRef<ICarouselInstance, OfferImageCarouselBaseProps>(
  function OfferImageCarousel(
    { progressValue, offerImages, imageDimensions, onItemPress, onLoad, style },
    ref
  ) {
    const carouselRef = useRef<ICarouselInstance>(null)

    useImperativeHandle(ref, () => carouselRef.current as ICarouselInstance, [])

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
      <OfferImageCarouselBase
        imageDimensions={imageDimensions}
        offerImages={offerImages}
        progressValue={progressValue}
        onItemPress={onItemPress}
        onLoad={onLoad}
        ref={carouselRef}
        style={style}
        handlePressPaginationButton={handlePressButton}
      />
    )
  }
)
