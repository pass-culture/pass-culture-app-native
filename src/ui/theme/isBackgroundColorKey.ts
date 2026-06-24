import { BackgroundColor, BackgroundColorKey } from 'theme/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type ColorValue = ColorsEnum | BackgroundColorKey

export const isBackgroundColorKey = (
  value: ColorValue,
  background: BackgroundColor
): value is BackgroundColorKey => value in background
