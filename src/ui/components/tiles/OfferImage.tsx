import React from 'react'
import { Platform } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { ImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getShadow, getSpacing } from 'ui/theme'

type SizeProps = {
  size?: 'small' | 'tall'
}

type Props = {
  imageUrl?: string
  categoryId?: CategoryIdEnum | null
} & SizeProps

export const OfferImage: React.FC<Props> = ({ categoryId, imageUrl, size = 'small' }) => {
  const Icon = mapCategoryToIcon(categoryId || null)

  return (
    <Container size={size}>
      {imageUrl ? (
        <StyledFastImage url={imageUrl} resizeMode={FastImage.resizeMode.cover} size={size} />
      ) : (
        <StyledImagePlaceholder Icon={Icon} />
      )}
    </Container>
  )
}

const StyledFastImage = styled(ResizedFastImage)<SizeProps>(({ theme, size }) => ({
  backgroundColor: theme.colors.greyLight,
  ...(size === 'small' ? theme.tiles.sizes.small : theme.tiles.sizes.tall),
  borderRadius: theme.tiles.borderRadius,
}))

const StyledImagePlaceholder = styled(ImagePlaceholder).attrs(({ theme }) => ({
  backgroundColors: [theme.colors.greyLight, theme.colors.greyMedium],
  size: theme.icons.sizes.standard,
  borderRadius: theme.tiles.borderRadius,
}))``

const Container = styled.View<SizeProps>(({ theme, size }) => ({
  borderRadius: theme.tiles.borderRadius,
  ...(size === 'small' ? theme.tiles.sizes.small : theme.tiles.sizes.tall),
  ...(Platform.OS !== 'web'
    ? getShadow({
        shadowOffset: { width: 0, height: getSpacing(1) },
        shadowRadius: getSpacing(1),
        shadowColor: theme.colors.greyDark,
        shadowOpacity: 0.2,
      })
    : {}),
}))
