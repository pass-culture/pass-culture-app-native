import React, { FunctionComponent, ReactElement, useCallback, useRef, useState } from 'react'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'
import Animated, { FadeIn, SharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled, { useTheme } from 'styled-components/native'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { ImageWithCredit } from 'shared/types'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  progressValue: SharedValue<number>
  offerImages: ImageWithCredit[]
  onItemPress?: (index: number) => void
  onLoad?: () => void
  style?: StyleProp<ViewStyle>
}

const isWeb = Platform.OS === 'web'

export const OfferImageCarousel: FunctionComponent<Props> = ({
  progressValue,
  offerImages,
  onItemPress,
  onLoad,
  style,
}) => {
  const { imageStyle } = useOfferImageContainerDimensions()
  const { borderRadius } = useTheme()
  const carouselRef = useRef<ICarouselInstance>(null)
  const carouselStyle = useRef({
    borderRadius: borderRadius.radius,
  }).current
  const imagesLoadedCount = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  // TODO(PC-000): this method should be excluded in a dedicated .web file
  const handlePressButton = (direction: 1 | -1) => {
    const newIndex = calculateCarouselIndex({
      currentIndex: progressValue.value,
      direction,
      maxIndex: offerImages.length - 1,
    })
    progressValue.value = newIndex
    carouselRef.current?.scrollTo({ index: newIndex, animated: true })
  }

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
            imageURL={item.url}
            onLoad={handleImageLoad}
            onPress={onItemPress}
            isInCarousel
          />
        </Animated.View>
      ),
      [onItemPress, handleImageLoad]
    )

  const offerImagesUrl = offerImages.map((image) => image.url)
  const currentCredit = offerImages[Math.round(currentIndex)]?.credit

  return (
    <View style={style}>
      <Carousel
        ref={carouselRef}
        testID="offerImageContainerCarousel"
        vertical={false}
        height={imageStyle.height}
        width={imageStyle.width}
        loop={false}
        enabled={!isWeb && offerImages.length > 1}
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
        <OfferImageCarouselPagination
          progressValue={progressValue}
          offerImages={offerImagesUrl}
          handlePressButton={handlePressButton}
        />
      ) : null}
    </View>
  )
}

const CopyrightText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greySemiDark,
  width: 0,
  flexGrow: 1,
  textAlign: 'right',
}))

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.isDesktopViewport ? getSpacing(2) : 0,
  flexDirection: 'row',
}))
