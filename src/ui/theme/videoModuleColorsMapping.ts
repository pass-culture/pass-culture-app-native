import { Color } from 'features/home/types'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { BackgroundColorKey } from 'theme/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const videoModuleColorsMapping: Record<keyof typeof Color, ColorsEnum | BackgroundColorKey> =
  {
    Gold: theme.colors.goldLight100,
    Aquamarine: theme.colors.aquamarineLight,
    SkyBlue: theme.colors.skyBlueLight,
    DeepPink: theme.colors.deepPinkLight,
    Coral: theme.colors.coralLight,
    Lilac: theme.colors.lilacLight,
    Decorative01: 'decorative01',
    Decorative02: 'decorative02',
    Decorative03: 'decorative03',
    Decorative04: 'decorative04',
    Decorative05: 'decorative05',
  }
