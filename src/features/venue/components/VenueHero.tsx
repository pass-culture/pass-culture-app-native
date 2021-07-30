import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { blurImageHeight, HeroHeader } from 'ui/components/headers/HeroHeader'
import { ImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { ColorsEnum, getSpacing, Spacer, getShadow } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  imageUrl: string
  categoryName?: CategoryNameEnum | null
}

// TODO: Créer un composant unique pour VenueHero et OfferHero ui/components/Hero ?
export const VenueHero: React.FC<Props> = ({ imageUrl, categoryName }) => {
  const { top } = useCustomSafeInsets()
  const source = useMemo(() => ({ uri: imageUrl }), [imageUrl])
  const imageHeight = blurImageHeight + top

  return (
    <HeroHeader imageHeight={imageHeight} categoryName={categoryName} imageUrl={imageUrl || ''}>
      <Spacer.Column numberOfSpaces={22} />
      <ImageContainer>
        {imageUrl ? (
          <FastImage style={imageStyle} source={source} resizeMode={FastImage.resizeMode.cover} />
        ) : (
          <ImagePlaceholder categoryName={categoryName || null} size={getSpacing(24)} />
        )}
      </ImageContainer>
    </HeroHeader>
  )
}

const imageWidth = getSpacing(53)
const imageHeight = getSpacing(79)

const imageStyle = {
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  height: imageHeight,
  width: imageWidth,
}

const ImageContainer = styled.View({
  bottom: 0,
  ...imageStyle,
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
