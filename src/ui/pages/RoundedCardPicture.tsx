import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'

import chevalier from 'ui/pages/Chevalierx3.avif'
import { CalqueIllustration } from 'ui/svg/icons/Calque'
import { RoundedCardIllustration } from 'ui/svg/icons/RoundedCardIllustration'

type RoundedCardWithPictureProps = {
  size?: number
  source?: ImageSourcePropType
  testID?: string
  accessibilityLabel?: string
}

export const RoundedCardWithPicture: React.FC<RoundedCardWithPictureProps> = ({
  size = 406,
  source = chevalier,
  testID,
  accessibilityLabel,
}) => {
  const imageSize = size * 0.9

  return (
    <Container style={{ width: size, height: size }} testID={testID}>
      <BackgroundSvg size={size} accessibilityLabel={accessibilityLabel} />

      <OverlayCalque>
        <CalqueIllustration />
      </OverlayCalque>
      <Overlay>
        <CenteredImage
          source={source}
          imageSize={imageSize}
          resizeMode="contain"
          accessible={false}
        />
      </Overlay>
    </Container>
  )
}

const Container = styled.View({
  position: 'relative',
})

const BackgroundSvg = styled(RoundedCardIllustration).attrs(({ theme }) => ({
  color: theme.designSystem.color.background.decorative04,
  color2: theme.designSystem.color.background.brandPrimary,
  width: '100%',
  height: '100%',
}))``

const OverlayCalque = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
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

const CenteredImage = styled.Image<{ imageSize: number }>(({ imageSize }) => ({
  width: imageSize,
  height: imageSize,
}))
