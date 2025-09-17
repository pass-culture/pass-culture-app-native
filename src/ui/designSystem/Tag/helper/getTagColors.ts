import { DefaultTheme } from 'styled-components/native'

import { BackgroundColorKey, IconColorKey } from 'theme/types'
import { TagColorStyles, TagVariant } from 'ui/designSystem/Tag/types'

import { variantBackground, variantIconColor, variantLabelColor } from '../Tag.variants'

type GetTagColorsParams = {
  variant: TagVariant
  background: Record<BackgroundColorKey, string>
  icon: Record<IconColorKey, string>
  theme: DefaultTheme
}

export function getTagColors({
  variant,
  background,
  icon,
  theme,
}: GetTagColorsParams): TagColorStyles {
  return {
    backgroundColor: background[variantBackground[variant]],
    iconColor: icon[variantIconColor[variant]],
    labelColor: variantLabelColor[variant],
    iconSize: theme.icons.sizes.extraSmall,
  }
}
