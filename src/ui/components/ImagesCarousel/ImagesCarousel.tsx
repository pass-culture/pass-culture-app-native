import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { PinchableBox } from 'features/offer/components/PinchableBox/PinchableBox'
import { CarouselDot } from 'ui/components/CarouselDot/CarouselDot'
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

type Props = {
  images: string[]
  defaultIndex: number
  goBack: VoidFunction
}

export const ImagesCarousel: FunctionComponent<Props> = ({
  images,
  defaultIndex,
  goBack,
}: Props) => {
  const headerHeight = useGetHeaderHeight()
  const footerHeight = useGetFooterHeight(FOOTER_HEIGHT)

  const progressValue = useSharedValue<number>(defaultIndex)
  const [index, setIndex] = React.useState(defaultIndex)
  const { height: screenHeight, width: screenWidth } = useWindowDimensions()

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
  backgroundColor: theme.designSystem.color.background.default,
}))

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.designSystem.color.background.default, 0.6),
}))

const Footer = styled.View<{ height: number }>(({ theme, height }) => ({
  position: 'absolute',
  width: '100%',
  bottom: 0,
  backgroundColor: theme.designSystem.color.background.default,
  borderColor: theme.designSystem.color.border.subtle,
  borderTopWidth: 1,
  height,
  justifyContent: 'center',
}))

const PaginationContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})
