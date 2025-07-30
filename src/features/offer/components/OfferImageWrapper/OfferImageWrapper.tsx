import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { OfferImageContainerDimensions } from 'features/offer/types'

type Props = {
  children: React.ReactNode
  imageDimensions: OfferImageContainerDimensions
  imageUrl?: string
  shouldDisplayOfferPreview?: boolean
  testID?: string
  isInCarousel?: boolean
  style?: StyleProp<ViewStyle>
}

export const OfferImageWrapper: FunctionComponent<Props> = ({
  children,
  imageDimensions,
  imageUrl,
  shouldDisplayOfferPreview,
  testID = 'imageContainer',
  isInCarousel,
  style,
}) => {
  return (
    <Container style={[style, imageDimensions.imageStyle]} testID={testID}>
      {imageUrl && shouldDisplayOfferPreview ? (
        <React.Fragment>
          <StyledLinearGradient testID="imageGradient" isInCarousel={isInCarousel} />
          {children}
        </React.Fragment>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </Container>
  )
}

const Container = styled(View)({
  backgroundColor: 'transparent',
  bottom: 0,
})

const StyledLinearGradient = styled(LinearGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  useAngle: true,
  angle: 180,
  locations: [0.362, 0.6356, 1],
  colors: [
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0),
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0.12),
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0.32),
  ],
}))<{ isInCarousel?: boolean }>(({ theme, isInCarousel }) => ({
  height: '100%',
  width: '100%',
  zIndex: 2,
  ...(isInCarousel ? {} : { borderRadius: theme.designSystem.size.borderRadius.m }),
}))
