import { Color } from 'features/home/types'
import { theme } from 'theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const videoModuleColorsMapping: Record<keyof typeof Color, ColorsEnum> = {
  Gold: theme.colors.goldLight100,
  Aquamarine: theme.colors.aquamarineLight,
  SkyBlue: theme.colors.skyBlueLight,
  DeepPink: theme.colors.deepPinkLight,
  Coral: theme.colors.coralLight,
  Lilac: theme.colors.lilacLight,
}
