import { theme } from 'theme'

export const getGradientColors = (color: string) => {
  switch (color) {
    case 'Gold':
      return [theme.colors.goldLight, theme.colors.gold]
    case 'Aquamarine':
      return [theme.colors.aquamarineLight, theme.colors.aquamarine]
    case 'SkyBlue':
      return [theme.colors.skyBlueLight, theme.colors.skyBlue]
    case 'DeepPink':
      return [theme.colors.deepPinkLight, theme.colors.deepPink]
    case 'Coral':
      return [theme.colors.coralLight, theme.colors.coral]
    case 'Lilac':
      return [theme.colors.lilacLight, theme.colors.lilac]
    default:
      return [theme.colors.white, theme.colors.white]
  }
}
