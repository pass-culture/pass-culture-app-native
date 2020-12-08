import React from 'react'
import { Dimensions, Platform } from 'react-native'
import styled from 'styled-components/native'

import { Rectangle } from 'ui/svg/Rectangle'
import { getShadow } from 'ui/theme'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  imageUrl: string
}

export const OfferHero: React.FC<Props> = ({ imageUrl }) => {
  const { top } = useCustomSafeInsets()
  return (
    <HeroContainer>
      <React.Fragment>
        <BlurImage
          extraHeight={top}
          blurRadius={Platform.OS === 'android' ? 5 : 20}
          resizeMode={'cover'}
          source={{ uri: imageUrl }}
        />
        {/** Add 1 pixel to avoid 1 white pixel on androids */}
        <Rectangle size={screenWidth + 1} />
        <ImageContainer>
          <Image source={{ uri: imageUrl }} />
        </ImageContainer>
      </React.Fragment>
      <Spacer.Column numberOfSpaces={20} />
    </HeroContainer>
  )
}
const screenWidth = Dimensions.get('window').width

const HeroContainer = styled.View({ alignItems: 'center' })
const BlurImage = styled.Image<{ extraHeight: number }>(({ extraHeight }) => ({
  height: getSpacing(76) + extraHeight,
  width: screenWidth,
}))
const ImageContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(2),
    },
    shadowRadius: getSpacing(3),
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.2,
  }),
})
const Image = styled.Image({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  height: getSpacing(79),
  width: getSpacing(53),
})
