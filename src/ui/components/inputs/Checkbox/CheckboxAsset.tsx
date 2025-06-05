import React from 'react'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import styled, { useTheme } from 'styled-components/native'

import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { AppThemeType } from 'theme'
import { Tag, TagProps } from 'ui/components/Tag/Tag'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type SizeProp = keyof AppThemeType['image']['square']['sizes']
type StyleProps = {
  size: SizeProp
  borderRadius?: number
  withStroke?: boolean
  withShadow?: boolean
}

export type CheckboxAssetProps =
  | {
      variant: 'icon'
      Icon: React.FC<AccessibleIcon>
      src?: never
      size?: never
      text?: never
      tag?: never
    }
  | {
      variant: 'tag'
      tag: TagProps
      src?: never
      size?: never
      text?: never
      Icon?: never
    }
  | {
      variant: 'text'
      text: string
      src?: never
      size?: never
      Icon?: never
      tag?: never
    }
  | {
      variant: 'image'
      src: string
      size?: SizeProp
      Icon?: never
      text?: never
      tag?: never
    }

export function CheckboxAsset({
  variant,
  Icon,
  src,
  size = 'small',
  text,
  tag,
}: CheckboxAssetProps) {
  const { designSystem, icons } = useTheme()

  if (variant === 'icon') {
    return (
      <Icon
        color={designSystem.color.icon.brandPrimary}
        color2={designSystem.color.icon.brandPrimary}
        size={icons.sizes.standard}
      />
    )
  }

  if (variant === 'image') {
    return <StyledFastImage url={src} size={size} resizeMode={FastImage.resizeMode?.cover} />
  }

  if (variant === 'text') {
    return <Typo.Body>{text}</Typo.Body>
  }

  return <Tag {...tag} />
}

const StyledFastImage = styled(ResizedFastImage).attrs<StyleProps>(({ theme, size }) => ({
  ...theme.image.square.sizes[size],
}))<StyleProps>(({ theme, size }) => ({
  backgroundColor: theme.designSystem.color.background.subtle,
  borderRadius: theme.image.square.borderRadius,
  ...theme.image.square.sizes[size],
}))
