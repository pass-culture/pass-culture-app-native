import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { HeadlineOfferData } from 'features/headlineOffer/type'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'

import { HeadlineOfferLargeViewport } from './HeadlineOfferLargeViewport'
import { HeadlineOfferSmallViewport } from './HeadlineOfferSmallViewport'

const HEADLINE_OFFER_LARGE_VIEWPORT = 327
const HEADLINE_OFFER_SMALL_VIEWPORT = 245

type HeadlineOfferProps = HeadlineOfferData &
  Pick<InternalTouchableLinkProps, 'navigateTo' | 'onBeforeNavigate'>

export const HeadlineOffer: FunctionComponent<HeadlineOfferProps> = ({
  navigateTo,
  onBeforeNavigate,
  imageUrl,
  ...otherProps
}) => {
  const { isDesktopViewport } = useTheme()
  const HeadlineOfferContent = isDesktopViewport
    ? HeadlineOfferLargeViewport
    : HeadlineOfferSmallViewport
  return (
    <Container navigateTo={navigateTo} onBeforeNavigate={onBeforeNavigate}>
      <BackgroundImage url={imageUrl} />
      <Gradient />
      <StyledView>
        <HeadlineOfferContent imageUrl={imageUrl} {...otherProps} />
      </StyledView>
    </Container>
  )
}

const Container = styled(InternalTouchableLink)(({ theme }) => ({
  borderRadius: theme.borderRadius.tile,
  overflow: 'hidden',
  height: theme.isDesktopViewport ? HEADLINE_OFFER_LARGE_VIEWPORT : HEADLINE_OFFER_SMALL_VIEWPORT,
  width: '100%',
  justifyContent: 'end',
}))

const Gradient = styled(LinearGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0),
    theme.designSystem.color.background.lockedInverted,
  ],
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

const BackgroundImage = styled(FastImage).attrs({
  resizeMode: 'cover',
})({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
})
