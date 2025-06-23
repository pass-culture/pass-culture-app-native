import { theme } from 'theme'

export const getTagColor = (color: string) => {
  switch (color) {
    case 'Gold':
      return theme.colors.goldDark
    case 'Aquamarine':
      return theme.colors.aquamarineDark
    case 'SkyBlue':
      return theme.colors.skyBlueDark
    case 'DeepPink':
      return theme.colors.deepPinkDark
    case 'Coral':
      return theme.colors.coralDark
    case 'Lilac':
      return theme.colors.lilacDark
    default:
      return theme.designSystem.color.background.inverted
  }
}
