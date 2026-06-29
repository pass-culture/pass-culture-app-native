import { CategoryHeaderColor, Color } from 'features/home/types'
import { DesignTokensType, IllustrationColorKey } from 'theme/types'

const DEFAULT_CATEGORY_HEADER_COLOR: IllustrationColorKey = 'information04'

const illustrationColorMapping: Record<CategoryHeaderColor, IllustrationColorKey> = {
  Positive01: 'positive01',
  Negative01: 'negative01',
  Pending01: 'pending01',
  Information01: 'information01',
  Information04: 'information04',
}

const categoryBlockColorMapping: Record<CategoryHeaderColor, Color> = {
  Positive01: Color.Aquamarine,
  Negative01: Color.DeepPink,
  Pending01: Color.Coral,
  Information01: Color.Lilac,
  Information04: Color.SkyBlue,
}

const isCategoryHeaderColor = (color: Color | CategoryHeaderColor): color is CategoryHeaderColor =>
  color in categoryBlockColorMapping

export const getCategoryHeaderBackgroundColor = (
  color: Color | CategoryHeaderColor,
  illustrationColors: DesignTokensType['color']['illustration']
) =>
  illustrationColors[
    isCategoryHeaderColor(color) ? illustrationColorMapping[color] : DEFAULT_CATEGORY_HEADER_COLOR
  ]

export const getCategoryBlockColor = (color: Color | CategoryHeaderColor): Color =>
  isCategoryHeaderColor(color) ? categoryBlockColorMapping[color] : color
