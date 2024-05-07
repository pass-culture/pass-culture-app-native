import React, { FunctionComponent } from 'react'
import { Platform, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import styled, { useTheme } from 'styled-components/native'
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
import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { Tag } from 'ui/components/Tag/Tag'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Camera } from 'ui/svg/icons/Camera'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  categoryId: CategoryIdEnum | null
  imageUrls?: string[]
  shouldDisplayOfferPreview?: boolean
  onPress?: VoidFunction
}

const isWeb = Platform.OS === 'web'

export const OfferImageContainer: FunctionComponent<Props> = ({
  categoryId,
  imageUrls,
  shouldDisplayOfferPreview,
  onPress,
}) => {
  const { backgroundHeight, imageStyle } = useOfferImageContainerDimensions()
  const shouldDisplayCarousel = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW_WITH_CAROUSEL
  )
  const theme = useTheme()

  const offerImages = imageUrls ?? []

  const hasCarousel = !!(shouldDisplayCarousel && offerImages.length > 1 && !isWeb)
  const progressValue = useSharedValue<number>(0)
  const offerBodyImage = offerImages[0] ? (
    <React.Fragment>
      <OfferBodyImage imageUrl={offerImages[0]} />
      {shouldDisplayOfferPreview ? (
        <StyledTag label="1" Icon={StyledCamera} testID="imageTag" />
      ) : null}
    </React.Fragment>
  ) : (
    <OfferBodyImagePlaceholder categoryId={categoryId} />
  )
  const carouselDotId = uuidv4()
  const carouselStyle = {
    borderRadius: theme.borderRadius.radius,
  }

  return (
    <HeaderWithImage imageHeight={backgroundHeight} imageUrl={offerImages[0]} onPress={onPress}>
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
              data={offerImages}
              renderItem={({ item: image }) => (
                <OfferImageWrapper
                  imageUrl={offerImages[0]}
                  shouldDisplayOfferPreview={shouldDisplayOfferPreview}
                  isInCarousel>
                  <OfferBodyImage imageUrl={image} isInCarousel />
                </OfferImageWrapper>
              )}
              style={carouselStyle}
            />
            {shouldDisplayOfferPreview ? (
              <StyledTag label={String(offerImages.length)} Icon={StyledCamera} testID="imageTag" />
            ) : null}
          </View>

          {!!progressValue && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <PaginationContainer gap={2} testID="offerImageContainerDots">
                {offerImages.map((_, index) => (
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
          imageUrl={offerImages[0]}
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
