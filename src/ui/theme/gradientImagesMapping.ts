import { Color } from 'features/home/types'
import { BackgroundColorKey, IllustrationColorKey } from 'theme/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export type GradientColor = ColorsEnum | BackgroundColorKey | IllustrationColorKey

export const gradientImagesMapping: Record<keyof typeof Color, [GradientColor, GradientColor]> = {
  Aquamarine: [ColorsEnum.LILAC_LIGHT, ColorsEnum.AQUAMARINE_LIGHT],
  Coral: [ColorsEnum.SKY_BLUE_LIGHT, ColorsEnum.CORAL_LIGHT],
  Decorative01: ['decorative04', 'decorative01'],
  Decorative02: ['decorative05', 'decorative02'],
  Decorative03: ['decorative04', 'decorative03'],
  Decorative04: ['decorative05', 'decorative04'],
  Decorative05: ['decorative03', 'decorative05'],
  DeepPink: [ColorsEnum.AQUAMARINE_LIGHT, ColorsEnum.DEEP_PINK_LIGHT],
  Gold: [ColorsEnum.LILAC_LIGHT, ColorsEnum.GOLD_LIGHT_100],
  Information03: ['information03', 'information03'],
  Information04: ['information04', 'information04'],
  Lilac: [ColorsEnum.DEEP_PINK_LIGHT, ColorsEnum.LILAC_LIGHT],
  Negative01: ['negative01', 'negative01'],
  Pending01: ['pending01', 'pending01'],
  Positive01: ['positive01', 'positive01'],
  SkyBlue: [ColorsEnum.DEEP_PINK_LIGHT, ColorsEnum.SKY_BLUE_LIGHT],
}
