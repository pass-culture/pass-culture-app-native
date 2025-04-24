import React, { forwardRef } from 'react'
import { ICarouselInstance } from 'react-native-reanimated-carousel'

import { OfferImageCarouselDots } from 'features/offer/components/OfferImageCarouselDots/OfferImageCarouselDots'

import { OfferImageCarouselBase, OfferImageCarouselBaseProps } from './OfferImageCarouselBase'

export const OfferImageCarousel = forwardRef<ICarouselInstance, OfferImageCarouselBaseProps>(
  function OfferImageCarousel(props, ref) {
    const { progressValue, offerImages } = props
    const offerImagesUrl = offerImages.map((image) => image.url)

    return (
      <OfferImageCarouselBase
        {...props}
        ref={ref}
        pagination={
          offerImages.length > 1 && progressValue ? (
            <OfferImageCarouselDots
              progressValue={progressValue}
              offerImages={offerImagesUrl}
              gap={2}
            />
          ) : undefined
        }
        enabled={offerImages.length > 1}
      />
    )
  }
)
