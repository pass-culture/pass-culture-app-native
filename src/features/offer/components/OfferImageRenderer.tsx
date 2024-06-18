import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import { SharedValue } from 'react-native-reanimated'

import { CategoryIdEnum } from 'api/gen'
import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { OfferImageCarousel } from 'features/offer/components/OfferImageCarousel'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'

type Props = {
  categoryId: CategoryIdEnum | null
  offerImages: string[]
  shouldDisplayOfferPreview?: boolean
  hasCarousel: boolean
  progressValue: SharedValue<number>
  setIndex: React.Dispatch<React.SetStateAction<number>>
}

export const OfferImageRenderer: FunctionComponent<Props> = ({
  categoryId,
  offerImages,
  shouldDisplayOfferPreview,
  hasCarousel,
  progressValue,
  setIndex,
}) => {
  const offerBodyImage = offerImages[0] ? (
    <OfferBodyImage imageUrl={offerImages[0]} />
  ) : (
    <OfferBodyImagePlaceholder categoryId={categoryId} />
  )

  return hasCarousel ? (
    <OfferImageCarousel
      progressValue={progressValue}
      setIndex={setIndex}
      offerImages={offerImages}
      shouldDisplayOfferPreview={shouldDisplayOfferPreview}
    />
  ) : (
    <OfferImageWrapper
      testID="offerImageWithoutCarousel"
      imageUrl={offerImages.length ? offerImages[0] : ''}
      shouldDisplayOfferPreview={shouldDisplayOfferPreview && Platform.OS !== 'web'}>
      {offerBodyImage}
    </OfferImageWrapper>
  )
}
