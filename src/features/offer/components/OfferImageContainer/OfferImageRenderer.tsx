import React, { FunctionComponent, useCallback, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, { FadeIn, FadeOut, SharedValue } from 'react-native-reanimated'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { OfferImageCarousel } from 'features/offer/components/OfferImageCarousel/OfferImageCarousel'
import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { ImageWithCredit } from 'shared/types'
import { Button } from 'ui/designSystem/Button/Button'
import { Play } from 'ui/svg/icons/Play'

type Props = {
  categoryId: CategoryIdEnum | null
  imageDimensions: OfferImageContainerDimensions
  onSeeVideoPress?: VoidFunction
  offerImages?: ImageWithCredit[]
  placeholderImage?: string
  progressValue: SharedValue<number>
  onPress?: (index: number) => void
  style?: StyleProp<ViewStyle>
}

export const OfferImageRenderer: FunctionComponent<Props> = ({
  offerImages = [],
  imageDimensions,
  progressValue,
  placeholderImage,
  categoryId,
  onPress,
  onSeeVideoPress,
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
        imageDimensions={imageDimensions}
        onItemPress={onPress}
        onLoad={handleCarouselLoad}
        isReady={carouselReady}
      />
      {carouselReady ? null : (
        <AnimatedImageContainer exiting={FadeOut.delay(100)} testID="placeholderImage">
          <OfferImageCarouselItem
            imageURL={placeholderImage}
            onPress={onPress}
            index={0}
            imageDimensions={imageDimensions}>
            <OfferBodyImagePlaceholder categoryId={categoryId} />
          </OfferImageCarouselItem>
        </AnimatedImageContainer>
      )}
      {onSeeVideoPress ? (
        <ButtonContainer>
          <Button
            wording="Voir la vidéo"
            onPress={onSeeVideoPress}
            icon={Play}
            variant="tertiary"
            color="neutral"
          />
        </ButtonContainer>
      ) : null}
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

const ButtonContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  marginTop: theme.designSystem.size.spacing.l,
}))
