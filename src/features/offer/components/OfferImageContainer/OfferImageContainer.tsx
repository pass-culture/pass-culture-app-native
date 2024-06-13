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
import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
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
  const { backgroundHeight, imageStyle } = useOfferImageContainerDimensions()
  const shouldDisplayCarousel = useFeatureFlag('WIP_OFFER_PREVIEW_WITH_CAROUSEL')
  const theme = useTheme()

  const offerImages = imageUrls ?? []

  const hasCarousel = !!(shouldDisplayCarousel && offerImages.length > 1 && !isWeb)
  const progressValue = useSharedValue<number>(0)
  const [index, setIndex] = React.useState(0)
  const offerBodyImage = offerImages[0] ? (
    <OfferBodyImage imageUrl={offerImages[0]} />
  ) : (
    <OfferBodyImagePlaceholder categoryId={categoryId} />
  )
  const carouselDotId = uuidv4()
  const carouselStyle = {
    borderRadius: theme.borderRadius.radius,
  }

  return (
    <HeaderWithImage
      imageHeight={backgroundHeight}
      imageUrl={offerImages[0]}
      onPress={() => onPress(index)}>
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
                setIndex(Math.round(absoluteProgress))
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
          </View>

          {progressValue ? (
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
          ) : null}
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
