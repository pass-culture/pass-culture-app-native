import React, { PropsWithChildren } from 'react'
import { OnLoadEvent } from 'react-native-fast-image'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

interface OfferImageCarouselItemProps {
  index: number
  imageDimensions: OfferImageContainerDimensions
  imageURL?: string
  imageCredit?: string
  onPress?: (index: number) => void
  isInCarousel?: boolean
  onLoad?: (event: OnLoadEvent) => void
}
export const OfferImageCarouselItem = ({
  index,
  imageDimensions,
  imageURL,
  imageCredit,
  onPress,
  onLoad,
  isInCarousel = false,
  children,
}: PropsWithChildren<OfferImageCarouselItemProps>) => {
  const numberOfIllustration = index + 1
  const accessibilityLabelBase =
    numberOfIllustration > 1
      ? `Voir le carousel de ${numberOfIllustration} illustrations en plein écran`
      : 'Voir l’illustration en plein écran'

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    accessibilityLabelBase,
    imageCredit
  )

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={() => onPress?.(index)}
      accessibilityLabel={computedAccessibilityLabel}
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
}
