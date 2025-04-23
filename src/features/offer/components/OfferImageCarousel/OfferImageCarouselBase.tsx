import React, {
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import Animated, { FadeIn, SharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled, { useTheme } from 'styled-components/native'

import { OfferImageCarouselItem } from 'features/offer/components/OfferImageCarousel/OfferImageCarouselItem'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { ImageWithCredit } from 'shared/types'
import { Typo, getSpacing } from 'ui/theme'

export type OfferImageCarouselBaseProps = {
  progressValue: SharedValue<number>
  offerImages: ImageWithCredit[]
  imageDimensions: OfferImageContainerDimensions
  enabled?: boolean
  onItemPress?: (index: number) => void
  onLoad?: () => void
  style?: StyleProp<ViewStyle>
  pagination?: ReactNode
}

export const OfferImageCarouselBase = forwardRef<ICarouselInstance, OfferImageCarouselBaseProps>(
  function OfferImageCarouselBase(
    {
      progressValue,
      offerImages,
      imageDimensions,
      enabled,
      onItemPress,
      onLoad,
      style,
      pagination,
    },
    ref
  ) {
    const { borderRadius } = useTheme()
    const carouselInternalRef = useRef<ICarouselInstance>(null)
    const carouselStyle = useRef({
      borderRadius: borderRadius.radius,
    }).current
    const imagesLoadedCount = useRef(0)
    const [currentIndex, setCurrentIndex] = useState(0)

    useImperativeHandle(ref, () => carouselInternalRef.current as ICarouselInstance, [])

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
          ref={carouselInternalRef}
          testID="offerImageContainerCarousel"
          vertical={false}
          height={imageDimensions.imageStyle.height}
          width={imageDimensions.imageStyle.width}
          loop={false}
          enabled={enabled}
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
          {currentCredit ? (
            <CopyrightText numberOfLines={2}>© {currentCredit}</CopyrightText>
          ) : null}
        </Container>

        {pagination}
      </View>
    )
  }
)

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
