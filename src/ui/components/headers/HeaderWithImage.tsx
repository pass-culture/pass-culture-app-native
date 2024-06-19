import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

interface Props {
  imageUrl?: string
  imageHeight: number
  minHeight?: number
  children?: React.ReactNode
  onPress?: VoidFunction
}

const isWeb = Platform.OS === 'web'
const blurImageRadius = Platform.OS === 'android' ? 5 : 20
const blurImageTransform = isWeb ? { transform: 'scale(1.1)' } : {}

export const HeaderWithImage: FunctionComponent<Props> = ({
  imageUrl,
  imageHeight,
  minHeight,
  children,
  onPress,
}) => {
  const { appContentWidth } = useTheme()

  const blurImageStyle = { height: imageHeight, width: appContentWidth }

  return (
    <Container minHeight={minHeight}>
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
          <DefaultImagePlaceholderOfferV2 width={appContentWidth} height={imageHeight} />
        )}
      </ImageContainer>
      {isWeb ? (
        children
      ) : (
        <TouchableOpacity onPress={onPress} testID="header.touchable">
          {children}
        </TouchableOpacity>
      )}
    </Container>
  )
}

const Container = styled.View<{ minHeight?: number }>(({ minHeight = 0 }) => ({
  alignItems: 'center',
  minHeight,
}))

const ImageContainer = styled.View({
  alignItems: 'center',
  position: 'absolute',
})

const DefaultImagePlaceholderOfferV2 = styled.View<{ width: number; height: number }>(
  ({ theme, width, height }) => ({
    backgroundColor: theme.colors.greyLight,
    width,
    height,
  })
)
