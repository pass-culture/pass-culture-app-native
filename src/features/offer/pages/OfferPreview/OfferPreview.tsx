import { useRoute } from '@react-navigation/native'
import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { PinchableBox } from 'features/offer/components/PinchableBox/PinchableBox'
import { getOfferImageUrls } from 'features/offer/helpers/getOfferImageUrls/getOfferImageUrls'
import { CarouselDot } from 'ui/CarouselDot/CarouselDot'
import { BlurFooter } from 'ui/components/headers/BlurFooter'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useGetFooterHeight } from 'ui/hooks/useGetFooterHeight/useGetFooterHeight'
import { getSpacing } from 'ui/theme'

const FOOTER_HEIGHT = getSpacing(16)

export const OfferPreview: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'OfferPreview'>>()
  const { goBack } = useGoBack('Offer', { id: params.id })
  const { data: offer } = useOffer({ offerId: params.id })
  const headerHeight = useGetHeaderHeight()
  const footerHeight = useGetFooterHeight(FOOTER_HEIGHT)

  const defaultIndex = params.defaultIndex ?? 0
  const progressValue = useSharedValue<number>(defaultIndex)
  const [index, setIndex] = React.useState(defaultIndex)
  const { height: screenHeight, width: screenWidth } = useWindowDimensions()

  if (!offer?.images) return null

  const images = getOfferImageUrls(offer.images)
  const carouselDotId = uuidv4()

  return (
    <Container>
      <StyledHeader title={`${index + 1}/${images.length}`} onGoBack={goBack} />

      <Carousel
        vertical={false}
        height={screenHeight}
        width={screenWidth}
        loop={false}
        scrollAnimationDuration={500}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress
          setIndex(Math.round(absoluteProgress))
        }}
        defaultIndex={defaultIndex}
        data={images}
        renderItem={({ item: image }) => <PinchableBox imageUrl={image} />}
      />
      {images.length > 1 ? (
        <React.Fragment>
          <BlurFooter height={footerHeight} />
          {progressValue ? (
            <Footer height={footerHeight}>
              <PaginationContainer gap={2}>
                {images.map((_, index) => (
                  <CarouselDot
                    animValue={progressValue}
                    index={index}
                    key={index + carouselDotId}
                  />
                ))}
              </PaginationContainer>
            </Footer>
          ) : null}
        </React.Fragment>
      ) : null}

      <BlurHeader height={headerHeight} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.white, 0.6),
}))

const Footer = styled.View<{ height: number }>(({ theme, height }) => ({
  position: 'absolute',
  width: '100%',
  bottom: 0,
  backgroundColor: colorAlpha(theme.colors.white, 0.6),
  borderColor: theme.colors.greyLight,
  borderWidth: 1,
  height,
  justifyContent: 'center',
}))

const PaginationContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})
