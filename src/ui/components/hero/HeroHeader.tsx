import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BackgroundPlaceholder } from 'ui/svg/BackgroundPlaceholder'
import { VenueHeaderBackground } from 'ui/svg/VenueHeaderBackground'

interface Props {
  imageUrl?: string
  imageHeight: number
  type: 'offer' | 'offerv2' | 'venue'
  minHeight?: number
  children?: React.ReactNode
  onPress?: VoidFunction
}

const isWeb = Platform.OS === 'web'

export const HeroHeader: FunctionComponent<Props> = ({
  imageUrl,
  imageHeight,
  type,
  minHeight,
  children,
  onPress,
}) => {
  const { appContentWidth } = useTheme()

  const getBackgroundImage = () => {
    if (type === 'offer') {
      return (
        <BackgroundPlaceholder
          testID="BackgroundPlaceholder"
          width={appContentWidth}
          height={imageHeight}
        />
      )
    } else if (type === 'venue') {
      return (
        <BackgroundContainer>
          {Array.from({ length: 9 }).map((_, index) => (
            <VenueHeaderBackground key={index} />
          ))}
        </BackgroundContainer>
      )
    } else {
      return <DefaultImagePlaceholderOfferV2 width={appContentWidth} height={imageHeight} />
    }
  }

  const backgroundImage = getBackgroundImage()

  const blurImageRadius = Platform.OS === 'android' ? 5 : 20
  const blurImageTransform = Platform.OS === 'web' ? { transform: 'scale(1.1)' } : {}
  const blurImageStyle = { height: imageHeight, width: appContentWidth }

  return (
    <Container minHeight={minHeight}>
      <HeroContainer>
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
          backgroundImage
        )}
      </HeroContainer>
      {!isWeb ? <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity> : children}
    </Container>
  )
}

const Container = styled.View<{ minHeight?: number }>(({ minHeight = 0 }) => ({
  alignItems: 'center',
  minHeight,
}))

const BackgroundContainer = styled.View({
  flexDirection: 'row',
})

const HeroContainer = styled.View({
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
