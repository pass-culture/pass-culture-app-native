import { OnLoadEvent } from '@d11/react-native-fast-image'
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Platform, View } from 'react-native'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

interface OfferImageCarouselItemProps {
  index: number
  imageDimensions: OfferImageContainerDimensions
  imageURL?: string
  imageCredit?: string
  onPress?: (index: number) => void
  isInCarousel?: boolean
  isActive?: boolean
  onLoad?: (event: OnLoadEvent) => void
  onFocusChange?: (isFocused: boolean) => void
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
  isActive = true,
  onFocusChange,
  children,
}: PropsWithChildren<OfferImageCarouselItemProps>) => {
  const { onFocus, onBlur } = useHandleFocus()
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const slideRef = useRef<View>(null)

  const hasError = !!imageURL && failedUrl === imageURL
  const isPressable = !!onPress && imageURL && !hasError
  const isHiddenSlide = !isActive

  // To avoid focus on carousel hidden element
  const toggleInertAttribute = useCallback(() => {
    if (!isWeb) return
    const node = slideRef.current as unknown as HTMLElement | null
    if (!node) return

    if (isHiddenSlide) {
      node.setAttribute('inert', '')
    } else {
      node.removeAttribute('inert')
    }
  }, [isHiddenSlide])

  useEffect(() => {
    toggleInertAttribute()
  }, [toggleInertAttribute])

  const numberOfIllustration = index + 1
  const accessibilityLabelBase =
    numberOfIllustration > 1
      ? `Voir le carousel de ${numberOfIllustration} illustrations en plein écran`
      : 'Voir l’illustration en plein écran'

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    accessibilityLabelBase,
    imageCredit
  )

  const handleOnFocus = () => {
    onFocus()
    onFocusChange?.(true)
  }

  const handleOnBlur = () => {
    onBlur()
    onFocusChange?.(false)
  }

  return (
    <View
      ref={slideRef}
      aria-hidden={isHiddenSlide}
      accessibilityElementsHidden={isHiddenSlide}
      importantForAccessibility={isHiddenSlide ? 'no-hide-descendants' : 'auto'}>
      <TouchableOpacity
        accessible={!isHiddenSlide}
        disabled={!isPressable}
        focusable={!isHiddenSlide}
        onPress={() => onPress?.(index)}
        onFocus={isWeb ? handleOnFocus : undefined}
        onBlur={isWeb ? handleOnBlur : undefined}
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
      </TouchableOpacity>
    </View>
  )
}
