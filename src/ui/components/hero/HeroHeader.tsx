import React from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BackgroundPlaceholder } from 'ui/svg/BackgroundPlaceholder'
import { Rectangle } from 'ui/svg/Rectangle'
import { VenueHeaderBackground } from 'ui/svg/VenueHeaderBackground'

interface Props {
  imageUrl?: string
  imageHeight: number
  type: 'offer' | 'venue'
  minHeight?: number
}

export const HeroHeader: React.FC<Props> = (props) => {
  const { appContentWidth } = useTheme()

  const backgroundImage =
    props.type === 'offer' ? (
      <BackgroundPlaceholder
        testID="BackgroundPlaceholder"
        width={appContentWidth}
        height={props.imageHeight}
      />
    ) : (
      <BackgroundContainer>
        {Array.from({ length: 9 }).map((_, index) => (
          <VenueHeaderBackground key={index} />
        ))}
      </BackgroundContainer>
    )

  return (
    <Container minHeight={props.minHeight}>
      <HeroContainer>
        {props.imageUrl ? (
          <BlurImage
            height={props.imageHeight}
            width={appContentWidth}
            blurRadius={Platform.OS === 'android' ? 5 : 20}
            resizeMode="cover"
            source={{ uri: props.imageUrl }}
            // @ts-ignore TODO: remove when https://github.com/necolas/react-native-web/issues/2139 is fixed
            {...(Platform.OS === 'web' ? { transform: 'scale(1.1)' } : {})}
          />
        ) : (
          backgroundImage
        )}
        <Rectangle size={appContentWidth} />
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

const HeroContainer = styled.View({ alignItems: 'center', position: 'absolute' })

const BlurImage = styled.Image<{ height: number; width: number }>((props) => ({
  height: props.height,
  width: props.width,
}))
