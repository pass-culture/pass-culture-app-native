import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { OfferBackPlaceholder } from 'ui/svg/OfferBackPlaceholder'
import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Spacer, getShadow, ScreenWidth } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ImagePlaceholder } from '../atoms/ImagePlaceholder'

interface Props {
  imageUrl: string
  categoryName?: CategoryNameEnum | null
}

export const OfferHero: React.FC<Props> = ({ imageUrl, categoryName }) => {
  const { top } = useCustomSafeInsets()
  return (
    <HeroContainer>
      {imageUrl ? (
        <BlurImage
          extraHeight={top}
          blurRadius={Platform.OS === 'android' ? 5 : 20}
          resizeMode={'cover'}
          source={{ uri: imageUrl }}
        />
      ) : (
        <OfferBackPlaceholder
          testID="offerBackPlaceholder"
          width={ScreenWidth}
          height={blurImageHeight + top}
        />
      )}
      <Rectangle size={ScreenWidth} />
      <ImageContainer>
        {imageUrl ? (
          <Image resizeMode="cover" source={{ uri: imageUrl }} />
        ) : (
          <ImagePlaceholder categoryName={categoryName || null} size={getSpacing(24)} />
        )}
      </ImageContainer>
      <Spacer.Column numberOfSpaces={18} />
    </HeroContainer>
  )
}
const blurImageHeight = getSpacing(74)

const imageWidth = getSpacing(53)
const imageHeight = getSpacing(79)

const HeroContainer = styled.View({ alignItems: 'center' })
const BlurImage = styled.Image<{ extraHeight: number }>(({ extraHeight }) => ({
  height: blurImageHeight + extraHeight,
  width: ScreenWidth,
}))
const ImageContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  width: imageWidth,
  height: imageHeight,
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
  height: imageHeight,
  width: imageWidth,
})
