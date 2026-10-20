import { OnLoadEvent } from '@d11/react-native-fast-image'
import React, { PropsWithChildren, useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'

interface OfferImageCarouselItemProps {
  index: number
  imageDimensions: OfferImageContainerDimensions
  imageURL?: string
  imageCredit?: string
  onPress?: (index: number) => void
  isInCarousel?: boolean
  onLoad?: (event: OnLoadEvent) => void
}

const isWeb = Platform.OS === 'web'

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
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  const hasError = !!imageURL && failedUrl === imageURL
  const isPressable = !!onPress && imageURL && !hasError

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
      disabled={!isPressable}
      onPress={() => onPress?.(index)}
      onFocus={isWeb ? onFocus : undefined}
      onBlur={isWeb ? onBlur : undefined}
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
            onError={() => setFailedUrl(imageURL)}
            imageDimensions={imageDimensions}
          />
        ) : null}
        {children}
      </OfferImageWrapper>
      {isWeb && isPressable ? <FocusOutline isFocus={isFocus} /> : null}
    </TouchableOpacity>
  )
}

const FocusOutline = styled.View<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 3,
  pointerEvents: 'none',
  ...touchableFocusOutline({ theme, isFocus }),
}))
