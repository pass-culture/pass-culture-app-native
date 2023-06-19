import { theme } from 'theme'

export const getGradientColors = (color: string) => {
  switch (color) {
    case 'Gold':
      return ['#FA9F16FF', theme.colors.gold]
    case 'Aquamarine':
      return ['#27DCA8FF', theme.colors.aquamarine]
    case 'SkyBlue':
      return ['#20C5E9FF', theme.colors.skyBlue]
    case 'DeepPink':
      return ['#EC3478FF', theme.colors.deepPink]
    case 'Coral':
      return ['#F8733DFF', theme.colors.coral]
    case 'Lilac':
      return ['#AD87FFFF', theme.colors.lilac]
    default:
      return [theme.colors.white, theme.colors.white]
  }
}
