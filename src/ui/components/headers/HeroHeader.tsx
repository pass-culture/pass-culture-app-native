import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { BackgroundPlaceholder } from 'ui/svg/BackgroundPlaceholder'
import { Rectangle } from 'ui/svg/Rectangle'
import { getSpacing, ScreenWidth } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  imageUrl: string
  categoryName?: CategoryNameEnum | null
}

export const HeroHeader: React.FC<Props> = (props) => {
  const { top } = useCustomSafeInsets()
  return (
    <Container>
      <HeroContainer>
        {props.imageUrl ? (
          <BlurImage
            extraHeight={top}
            blurRadius={Platform.OS === 'android' ? 5 : 20}
            resizeMode={'cover'}
            source={{ uri: props.imageUrl }}
          />
        ) : (
          <BackgroundPlaceholder
            testID="BackgroundPlaceholder"
            width={ScreenWidth}
            height={blurImageHeight + top}
          />
        )}
        <Rectangle size={ScreenWidth} />
      </HeroContainer>
      {props.children}
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const blurImageHeight = getSpacing(74)

const HeroContainer = styled.View({ alignItems: 'center', position: 'absolute' })
const BlurImage = styled.Image<{ extraHeight: number }>(({ extraHeight }) => ({
  height: blurImageHeight + extraHeight,
  width: ScreenWidth,
}))
