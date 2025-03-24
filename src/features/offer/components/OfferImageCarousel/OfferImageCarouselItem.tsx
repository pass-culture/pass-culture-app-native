import React, { PropsWithChildren } from 'react'
import { OnLoadEvent } from 'react-native-fast-image'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

interface OfferImageCarouselItemProps {
  index: number
  imageDimensions: OfferImageContainerDimensions
  imageURL?: string
  onPress?: (index: number) => void
  isInCarousel?: boolean
  onLoad?: (event: OnLoadEvent) => void
}
export const OfferImageCarouselItem = ({
  index,
  imageDimensions,
  onPress,
  imageURL,
  onLoad,
  isInCarousel = false,
  children,
}: PropsWithChildren<OfferImageCarouselItemProps>) => (
  <TouchableOpacity
    disabled={!onPress}
    onPress={() => onPress?.(index)}
    accessibilityLabel={`Carousel image ${index + 1}`}
    accessibilityRole={AccessibilityRole.BUTTON}
    delayPressIn={70}>
    <OfferImageWrapper
      imageUrl={imageURL}
      isInCarousel={isInCarousel}
      imageDimensions={imageDimensions}
      shouldDisplayOfferPreview>
      {imageURL ? (
        <OfferBodyImage
          imageUrl={imageURL}
          isInCarousel={isInCarousel}
          onLoad={onLoad}
          imageDimensions={imageDimensions}
        />
      ) : null}
      {children}
    </OfferImageWrapper>
  </TouchableOpacity>
)
