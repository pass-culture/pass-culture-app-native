import React from 'react'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import styled, { useTheme } from 'styled-components/native'

import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { CheckboxAssetProps, SizeProp } from 'ui/components/inputs/Checkbox/types'
import { Tag } from 'ui/components/Tag/Tag'
import { Typo } from 'ui/theme'

type StyleProps = {
  size: SizeProp
  borderRadius?: number
  withStroke?: boolean
  withShadow?: boolean
}

export function CheckboxAsset({
  variant,
  disable = false,
  Icon,
  src,
  size = 'small',
  text,
  tag,
}: CheckboxAssetProps) {
  const { designSystem, icons } = useTheme()

  const iconColor = disable
    ? designSystem.color.icon.disabled
    : designSystem.color.icon.brandPrimary

  if (variant === 'icon') {
    return <Icon color={iconColor} size={icons.sizes.standard} />
  }

  if (variant === 'image') {
    return <StyledFastImage url={src} size={size} resizeMode={FastImage.resizeMode?.cover} />
  }

  if (variant === 'text') {
    return <Typo.Body>{text}</Typo.Body>
  }

  return <Tag {...tag} />
}

const StyledFastImage = styled(ResizedFastImage)<StyleProps>(({ theme, size }) => {
  return {
    backgroundColor: theme.designSystem.color.background.subtle,
    ...theme.image.square.sizes[size],
  }
})
