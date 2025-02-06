import React, { FunctionComponent } from 'react'
import { useSharedValue } from 'react-native-reanimated'

import { CategoryIdEnum } from 'api/gen'
import {
  offerImageContainerMarginTop,
  useOfferImageContainerDimensions,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { ImageWithCredit } from 'shared/types'
import { getSpacing } from 'ui/theme'

import { OfferImageHeaderWrapper } from './OfferImageHeaderWrapper'
import { OfferImageRenderer } from './OfferImageRenderer'

type Props = {
  categoryId: CategoryIdEnum | null
  images?: ImageWithCredit[]
  onPress?: (defaultIndex?: number) => void
  placeholderImage?: string
}

export const OfferImageContainer: FunctionComponent<Props> = ({
  images = [],
  onPress,
  categoryId,
  placeholderImage,
}) => {
  const { backgroundHeight } = useOfferImageContainerDimensions()

  const progressValue = useSharedValue<number>(0)

  return (
    <OfferImageHeaderWrapper
      imageHeight={backgroundHeight}
      imageUrl={placeholderImage}
      paddingTop={getSpacing(offerImageContainerMarginTop)}>
      <OfferImageRenderer
        offerImages={images}
        placeholderImage={placeholderImage}
        progressValue={progressValue}
        onPress={onPress}
        categoryId={categoryId}
      />
    </OfferImageHeaderWrapper>
  )
}
