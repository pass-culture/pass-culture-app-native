import React from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { BackgroundPlaceholder } from 'ui/svg/BackgroundPlaceholder'
import { VenueHeaderBackground } from 'ui/svg/VenueHeaderBackground'

interface Props {
  imageUrl?: string
  imageHeight: number
  type: 'offer' | 'offerv2' | 'venue'
  minHeight?: number
  children?: React.ReactNode
}

export const HeroHeader: React.FC<Props> = (props) => {
  const { appContentWidth } = useTheme()

  const getBackgroundImage = () => {
    if (props.type === 'offer') {
      return (
        <BackgroundPlaceholder
          testID="BackgroundPlaceholder"
          width={appContentWidth}
          height={props.imageHeight}
        />
      )
    } else if (props.type === 'venue') {
      return (
        <BackgroundContainer>
          {Array.from({ length: 9 }).map((_, index) => (
            <VenueHeaderBackground key={index} />
          ))}
        </BackgroundContainer>
      )
    } else {
      return <DefaultImagePlaceholderOfferV2 width={appContentWidth} height={props.imageHeight} />
    }
  }

  const backgroundImage = getBackgroundImage()

  const blurImageRadius = Platform.OS === 'android' ? 5 : 20
  const blurImageTransform = Platform.OS === 'web' ? { transform: 'scale(1.1)' } : {}
  const blurImageStyle = { height: props.imageHeight, width: appContentWidth }
  return (
    <Container minHeight={props.minHeight}>
      <HeroContainer>
        {props.imageUrl ? (
          <Image
            style={blurImageStyle}
            blurRadius={blurImageRadius}
            resizeMode="cover"
            url={props.imageUrl}
            // @ts-ignore FIXME(PC-26465): remove when https://github.com/necolas/react-native-web/issues/2139 is fixed
            {...blurImageTransform}
          />
        ) : (
          backgroundImage
        )}
      </HeroContainer>
      {props.children}
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
