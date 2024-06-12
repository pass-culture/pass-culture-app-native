import { Color } from 'features/home/types'
import { theme } from 'theme'

export const videoModuleMobileColorsMapping: Record<keyof typeof Color, string> = {
  Gold: theme.colors.goldLight100,
  Aquamarine: theme.colors.aquamarineLight,
  SkyBlue: theme.colors.skyBlueLight,
  DeepPink: theme.colors.deepPinkLight,
  Coral: theme.colors.coralLight,
  Lilac: theme.colors.lilacLight,
}
