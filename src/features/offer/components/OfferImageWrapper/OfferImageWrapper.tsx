import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { OfferImageContainerDimensions } from 'features/offer/types'
import { getShadow, getSpacing } from 'ui/theme'

type Props = {
  children: React.ReactNode
  imageDimensions: OfferImageContainerDimensions
  imageUrl?: string
  shouldDisplayOfferPreview?: boolean
  testID?: string
  isInCarousel?: boolean
  withDropShadow?: boolean
  style?: StyleProp<ViewStyle>
}

export const OfferImageWrapper: FunctionComponent<Props> = ({
  children,
  imageDimensions,
  imageUrl,
  shouldDisplayOfferPreview,
  testID = 'imageContainer',
  isInCarousel,
  withDropShadow,
  style,
}) => {
  return (
    <Container
      style={[style, imageDimensions.imageStyle]}
      withDropShadow={withDropShadow}
      testID={testID}>
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

const Container = styled(View)<{
  withDropShadow?: boolean
}>(({ withDropShadow, theme }) => ({
  backgroundColor: 'transparent',
  bottom: 0,
  ...(withDropShadow
    ? getShadow({
        shadowOffset: {
          width: 0,
          height: getSpacing(2),
        },
        shadowRadius: getSpacing(3),
        shadowColor: theme.colors.black,
        shadowOpacity: 0.2,
      })
    : {}),
}))

const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
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
  ...(isInCarousel ? {} : { borderRadius: theme.borderRadius.radius }),
}))
