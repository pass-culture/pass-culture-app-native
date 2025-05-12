import { Color } from 'features/home/types'
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
    Orange: 'decorative01',
    Blue: 'decorative02',
    Green: 'decorative03',
    Purple: 'decorative04',
    Pink: 'decorative05',
  }
