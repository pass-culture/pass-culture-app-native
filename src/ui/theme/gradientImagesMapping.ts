import { Color } from 'features/home/types'
import { BackgroundColorKey } from 'theme/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export type GradientColor = ColorsEnum | BackgroundColorKey

export const gradientImagesMapping: Record<keyof typeof Color, [GradientColor, GradientColor]> = {
  Gold: [ColorsEnum.LILAC_LIGHT, ColorsEnum.GOLD_LIGHT_100],
  Aquamarine: [ColorsEnum.LILAC_LIGHT, ColorsEnum.AQUAMARINE_LIGHT],
  SkyBlue: [ColorsEnum.DEEP_PINK_LIGHT, ColorsEnum.SKY_BLUE_LIGHT],
  DeepPink: [ColorsEnum.AQUAMARINE_LIGHT, ColorsEnum.DEEP_PINK_LIGHT],
  Coral: [ColorsEnum.SKY_BLUE_LIGHT, ColorsEnum.CORAL_LIGHT],
  Lilac: [ColorsEnum.DEEP_PINK_LIGHT, ColorsEnum.LILAC_LIGHT],
  Decorative01: ['decorative04', 'decorative01'],
  Decorative02: ['decorative05', 'decorative02'],
  Decorative03: ['decorative04', 'decorative03'],
  Decorative04: ['decorative05', 'decorative04'],
  Decorative05: ['decorative03', 'decorative05'],
}
