import React from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon, mapVenueTypeToIcon, VenueTypeCode } from 'libs/parsers'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { heroMarginTop, useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { ImagePlaceholder as DefaultImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getSpacing, Spacer, getShadow } from 'ui/theme'

type HeroProps =
  | { type: 'offer'; categoryId: CategoryIdEnum | null }
  | { type: 'venue'; venueType: VenueTypeCode | null }

// Special case where theme.icons.sizes is not used
const PLACEHOLDER_ICON_SIZE = getSpacing(24)

export const Hero: React.FC<HeroProps & { imageUrl?: string }> = (props) => {
  const { imageUrl, ...placeholderProps } = props
  const { heroBackgroundHeight, imageStyle } = useHeroDimensions(placeholderProps.type, !!imageUrl)

  const ImagePlaceholder = styled(DefaultImagePlaceholder).attrs(({ theme }) =>
    placeholderProps.type === 'offer'
      ? {
          Icon: mapCategoryToIcon(placeholderProps.categoryId),
          backgroundColors: [theme.colors.greyLight, theme.colors.greyMedium],
          borderRadius: theme.borderRadius.radius,
          size: PLACEHOLDER_ICON_SIZE,
        }
      : {
          Icon: mapVenueTypeToIcon(placeholderProps.venueType),
          borderRadius: theme.borderRadius.button,
          iconColor: theme.colors.white,
          size: PLACEHOLDER_ICON_SIZE,
        }
  )``

  return (
    <HeroHeader type={placeholderProps.type} imageHeight={heroBackgroundHeight} imageUrl={imageUrl}>
      <Spacer.Column numberOfSpaces={heroMarginTop} />
      <ImageContainer style={imageStyle} testID="image-container">
        {imageUrl ? (
          <StyledFastImage
            style={imageStyle}
            url={imageUrl}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </ImageContainer>
    </HeroHeader>
  )
}

const StyledFastImage = styled(ResizedFastImage)(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
}))

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
