import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'

import {
  OfferImageCarouselBase,
  OfferImageCarouselBaseProps,
} from 'features/offer/components/OfferImageCarousel/OfferImageCarouselBase'
import { OfferImageCarouselDots } from 'features/offer/components/OfferImageCarouselDots/OfferImageCarouselDots'
import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const OfferImageCarousel = forwardRef<ICarouselInstance, OfferImageCarouselBaseProps>(
  function OfferImageCarousel(props, ref) {
    const { offerImages, progressValue } = props
    const offerImagesUrl = offerImages.map((image) => image.url)
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
        {...props}
        ref={carouselRef}
        enabled={false}
        pagination={
          offerImages.length > 1 && progressValue ? (
            <PaginationContainer gap={6}>
              <RoundedButton
                iconName="previous"
                onPress={() => handlePressButton(-1)}
                accessibilityLabel="Image précédente"
              />
              <OfferImageCarouselDots
                progressValue={progressValue}
                offerImages={offerImagesUrl}
                gap={1.3}
              />
              <RoundedButton
                iconName="next"
                onPress={() => handlePressButton(1)}
                accessibilityLabel="Image suivante"
              />
            </PaginationContainer>
          ) : undefined
        }
      />
    )
  }
)

const PaginationContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})
