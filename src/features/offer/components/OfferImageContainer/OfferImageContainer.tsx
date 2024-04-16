import React, { FunctionComponent } from 'react'
import { Platform, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CategoryIdEnum } from 'api/gen'
import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import {
  offerImageContainerMarginTop,
  useOfferImageContainerDimensions,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { theme } from 'theme'
import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { Tag } from 'ui/components/Tag/Tag'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Camera } from 'ui/svg/icons/Camera'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  categoryId: CategoryIdEnum | null
  imageUrl?: string
  shouldDisplayOfferPreview?: boolean
  onPress?: VoidFunction
}

const isWeb = Platform.OS === 'web'

const carouselStyle = {
  borderRadius: theme.borderRadius.radius,
}

export const OfferImageContainer: FunctionComponent<Props> = ({
  categoryId,
  imageUrl,
  shouldDisplayOfferPreview,
  onPress,
}) => {
  const { backgroundHeight, imageStyle } = useOfferImageContainerDimensions()
  const shouldDisplayCarousel = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW_WITH_CAROUSEL
  )

  const images = imageUrl ? [imageUrl, imageUrl, imageUrl] : []
  const hasCarousel = !!(shouldDisplayCarousel && images.length && !isWeb)
  const progressValue = useSharedValue<number>(0)
  const offerBodyImage = imageUrl ? (
    <React.Fragment>
      <OfferBodyImage imageUrl={imageUrl} />
      {shouldDisplayOfferPreview ? (
        <StyledTag label="1" Icon={StyledCamera} testID="imageTag" />
      ) : null}
    </React.Fragment>
  ) : (
    <OfferBodyImagePlaceholder categoryId={categoryId} />
  )
  const carouselDotId = uuidv4()

  return (
    <HeaderWithImage imageHeight={backgroundHeight} imageUrl={imageUrl} onPress={onPress}>
      <Spacer.Column numberOfSpaces={offerImageContainerMarginTop} />

      {hasCarousel ? (
        <React.Fragment>
          <View>
            <Carousel
              testID="offerImageContainerCarousel"
              vertical={false}
              height={imageStyle.height}
              width={imageStyle.width}
              loop={false}
              scrollAnimationDuration={500}
              onProgressChange={(_, absoluteProgress) => {
                progressValue.value = absoluteProgress
              }}
              data={images}
              renderItem={({ item: image }) => (
                <OfferImageWrapper
                  imageUrl={imageUrl}
                  shouldDisplayOfferPreview={shouldDisplayOfferPreview}>
                  <OfferBodyImage imageUrl={image} />
                </OfferImageWrapper>
              )}
              style={carouselStyle}
            />
            {shouldDisplayOfferPreview ? (
              <StyledTag label={String(images.length)} Icon={StyledCamera} testID="imageTag" />
            ) : null}
          </View>

          {!!progressValue && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <PaginationContainer gap={2} testID="offerImageContainerDots">
                {images.map((_, index) => (
                  <CarouselDot
                    animValue={progressValue}
                    index={index}
                    key={index + carouselDotId}
                  />
                ))}
              </PaginationContainer>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <OfferImageWrapper
          imageUrl={imageUrl}
          shouldDisplayOfferPreview={shouldDisplayOfferPreview}
          testID="offerImageWithoutCarousel">
          {offerBodyImage}
        </OfferImageWrapper>
      )}
    </HeaderWithImage>
  )
}

const PaginationContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})

const StyledTag = styled(Tag)({
  position: 'absolute',
  right: getSpacing(2),
  bottom: getSpacing(2),
  zIndex: 3,
})

const StyledCamera = styled(Camera).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
