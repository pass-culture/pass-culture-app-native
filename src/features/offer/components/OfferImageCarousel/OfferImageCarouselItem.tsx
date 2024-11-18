import React, { PropsWithChildren } from 'react'
import { OnLoadEvent } from 'react-native-fast-image'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

interface OfferImageCarouselItemProps {
  imageURL?: string
  onPress?: (index: number) => void
  index: number
  isInCarousel?: boolean
  onLoad?: (event: OnLoadEvent) => void
}
export const OfferImageCarouselItem = ({
  onPress,
  imageURL,
  index,
  onLoad,
  isInCarousel = false,
  children,
}: PropsWithChildren<OfferImageCarouselItemProps>) => (
  <TouchableOpacity
    disabled={!onPress}
    onPress={() => onPress?.(index)}
    accessibilityLabel={`Carousel image ${index + 1}`}
    accessibilityRole="button"
    delayPressIn={70}>
    <OfferImageWrapper imageUrl={imageURL} isInCarousel={isInCarousel} shouldDisplayOfferPreview>
      {imageURL ? (
        <OfferBodyImage imageUrl={imageURL} isInCarousel={isInCarousel} onLoad={onLoad} />
      ) : null}
      {children}
    </OfferImageWrapper>
  </TouchableOpacity>
)
