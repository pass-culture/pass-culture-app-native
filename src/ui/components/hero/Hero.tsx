import React, { ComponentProps, FunctionComponent } from 'react'
import { Platform } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon, mapVenueTypeToIcon, VenueTypeCode } from 'libs/parsers'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { heroMarginTop, useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { ImagePlaceholder as DefaultImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getSpacing, Spacer, getShadow } from 'ui/theme'

type HeroProps = (
  | { type: 'offer'; categoryId: CategoryIdEnum | null }
  | { type: 'offerv2'; categoryId: CategoryIdEnum | null }
  | { type: 'venue'; venueType: VenueTypeCode | null }
) & { imageUrl?: string; enableOfferPreview?: boolean }

// Special case where theme.icons.sizes is not used
const PLACEHOLDER_ICON_SIZE = getSpacing(24)

export const Hero: FunctionComponent<HeroProps> = (props) => {
  const { imageUrl, enableOfferPreview, ...placeholderProps } = props
  const { heroBackgroundHeight, imageStyle } = useHeroDimensions({
    type: placeholderProps.type,
    hasImage: !!imageUrl,
  })

  const ImagePlaceholder = styled(DefaultImagePlaceholder).attrs(
    ({ theme }): ComponentProps<typeof DefaultImagePlaceholder> =>
      placeholderProps.type === 'offer' || placeholderProps.type === 'offerv2'
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
  )({
    position: 'absolute',
    zIndex: 1,
  })

  const shouldDisplayLinearGradient =
    enableOfferPreview && placeholderProps.type === 'offerv2' && Platform.OS !== 'web'

  return (
    <HeroHeader type={placeholderProps.type} imageHeight={heroBackgroundHeight} imageUrl={imageUrl}>
      <Spacer.Column numberOfSpaces={heroMarginTop} />
      <ImageContainer style={imageStyle} testID="image-container">
        {imageUrl ? (
          <React.Fragment>
            {shouldDisplayLinearGradient ? <StyledLinearGradient testID="image-gradient" /> : null}
            <StyledFastImage
              style={imageStyle}
              url={imageUrl}
              resizeMode={FastImage.resizeMode?.cover}
            />
          </React.Fragment>
        ) : (
          <ImagePlaceholder />
        )}
      </ImageContainer>
    </HeroHeader>
  )
}

const StyledFastImage = styled(ResizedFastImage)(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  position: 'absolute',
  zIndex: 1,
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

const StyledLinearGradient = styled(LinearGradient).attrs({
  useAngle: true,
  angle: 180,
  locations: [0.362, 0.6356, 1],
  colors: ['rgba(0, 0, 0, 0.00)', 'rgba(0, 0, 0, 0.12)', 'rgba(0, 0, 0, 0.32)'],
})(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: theme.borderRadius.radius,
  zIndex: 2,
}))
