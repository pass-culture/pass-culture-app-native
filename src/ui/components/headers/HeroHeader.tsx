import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { BackgroundPlaceholder } from 'ui/svg/BackgroundPlaceholder'
import { Rectangle } from 'ui/svg/Rectangle'
import { getSpacing, ScreenWidth } from 'ui/theme'

interface Props {
  imageUrl: string
  categoryName?: CategoryNameEnum | null
  imageHeight: number
  minHeight?: number
}

export const HeroHeader: React.FC<Props> = (props) => {
  return (
    <Container minHeight={props.minHeight}>
      <HeroContainer>
        {props.imageUrl ? (
          <BlurImage
            height={props.imageHeight}
            blurRadius={Platform.OS === 'android' ? 5 : 20}
            resizeMode={'cover'}
            source={{ uri: props.imageUrl }}
          />
        ) : (
          <BackgroundPlaceholder
            testID="BackgroundPlaceholder"
            width={ScreenWidth}
            height={props.imageHeight}
          />
        )}
        <Rectangle size={ScreenWidth} />
      </HeroContainer>
      {props.children}
    </Container>
  )
}

export const blurImageHeight = getSpacing(74)

const Container = styled.View<{ minHeight?: number }>`
  align-items: center;
  ${({ minHeight }) => (minHeight ? `min-height: ${minHeight}px;` : '')};
`

const HeroContainer = styled.View({ alignItems: 'center', position: 'absolute' })
const BlurImage = styled.Image<{ height: number }>(({ height }) => ({
  height,
  width: ScreenWidth,
}))
