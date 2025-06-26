import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { Platform, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'

interface Props {
  imageUrl?: string
  imageHeight: number
  minHeight?: number
  style?: ViewStyle
  children?: React.ReactNode
}

const isWeb = Platform.OS === 'web'
const blurImageRadius = Platform.OS === 'android' ? 5 : 20
const blurImageTransform = isWeb ? { transform: 'scale(1.1)' } : {}

export const HeaderWithImage: FunctionComponent<Props> = ({
  imageUrl,
  imageHeight,
  style,
  children,
}) => {
  const { appContentWidth } = useTheme()

  const blurImageStyle = { height: imageHeight, width: appContentWidth }

  return (
    <Container style={style}>
      <ImageContainer>
        {imageUrl ? (
          <Image
            style={blurImageStyle}
            blurRadius={blurImageRadius}
            resizeMode="cover"
            url={imageUrl}
            // @ts-ignore FIXME(PC-26465): remove when https://github.com/necolas/react-native-web/issues/2139 is fixed
            {...blurImageTransform}
          />
        ) : (
          <DefaultImagePlaceholderOfferV2 width={appContentWidth} height={imageHeight}>
            <BlackGradient />
          </DefaultImagePlaceholderOfferV2>
        )}
      </ImageContainer>
      {children}
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const ImageContainer = styled.View({
  alignItems: 'center',
  position: 'absolute',
  top: 0,
})

const DefaultImagePlaceholderOfferV2 = styled.View<{ width: number; height: number }>(
  ({ theme, width, height }) => ({
    backgroundColor: theme.designSystem.color.background.subtle,
    width,
    height,
  })
)

const BlackGradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0),
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0.1),
  ],
}))({ height: '100%' })
