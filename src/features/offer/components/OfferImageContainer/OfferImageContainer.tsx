import React, { FunctionComponent } from 'react'
import { useSharedValue } from 'react-native-reanimated'

import { CategoryIdEnum } from 'api/gen'
import { offerImageContainerMarginTop } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { ImageWithCredit } from 'shared/types'
import { getSpacing } from 'ui/theme'

import { OfferImageHeaderWrapper } from './OfferImageHeaderWrapper'
import { OfferImageRenderer } from './OfferImageRenderer'

type Props = {
  categoryId: CategoryIdEnum | null
  imageDimensions: OfferImageContainerDimensions
  images?: ImageWithCredit[]
  onPress?: (defaultIndex?: number) => void
  onSeeVideoPress?: VoidFunction
  placeholderImage?: string
}

export const OfferImageContainer: FunctionComponent<Props> = ({
  images = [],
  onPress,
  categoryId,
  placeholderImage,
  imageDimensions,
  onSeeVideoPress,
}) => {
  const progressValue = useSharedValue<number>(0)

  return (
    <OfferImageHeaderWrapper
      imageHeight={imageDimensions.backgroundHeight}
      imageUrl={placeholderImage}
      paddingTop={getSpacing(offerImageContainerMarginTop)}>
      <OfferImageRenderer
        offerImages={images}
        placeholderImage={placeholderImage}
        progressValue={progressValue}
        onPress={onPress}
        categoryId={categoryId}
        imageDimensions={imageDimensions}
        onSeeVideoPress={onSeeVideoPress}
      />
    </OfferImageHeaderWrapper>
  )
}
