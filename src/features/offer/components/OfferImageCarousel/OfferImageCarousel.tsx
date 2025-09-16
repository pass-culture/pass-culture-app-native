import React, { ReactElement, useCallback, useRef } from 'react'
import { Animated, StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { ImageWithCredit } from 'shared/types'
import { Typo } from 'ui/theme'

type OfferImageCarouselProps = {
  progressValue: number
  offerImages: ImageWithCredit[]
  imageDimensions: OfferImageContainerDimensions
  onItemPress?: (index: number) => void
  onLoad?: () => void
  style?: StyleProp<ViewStyle>
}

export const OfferImageCarousel: React.FunctionComponent<OfferImageCarouselProps> = ({
  progressValue,
  offerImages,
  imageDimensions,
  onItemPress,
  onLoad,
  style,
}) => {
  const imagesLoadedCount = useRef(0)

  const handleImageLoad = useCallback(() => {
    imagesLoadedCount.current += 1

    if (imagesLoadedCount.current === offerImages.length + progressValue) {
      onLoad?.()
    }
  }, [offerImages.length, onLoad, progressValue])

  const renderItem: ({ item, index }: { item: ImageWithCredit; index: number }) => ReactElement =
    useCallback(
      ({ index, item }) => (
        <Animated.View>
          <OfferImageCarouselItem
            index={index}
            imageDimensions={imageDimensions}
            imageURL={item.url}
            onLoad={handleImageLoad}
            onPress={onItemPress}
            isInCarousel
          />
        </Animated.View>
      ),
      [handleImageLoad, imageDimensions, onItemPress]
    )

  const currentCredit = offerImages[Math.round(0)]?.credit

  return (
    <View style={style}>
      {offerImages.map((offerImage, index) => renderItem({ item: offerImage, index }))}
      <Container>
        {currentCredit ? <CopyrightText numberOfLines={2}>© {currentCredit}</CopyrightText> : null}
      </Container>
    </View>
  )
}

const CopyrightText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  width: 0,
  flexGrow: 1,
  textAlign: 'right',
}))

const Container = styled.View({
  flexDirection: 'row',
})
