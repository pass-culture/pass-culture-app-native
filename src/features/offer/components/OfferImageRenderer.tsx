import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import { SharedValue } from 'react-native-reanimated'

import { CategoryIdEnum } from 'api/gen'
import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { OfferImageCarousel } from 'features/offer/components/OfferImageCarousel'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

type Props = {
  categoryId: CategoryIdEnum | null
  offerImages: string[]
  shouldDisplayOfferPreview?: boolean
  hasCarousel: boolean
  progressValue: SharedValue<number>
  onPress?: (index: number) => void
}

export const OfferImageRenderer: FunctionComponent<Props> = ({
  categoryId,
  offerImages,
  shouldDisplayOfferPreview,
  hasCarousel,
  progressValue,
  onPress,
}) => {
  const offerBodyImage = offerImages[0] ? (
    <OfferBodyImage imageUrl={offerImages[0]} />
  ) : (
    <OfferBodyImagePlaceholder categoryId={categoryId} />
  )

  return hasCarousel ? (
    <OfferImageCarousel
      progressValue={progressValue}
      offerImages={offerImages}
      onItemPress={onPress}
      shouldDisplayOfferPreview={shouldDisplayOfferPreview}
    />
  ) : (
    <TouchableOpacity onPress={() => onPress?.(0)} disabled={!onPress}>
      <OfferImageWrapper
        testID="offerImageWithoutCarousel"
        imageUrl={offerImages.length ? offerImages[0] : ''}
        shouldDisplayOfferPreview={shouldDisplayOfferPreview && Platform.OS !== 'web'}>
        {offerBodyImage}
      </OfferImageWrapper>
    </TouchableOpacity>
  )
}
