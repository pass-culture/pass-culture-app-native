import React, { ComponentProps, FunctionComponent } from 'react'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { heroMarginTop, useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { ImagePlaceholder as DefaultImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { Tag } from 'ui/components/Tag/Tag'
import { Camera } from 'ui/svg/icons/Camera'
import { getSpacing, Spacer, getShadow } from 'ui/theme'

type HeroProps = {
  categoryId: CategoryIdEnum | null
  imageUrl?: string
  shouldDisplayOfferPreview?: boolean
  onPress?: VoidFunction
}

// Special case where theme.icons.sizes is not used
const PLACEHOLDER_ICON_SIZE = getSpacing(24)

export const Hero: FunctionComponent<HeroProps> = ({
  categoryId,
  imageUrl,
  shouldDisplayOfferPreview,
  onPress,
}) => {
  const { heroBackgroundHeight, imageStyle } = useHeroDimensions()

  const ImagePlaceholder = styled(DefaultImagePlaceholder).attrs(
    ({ theme }): ComponentProps<typeof DefaultImagePlaceholder> => ({
      Icon: mapCategoryToIcon(categoryId),
      backgroundColors: [theme.colors.greyLight, theme.colors.greyMedium],
      borderRadius: theme.borderRadius.radius,
      size: PLACEHOLDER_ICON_SIZE,
    })
  )({
    position: 'absolute',
    zIndex: 1,
  })

  return (
    <HeroHeader imageHeight={heroBackgroundHeight} imageUrl={imageUrl} onPress={onPress}>
      <Spacer.Column numberOfSpaces={heroMarginTop} />
      <ImageContainer style={imageStyle} testID="image-container">
        {imageUrl ? (
          <React.Fragment>
            {shouldDisplayOfferPreview ? <StyledLinearGradient testID="image-gradient" /> : null}
            <StyledFastImage
              style={imageStyle}
              url={imageUrl}
              resizeMode={FastImage.resizeMode?.cover}
            />
            {shouldDisplayOfferPreview ? (
              <StyledTag label="1" Icon={StyledCamera} testID="image-tag" />
            ) : null}
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

const StyledTag = styled(Tag)({
  position: 'absolute',
  right: getSpacing(2),
  bottom: getSpacing(2),
  zIndex: 3,
})

const StyledCamera = styled(Camera).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

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
