import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useTheme } from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { OfferImageCarousel } from 'features/offer/components/OfferImageCarousel'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
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
  const imageUrl = offerImages.length ? offerImages[0] : ''

  const hasCarousel = !!(shouldDisplayCarousel && offerImages.length > 1)
  const progressValue = useSharedValue<number>(0)
  const [index, setIndex] = React.useState(0)

  const offerBodyImage = offerImages[0] ? (
    <OfferBodyImage imageUrl={offerImages[0]} />
  ) : (
    <OfferBodyImagePlaceholder categoryId={categoryId} />
  )

  const renderImageContainer = ({ isSticky }: { isSticky?: boolean }) => {
    return hasCarousel ? (
      <OfferImageCarousel
        progressValue={progressValue}
        setIndex={setIndex}
        offerImages={offerImages}
        shouldDisplayOfferPreview={shouldDisplayOfferPreview}
        hasScrollEnabled={!isWeb}
        isSticky={isSticky}
      />
    ) : (
      <OfferImageWrapper
        testID="offerImageWithoutCarousel"
        imageUrl={imageUrl}
        shouldDisplayOfferPreview={shouldDisplayOfferPreview && !isWeb}
        isSticky={isSticky}>
        {offerBodyImage}
      </OfferImageWrapper>
    )
  }

  return isWeb && isDesktopViewport ? (
    renderImageContainer({ isSticky: true })
  ) : (
    <HeaderWithImage
      imageHeight={backgroundHeight}
      imageUrl={offerImages[0]}
      onPress={isWeb ? undefined : () => onPress(index)}>
      <Spacer.Column numberOfSpaces={offerImageContainerMarginTop} />
      {renderImageContainer({})}
    </HeaderWithImage>
  )
}
