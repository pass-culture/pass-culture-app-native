import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Tag } from 'ui/components/Tag/Tag'
import { Camera } from 'ui/svg/icons/Camera'
import { getShadow, getSpacing } from 'ui/theme'

type Props = {
  children: React.ReactNode
  nbImages: number
  imageUrl?: string
  shouldDisplayOfferPreview?: boolean
  isSticky?: boolean
  testID?: string
}

export const OfferImageWrapper: FunctionComponent<Props> = ({
  children,
  nbImages,
  imageUrl,
  shouldDisplayOfferPreview,
  isSticky,
  testID = 'imageContainer',
}) => {
  const { imageStyle } = useOfferImageContainerDimensions()
  const headerHeight = useGetHeaderHeight()

  return (
    <Container style={imageStyle} isSticky={isSticky} headerHeight={headerHeight} testID={testID}>
      {imageUrl && shouldDisplayOfferPreview ? (
        <React.Fragment>
          <StyledLinearGradient testID="imageGradient" />
          {children}
          <StyledTag label={String(nbImages)} Icon={StyledCamera} testID="imageTag" />
        </React.Fragment>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </Container>
  )
}

const Container = styled(View)<{ headerHeight: number; isSticky?: boolean }>(
  ({ headerHeight, isSticky, theme }) => ({
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

const StyledLinearGradient = styled(LinearGradient).attrs({
  useAngle: true,
  angle: 180,
  locations: [0.362, 0.6356, 1],
  colors: ['rgba(0, 0, 0, 0.00)', 'rgba(0, 0, 0, 0.12)', 'rgba(0, 0, 0, 0.32)'],
})(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: theme.borderRadius.radius,
  zIndex: 2,
}))

const StyledTag = styled(Tag)({
  position: 'absolute',
  right: getSpacing(2),
  bottom: getSpacing(2),
  zIndex: 3,
})

const StyledCamera = styled(Camera).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
