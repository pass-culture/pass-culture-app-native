import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { Image } from 'libs/resizing-image-on-demand/Image'

import { HeadlineOfferLargeViewport } from './HeadlineOfferLargeViewport'
import { HeadlineOfferSmallViewport } from './HeadlineOfferSmallViewport'

const HEADLINE_OFFER_LARGE_VIEWPORT = 327
const HEADLINE_OFFER_SMALL_VIEWPORT = 245

export type HeadlineOfferBaseProps = {
  imageUrl: string
  categoryId: CategoryIdEnum
  category: string
  price: string
  offerTitle?: string
  distance?: string
}

export const HeadlineOffer: FunctionComponent<HeadlineOfferBaseProps> = (props) => {
  const { isDesktopViewport } = useTheme()
  const HeadlineOfferContent = isDesktopViewport
    ? HeadlineOfferLargeViewport
    : HeadlineOfferSmallViewport
  return (
    <Container>
      <BackgroundImage url={props.imageUrl} />
      <Gradient />
      <StyledView>
        <HeadlineOfferContent {...props} />
      </StyledView>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.tile,
  overflow: 'hidden',
  height: theme.isDesktopViewport ? HEADLINE_OFFER_LARGE_VIEWPORT : HEADLINE_OFFER_SMALL_VIEWPORT,
  width: '100%',
  justifyContent: 'end',
}))

const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [colorAlpha(theme.uniqueColors.specificGrey, 0), theme.uniqueColors.specificGrey],
  locations: [0, 0.6],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
}))({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
  zIndex: 1,
})

const StyledView = styled.View({
  height: '100%',
  position: 'relative',
  zIndex: 2,
})

const BackgroundImage = styled(Image).attrs({
  resizeMode: 'cover',
})({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
})
