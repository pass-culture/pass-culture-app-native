import { BackgroundColor, BackgroundColorKey } from 'theme/types'
import { GradientColor } from 'ui/theme/gradientImagesMapping'

export const isBackgroundColorKey = (
  value: GradientColor,
  background: BackgroundColor
): value is BackgroundColorKey => value in background
