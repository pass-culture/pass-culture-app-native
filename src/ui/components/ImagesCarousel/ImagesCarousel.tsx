import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { PinchableBox } from 'features/offer/components/PinchableBox/PinchableBox'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { CarouselDot } from 'ui/components/CarouselDot/CarouselDot'
import { BlurFooter } from 'ui/components/headers/BlurFooter'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
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

  const progressValue = defaultIndex

  const carouselDotId = uuidv4()

  const numberOfIllustration = defaultIndex + 1
  const title = `Illustration ${numberOfIllustration} sur ${images.length}`

  return (
    <Container>
      <StyledHeader title={title} onGoBack={goBack} />
      {images.map((image, index) => (
        <PinchableBox imageUrl={image} key={index} />
      ))}
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
