import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'

// import bell from 'ui/pages/bell.avif'
// import Alerte from 'ui/pages/Alerte.avif'
import cake from 'ui/pages/cake.avif'

type RoundedCardWithPictureProps = {
  size?: number
  source?: ImageSourcePropType
  testID?: string
  accessibilityLabel?: string
}

export const RoundedCardWithPicture: React.FC<RoundedCardWithPictureProps> = ({
  size = 406,
  source = cake,
  testID,
  accessibilityLabel,
}) => {
  const imageSize = size * 0.9

  return (
    <Container style={{ width: size, height: size }} testID={testID}>
      <Overlay>
        <ImageSquare size={imageSize}>
          <CenteredImage source={source} resizeMode="contain" accessible={false} />
        </ImageSquare>
      </Overlay>
    </Container>
  )
}

const Container = styled.View({
  position: 'relative',
})

const Overlay = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
})

const ImageSquare = styled.View<{ size: number }>(({ size, theme }) => ({
  width: size,
  height: size,
  backgroundColor: theme.designSystem.color.background.decorative04,
  borderTopLeftRadius: 120,
  borderBottomRightRadius: 120,
  justifyContent: 'center',
  alignItems: 'center',
}))

const CenteredImage = styled.Image({
  width: '100%',
  height: '100%',
})
