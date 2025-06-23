import React from 'react'
import { Platform } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers/category'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { AppThemeType } from 'theme'
import { ImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getShadow, getSpacing } from 'ui/theme'

type SizeProp = keyof AppThemeType['tiles']['sizes']
type StyleProps = {
  size: SizeProp
  borderRadius?: number
  withStroke?: boolean
  withShadow?: boolean
}

type Props = {
  imageUrl?: string
  categoryId?: CategoryIdEnum | null
  size?: SizeProp
  borderRadius?: number
  withStroke?: boolean
  withContainerStroke?: boolean
  withShadow?: boolean
}

export const OfferImage: React.FC<Props> = ({
  categoryId,
  imageUrl,
  size = 'small',
  borderRadius,
  withStroke,
  withContainerStroke,
  withShadow = true,
}) => {
  const Icon = mapCategoryToIcon(categoryId || null)

  return (
    <Container
      size={size}
      borderRadius={borderRadius}
      withStroke={withContainerStroke}
      withShadow={withShadow}>
      {imageUrl ? (
        <StyledFastImage
          url={imageUrl}
          resizeMode={FastImage.resizeMode?.cover}
          size={size}
          borderRadius={borderRadius}
          withStroke={withStroke}
        />
      ) : (
        <StyledImagePlaceholder Icon={Icon} />
      )}
    </Container>
  )
}

const StyledFastImage = styled(ResizedFastImage).attrs<StyleProps>(({ theme, size }) => ({
  ...theme.tiles.sizes[size],
}))<StyleProps>(({ theme, size, borderRadius, withStroke }) => ({
  backgroundColor: theme.designSystem.color.background.subtle,
  ...theme.tiles.sizes[size],
  borderRadius: borderRadius || theme.tiles.borderRadius,
  ...(withStroke
    ? {
        borderWidth: 1,
        borderColor: theme.designSystem.color.border.default,
      }
    : {}),
}))

const StyledImagePlaceholder = styled(ImagePlaceholder).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
  borderRadius: theme.tiles.borderRadius,
}))``

const Container = styled.View<StyleProps>(
  ({ theme, size, borderRadius, withStroke, withShadow }) => ({
    borderRadius: borderRadius || theme.tiles.borderRadius,
    ...theme.tiles.sizes[size],
    ...(!withShadow || Platform.OS === 'web'
      ? {}
      : getShadow({
          shadowOffset: { width: 0, height: getSpacing(1) },
          shadowRadius: getSpacing(1),
          shadowColor: theme.colors.greyDark,
          shadowOpacity: 0.2,
        })),
    backgroundColor: theme.colors.white,
    ...(withStroke
      ? {
          borderWidth: 1,
          borderColor: theme.colors.greySemiDark,
        }
      : {}),
  })
)
