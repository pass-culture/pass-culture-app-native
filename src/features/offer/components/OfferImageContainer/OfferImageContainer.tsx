import React, { FunctionComponent, PropsWithChildren, useCallback } from 'react'
import { Platform } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useTheme } from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageRenderer } from 'features/offer/components/OfferImageRenderer'
import {
  offerImageContainerMarginTop,
  useOfferImageContainerDimensions,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { Spacer } from 'ui/theme'

type Props = {
  categoryId: CategoryIdEnum | null
  imageUrls?: string[]
  onPress?: (defaultIndex?: number) => void
}

const isWeb = Platform.OS === 'web'

export const OfferImageContainer: FunctionComponent<Props> = ({
  categoryId,
  imageUrls = [],
  onPress,
}) => {
  const { backgroundHeight } = useOfferImageContainerDimensions()
  const shouldDisplayCarousel = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW_WITH_CAROUSEL
  )
  const { isDesktopViewport } = useTheme()

  const hasCarousel = !!(shouldDisplayCarousel && imageUrls.length > 1)
  const progressValue = useSharedValue<number>(0)

  const Wrapper = useCallback(
    ({ children }: PropsWithChildren) =>
      isWeb && isDesktopViewport ? (
        <React.Fragment>{children}</React.Fragment>
      ) : (
        <HeaderWithImage imageHeight={backgroundHeight} imageUrl={imageUrls[0]}>
          <Spacer.Column numberOfSpaces={offerImageContainerMarginTop} />
          {children}
        </HeaderWithImage>
      ),
    [imageUrls, backgroundHeight, isDesktopViewport]
  )

  return (
    <Wrapper>
      <OfferImageRenderer
        categoryId={categoryId}
        offerImages={imageUrls}
        hasCarousel={hasCarousel}
        progressValue={progressValue}
        onPress={onPress}
      />
    </Wrapper>
  )
}
