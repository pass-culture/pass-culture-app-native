import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryIdEnum, VenueTypeCodeKey } from 'api/gen'
import { mapCategoryToIcon, mapVenueTypeToIcon } from 'libs/parsers'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { heroMarginTop, useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { ImagePlaceholder, ImagePlaceholderProps } from 'ui/components/ImagePlaceholder'
import { ColorsEnum, getSpacing, Spacer, getShadow } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

type HeroProps =
  | { type: 'offer'; categoryId: CategoryIdEnum | null }
  | { type: 'venue'; venueType: VenueTypeCodeKey | null }

export const Hero: React.FC<HeroProps & { imageUrl?: string }> = (props) => {
  const { imageUrl, ...placeholderProps } = props
  const source = useMemo(() => ({ uri: imageUrl }), [imageUrl])
  const { heroBackgroundHeight, imageStyle } = useHeroDimensions(placeholderProps.type, !!imageUrl)

  return (
    <HeroHeader type={placeholderProps.type} imageHeight={heroBackgroundHeight} imageUrl={imageUrl}>
      <Spacer.Column numberOfSpaces={heroMarginTop} />
      <ImageContainer style={imageStyle} testID="image-container">
        {imageUrl ? (
          <FastImage style={imageStyle} source={source} resizeMode={FastImage.resizeMode.cover} />
        ) : (
          <ImagePlaceholder {...getPlaceholderContent(placeholderProps)} size={getSpacing(24)} />
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

function getPlaceholderContent(props: HeroProps): Omit<ImagePlaceholderProps, 'size'> {
  if (props.type === 'offer') {
    return {
      Icon: mapCategoryToIcon(props.categoryId),
      backgroundColors: [ColorsEnum.GREY_LIGHT, ColorsEnum.GREY_MEDIUM],
      borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    }
  }
  return {
    Icon: mapVenueTypeToIcon(props.venueType),
    borderRadius: BorderRadiusEnum.BUTTON,
    iconColor: ColorsEnum.WHITE,
  }
}
