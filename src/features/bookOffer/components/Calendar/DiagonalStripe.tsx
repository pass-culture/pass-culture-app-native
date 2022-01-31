import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

export const DiagonalStripe = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.white, theme.colors.greyDark, theme.colors.white],
  start: { x: 0.0, y: 0.0 },
  end: { x: 1.0, y: 1.0 },
  locations: [0.48, 0.5, 0.52],
}))``
