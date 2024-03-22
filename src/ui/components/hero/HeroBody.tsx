import React, { ComponentProps, FunctionComponent } from 'react'
import { View } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers/category'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { ImagePlaceholder as DefaultImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { Tag } from 'ui/components/Tag/Tag'
import { Camera } from 'ui/svg/icons/Camera'
import { getShadow, getSpacing } from 'ui/theme'

type Props = {
  categoryId: CategoryIdEnum | null
  imageUrl?: string
  shouldDisplayOfferPreview?: boolean
  isSticky?: boolean
}

// Special case where theme.icons.sizes is not used
const PLACEHOLDER_ICON_SIZE = getSpacing(24)

export const HeroBody: FunctionComponent<Props> = ({
  categoryId,
  imageUrl,
  shouldDisplayOfferPreview,
  isSticky,
}) => {
  const { imageStyle } = useHeroDimensions()
  const headerHeight = useGetHeaderHeight()

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
    <Container
      style={imageStyle}
      isSticky={isSticky}
      headerHeight={headerHeight}
      testID="image-container">
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
    </Container>
  )
}

const Container = styled(View)<{ headerHeight: number; isSticky?: boolean }>(
  ({ headerHeight, isSticky, theme }) => ({
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
    // position sticky only works in web
    ...(isSticky ? { position: 'sticky', top: 48 + headerHeight, zIndex: 1 } : {}),
  })
)

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
