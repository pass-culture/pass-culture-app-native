import { Color } from 'features/home/types'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { BackgroundColorKey, IllustrationColorKey } from 'theme/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const videoModuleColorsMapping: Record<
  keyof typeof Color,
  ColorsEnum | BackgroundColorKey | IllustrationColorKey
> = {
  Aquamarine: theme.colors.aquamarineLight,
  Coral: theme.colors.coralLight,
  Decorative01: 'decorative01',
  Decorative02: 'decorative02',
  Decorative03: 'decorative03',
  Decorative04: 'decorative04',
  Decorative05: 'decorative05',
  DeepPink: theme.colors.deepPinkLight,
  Gold: theme.colors.goldLight100,
  Information01: 'information01',
  Information03: 'information03',
  Information04: 'information04',
  Lilac: theme.colors.lilacLight,
  Negative01: 'negative01',
  Pending01: 'pending01',
  Positive01: 'positive01',
  SkyBlue: theme.colors.skyBlueLight,
}
