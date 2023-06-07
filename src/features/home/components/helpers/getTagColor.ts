import { theme } from 'theme'

export const getTagColor = (color: string) => {
  switch (color) {
    case 'Gold':
      return theme.colors.gold
    case 'Aquamarine':
      return theme.colors.aquamarine
    case 'SkyBlue':
      return theme.colors.skyBlue
    case 'DeepPink':
      return theme.colors.deepPink
    case 'Coral':
      return theme.colors.coral
    case 'Lilac':
      return theme.colors.lilac
    default:
      return theme.colors.black
  }
}
