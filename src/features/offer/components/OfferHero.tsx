import React from 'react'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { blurImageHeight, HeroHeader } from 'ui/components/headers/HeroHeader'
import { ColorsEnum, getSpacing, Spacer, getShadow } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { ImagePlaceholder } from '../atoms/ImagePlaceholder'

interface Props {
  imageUrl: string
  categoryName?: CategoryNameEnum | null
}

export const OfferHero: React.FC<Props> = ({ imageUrl, categoryName }) => {
  const { top } = useCustomSafeInsets()
  const imageHeight = blurImageHeight + top
  return (
    <HeroHeader imageHeight={imageHeight} categoryName={categoryName} imageUrl={imageUrl || ''}>
      <Spacer.Column numberOfSpaces={22} />
      <ImageContainer>
        {imageUrl ? (
          <Image resizeMode="cover" source={{ uri: imageUrl }} />
        ) : (
          <ImagePlaceholder categoryName={categoryName || null} size={getSpacing(24)} />
        )}
      </ImageContainer>
    </HeroHeader>
  )
}

const imageWidth = getSpacing(53)
const imageHeight = getSpacing(79)

const ImageContainer = styled.View({
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
