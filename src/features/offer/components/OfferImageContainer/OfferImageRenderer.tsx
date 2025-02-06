import React, { FunctionComponent, useCallback, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, { FadeIn, FadeOut, SharedValue } from 'react-native-reanimated'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { OfferImageCarousel } from 'features/offer/components/OfferImageCarousel/OfferImageCarousel'
import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'

type Props = {
  categoryId: CategoryIdEnum | null
  offerImages?: string[]
  placeholderImage?: string
  progressValue: SharedValue<number>
  onPress?: (index: number) => void
  style?: StyleProp<ViewStyle>
}

export const OfferImageRenderer: FunctionComponent<Props> = ({
  offerImages = [],
  progressValue,
  placeholderImage,
  categoryId,
  onPress,
  style,
}) => {
  const [carouselReady, setCarouselReady] = useState(false)

  const handleCarouselLoad = useCallback(() => {
    setCarouselReady(true)
  }, [setCarouselReady])

  return (
    <Animated.View entering={FadeIn} style={style} testID="imageRenderer">
      <StyledOfferImageCarousel
        progressValue={progressValue}
        offerImages={offerImages}
        onItemPress={onPress}
        onLoad={handleCarouselLoad}
        isReady={carouselReady}
      />
      {carouselReady ? null : (
        <AnimatedImageContainer exiting={FadeOut.delay(100)} testID="placeholderImage">
          <OfferImageCarouselItem imageURL={placeholderImage} onPress={onPress} index={0}>
            <OfferBodyImagePlaceholder categoryId={categoryId} />
          </OfferImageCarouselItem>
        </AnimatedImageContainer>
      )}
    </Animated.View>
  )
}

const StyledOfferImageCarousel = styled(OfferImageCarousel)<{ isReady?: boolean }>(
  ({ isReady }) => ({
    zIndex: isReady ? 2 : 0,
  })
)

const AnimatedImageContainer = styled(Animated.View)({
  zIndex: 1,
  position: 'absolute',
  top: 0,
  left: 0,
})
