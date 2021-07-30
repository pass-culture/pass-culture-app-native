import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'

import { blurImageHeight, HeroHeader } from '../../components/headers/HeroHeader'
import { ImagePlaceholder } from '../../components/ImagePlaceholder'
import { ColorsEnum, getSpacing, Spacer, getShadow } from '../../theme'
import { BorderRadiusEnum } from '../../theme/grid'
import { useCustomSafeInsets } from '../../theme/useCustomSafeInsets'

interface Props {
  imageUrl: string
  categoryName?: CategoryNameEnum | null
  isLandscapeHero?: boolean | false
}

export const Hero: React.FC<Props> = ({ imageUrl, categoryName, isLandscapeHero }) => {
  const { top } = useCustomSafeInsets()
  const source = useMemo(() => ({ uri: imageUrl }), [imageUrl])

  const numberOfSpacesColumn = isLandscapeHero ? 24 : 22

  const imageHeightBackground = isLandscapeHero
    ? blurImageHeight / 1.3 + top
    : blurImageHeight + top

  const columnMargin = 2 * 6
  const { width } = Dimensions.get('window')
  const imageWidth = isLandscapeHero ? width - getSpacing(columnMargin) : getSpacing(53)
  const imageHeight = isLandscapeHero ? getSpacing(63) : getSpacing(79)

  const imageStyle = {
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight,
    width: imageWidth,
  }

  return (
    <HeroHeader
      imageHeight={imageHeightBackground}
      categoryName={categoryName}
      imageUrl={imageUrl || ''}>
      <Spacer.Column numberOfSpaces={numberOfSpacesColumn} />
      <ImageContainer style={imageStyle}>
        {imageUrl ? (
          <FastImage style={imageStyle} source={source} resizeMode={FastImage.resizeMode.cover} />
        ) : (
          <ImagePlaceholder categoryName={categoryName || null} size={getSpacing(24)} />
        )}
      </ImageContainer>
    </HeroHeader>
  )
}

const ImageContainer = styled.View({
  bottom: 0,
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
