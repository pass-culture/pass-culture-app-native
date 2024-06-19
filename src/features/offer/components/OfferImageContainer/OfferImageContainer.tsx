import React, { FunctionComponent } from 'react'
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
  shouldDisplayOfferPreview?: boolean
  onPress: (defaultIndex?: number) => void
}

const isWeb = Platform.OS === 'web'

export const OfferImageContainer: FunctionComponent<Props> = ({
  categoryId,
  imageUrls,
  shouldDisplayOfferPreview,
  onPress,
}) => {
  const { backgroundHeight } = useOfferImageContainerDimensions()
  const shouldDisplayCarousel = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW_WITH_CAROUSEL
  )
  const { isDesktopViewport } = useTheme()

  const offerImages = imageUrls ?? []

  const hasCarousel = !!(shouldDisplayCarousel && offerImages.length > 1)
  const progressValue = useSharedValue<number>(0)
  const [index, setIndex] = React.useState(0)

  return isWeb && isDesktopViewport ? (
    <OfferImageRenderer
      categoryId={categoryId}
      offerImages={offerImages}
      shouldDisplayOfferPreview={shouldDisplayOfferPreview}
      hasCarousel={hasCarousel}
      progressValue={progressValue}
      setIndex={setIndex}
    />
  ) : (
    <HeaderWithImage
      imageHeight={backgroundHeight}
      imageUrl={offerImages[0]}
      onPress={isWeb ? undefined : () => onPress(index)}>
      <Spacer.Column numberOfSpaces={offerImageContainerMarginTop} />
      <OfferImageRenderer
        categoryId={categoryId}
        offerImages={offerImages}
        shouldDisplayOfferPreview={shouldDisplayOfferPreview}
        hasCarousel={hasCarousel}
        progressValue={progressValue}
        setIndex={setIndex}
      />
    </HeaderWithImage>
  )
}
