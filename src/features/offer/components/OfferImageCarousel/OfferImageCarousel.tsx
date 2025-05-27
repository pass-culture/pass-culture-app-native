import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'
import Animated, { FadeIn, SharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled, { useTheme } from 'styled-components/native'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { ImageWithCredit } from 'shared/types'
import { CarouselPagination } from 'ui/components/CarouselPagination/CarouselPagination'
import { Typo, getSpacing } from 'ui/theme'

type OfferImageCarouselProps = {
  progressValue: SharedValue<number>
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
  const { borderRadius } = useTheme()
  const carouselStyle = useRef({
    borderRadius: borderRadius.radius,
  }).current
  const imagesLoadedCount = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const carouselRef = useRef<ICarouselInstance>(null)

  const handleImageLoad = useCallback(() => {
    imagesLoadedCount.current += 1

    if (imagesLoadedCount.current === offerImages.length) {
      onLoad?.()
    }
  }, [offerImages.length, onLoad])

  const renderItem: ({ item, index }: { item: ImageWithCredit; index: number }) => ReactElement =
    useCallback(
      ({ index, item }) => (
        <Animated.View entering={FadeIn}>
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

  const currentCredit = offerImages[Math.round(currentIndex)]?.credit

  return (
    <View style={style}>
      <Carousel
        ref={carouselRef}
        testID="offerImageContainerCarousel"
        vertical={false}
        height={imageDimensions.imageStyle.height}
        width={imageDimensions.imageStyle.width}
        loop={false}
        enabled={Platform.select({ web: false, default: offerImages.length > 1 })}
        scrollAnimationDuration={500}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress
          setCurrentIndex(absoluteProgress)
        }}
        data={offerImages}
        renderItem={renderItem}
        style={carouselStyle}
      />
      <Container>
        {currentCredit ? <CopyrightText numberOfLines={2}>© {currentCredit}</CopyrightText> : null}
      </Container>
      {offerImages.length > 1 && progressValue ? (
        <StyledCarouselPagination
          progressValue={progressValue}
          elementsCount={offerImages.length}
          gap={2}
          carouselRef={carouselRef}
        />
      ) : undefined}
    </View>
  )
}

const CopyrightText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greySemiDark,
  width: 0,
  flexGrow: 1,
  textAlign: 'right',
}))

const Container = styled.View({
  flexDirection: 'row',
})

const StyledCarouselPagination = styled(CarouselPagination)({
  marginTop: getSpacing(4),
})
