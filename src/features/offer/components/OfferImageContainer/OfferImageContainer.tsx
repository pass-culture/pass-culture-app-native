import React, { FunctionComponent, PropsWithChildren, useRef } from 'react'
import { Platform } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useTheme } from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageRenderer } from 'features/offer/components/OfferImageRenderer'
import {
  offerImageContainerMarginTop,
  useOfferImageContainerDimensions,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { Spacer } from 'ui/theme'

type Props = {
  categoryId: CategoryIdEnum | null
  imageUrls?: string[]
  onPress?: (defaultIndex?: number) => void
  placeholderImage?: string
}

const isWeb = Platform.OS === 'web'

export const OfferImageContainer: FunctionComponent<Props> = ({
  imageUrls = [],
  onPress,
  categoryId,
  placeholderImage,
}) => {
  const { backgroundHeight } = useOfferImageContainerDimensions()
  const { isDesktopViewport } = useTheme()

  const progressValue = useSharedValue<number>(0)

  const Wrapper = useRef(({ children }: PropsWithChildren) =>
    isWeb && isDesktopViewport ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <HeaderWithImage imageHeight={backgroundHeight} imageUrl={placeholderImage}>
        <Spacer.Column numberOfSpaces={offerImageContainerMarginTop} />
        {children}
      </HeaderWithImage>
    )
  ).current

  return (
    <Wrapper>
      <OfferImageRenderer
        offerImages={imageUrls}
        placeholderImage={placeholderImage}
        progressValue={progressValue}
        onPress={onPress}
        categoryId={categoryId}
      />
    </Wrapper>
  )
}
