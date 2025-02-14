import React, { FunctionComponent, ReactElement, useCallback, useRef, useState } from 'react'
import { Platform, View } from 'react-native'
import Animated, { FadeIn, SharedValue } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { ImageWithCredit } from 'shared/types'
import { Carousel } from 'ui/components/Carousel/Carousel'
import { TypoDS, getSpacing } from 'ui/theme'

type Props = {
  progressValue: SharedValue<number>
  offerImages: ImageWithCredit[]
  onItemPress?: (index: number) => void
  onLoad?: () => void
}

const isWeb = Platform.OS === 'web'

export const OfferImageCarousel: FunctionComponent<Props> = ({
  progressValue,
  offerImages,
  onItemPress,
  onLoad,
}) => {
  const { imageStyle } = useOfferImageContainerDimensions()
  const { borderRadius } = useTheme()
  const [index, setIndex] = useState(0)
  const carouselStyle = useRef({
    borderRadius: borderRadius.radius,
    height: imageStyle.height,
  }).current
  const imagesLoadedCount = useRef(0)

  // TODO(PC-000): this method should be excluded in a dedicated .web file
  const handlePressButton = (direction: 1 | -1) => {
    const newIndex = calculateCarouselIndex({
      currentIndex: progressValue.value,
      direction,
      maxIndex: offerImages.length - 1,
    })
    setIndex(newIndex)
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
  const currentCredit = offerImages[Math.round(index)]?.credit

  return (
    <CarouselContainer width={imageStyle.width}>
      <Carousel
        currentIndex={index}
        width={imageStyle.width}
        setIndex={setIndex}
        data={offerImages}
        renderItem={renderItem}
        scrollEnabled={!isWeb && offerImages.length > 1}
        style={{ ...carouselStyle }}
        progressValue={progressValue}
      />

      <Container>
        {currentCredit ? <CopyrightText>© {currentCredit}</CopyrightText> : null}
      </Container>

      {offerImages.length > 1 && progressValue ? (
        <OfferImageCarouselPagination
          progressValue={progressValue}
          offerImages={offerImagesUrl}
          handlePressButton={handlePressButton}
        />
      ) : null}
    </CarouselContainer>
  )
}

const CopyrightText = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greySemiDark,
  textAlign: 'right',
}))

const Container = styled.View(({ theme }) => ({
  height: getSpacing(5),
  marginBottom: theme.isDesktopViewport ? getSpacing(2) : 0,
}))

const CarouselContainer = styled(View)<{ width: number }>(({ width }) => ({
  width,
}))
