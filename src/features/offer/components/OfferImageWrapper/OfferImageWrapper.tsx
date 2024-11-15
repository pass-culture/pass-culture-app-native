import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { Platform, View } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getShadow, getSpacing } from 'ui/theme'

type Props = {
  children: React.ReactNode
  imageUrl?: string
  shouldDisplayOfferPreview?: boolean
  testID?: string
  isInCarousel?: boolean
}

const isWeb = Platform.OS === 'web'

export const OfferImageWrapper: FunctionComponent<Props> = ({
  children,
  imageUrl,
  shouldDisplayOfferPreview,
  testID = 'imageContainer',
  isInCarousel,
}) => {
  const { imageStyle } = useOfferImageContainerDimensions()
  const headerHeight = useGetHeaderHeight()
  const { isDesktopViewport } = useTheme()

  const isSticky = isWeb && isDesktopViewport

  return (
    <Container style={imageStyle} isSticky={isSticky} headerHeight={headerHeight} testID={testID}>
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

const Container = styled(View)<{ headerHeight: number; isSticky?: boolean }>(
  ({ headerHeight, isSticky, theme }) => ({
    backgroundColor: theme.colors.white,
    bottom: 0,
    ...getShadow({
      shadowOffset: {
        width: 0,
        height: getSpacing(2),
      },
      shadowRadius: getSpacing(3),
      shadowColor: theme.colors.black,
      shadowOpacity: 0.2,
    }),
    // position sticky only works in web
    ...(isSticky ? { position: 'sticky', top: 48 + headerHeight, zIndex: 1 } : {}),
  })
)

const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
  useAngle: true,
  angle: 180,
  locations: [0.362, 0.6356, 1],
  colors: [
    colorAlpha(theme.colors.black, 0),
    colorAlpha(theme.colors.black, 0.12),
    colorAlpha(theme.colors.black, 0.32),
  ],
}))<{ isInCarousel?: boolean }>(({ theme, isInCarousel }) => ({
  height: '100%',
  width: '100%',
  zIndex: 2,
  ...(isInCarousel ? {} : { borderRadius: theme.borderRadius.radius }),
}))
