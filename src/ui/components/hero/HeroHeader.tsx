import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BackgroundPlaceholder } from 'ui/svg/BackgroundPlaceholder'
import { Rectangle } from 'ui/svg/Rectangle'
import { VenueHeaderBackground } from 'ui/svg/VenueHeaderBackground'
import { ScreenWidth } from 'ui/theme'

interface Props {
  imageUrl?: string
  imageHeight: number
  type: 'offer' | 'venue'
  minHeight?: number
}

export const HeroHeader: React.FC<Props> = (props) => {
  const backgroundImage =
    props.type === 'offer' ? (
      <BackgroundPlaceholder
        testID="BackgroundPlaceholder"
        width={ScreenWidth}
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
            blurRadius={Platform.OS === 'android' ? 5 : 20}
            resizeMode="cover"
            source={{ uri: props.imageUrl }}
          />
        ) : (
          backgroundImage
        )}
        <Rectangle size={ScreenWidth} />
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
const BlurImage = styled.Image<{ height: number }>(({ height }) => ({
  height,
  width: ScreenWidth,
}))
