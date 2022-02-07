import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryIdEnum, VenueTypeCodeKey } from 'api/gen'
import { mapCategoryToIcon, mapVenueTypeToIcon } from 'libs/parsers'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { heroMarginTop, useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { ImagePlaceholder as DefaultImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getSpacing, Spacer, getShadow } from 'ui/theme'

type HeroProps =
  | { type: 'offer'; categoryId: CategoryIdEnum | null }
  | { type: 'venue'; venueType: VenueTypeCodeKey | null }

export const Hero: React.FC<HeroProps & { imageUrl?: string }> = (props) => {
  const { imageUrl, ...placeholderProps } = props
  const source = useMemo(() => ({ uri: imageUrl }), [imageUrl])
  const { heroBackgroundHeight, imageStyle } = useHeroDimensions(placeholderProps.type, !!imageUrl)

  const ImagePlaceholder = styled(DefaultImagePlaceholder).attrs(({ theme }) =>
    placeholderProps.type === 'offer'
      ? {
          Icon: mapCategoryToIcon(placeholderProps.categoryId),
          backgroundColors: [theme.colors.greyLight, theme.colors.greyMedium],
          borderRadius: theme.borderRadius.radius,
          size: getSpacing(24),
        }
      : {
          Icon: mapVenueTypeToIcon(placeholderProps.venueType),
          borderRadius: theme.borderRadius.button,
          iconColor: theme.colors.white,
          size: getSpacing(24),
        }
  )``

  return (
    <HeroHeader type={placeholderProps.type} imageHeight={heroBackgroundHeight} imageUrl={imageUrl}>
      <Spacer.Column numberOfSpaces={heroMarginTop} />
      <ImageContainer style={imageStyle} testID="image-container">
        {imageUrl ? (
          <FastImage style={imageStyle} source={source} resizeMode={FastImage.resizeMode.cover} />
        ) : (
          <ImagePlaceholder />
        )}
      </ImageContainer>
    </HeroHeader>
  )
}

const ImageContainer = styled.View(({ theme }) => ({
  bottom: 0,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(2),
    },
    shadowRadius: getSpacing(3),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.2,
  }),
}))
