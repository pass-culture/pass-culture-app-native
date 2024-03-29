import styled from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

const Horizontal = styled.View<{ color?: ColorsEnum }>(({ color, theme }) => ({
  width: '100%',
  height: 1,
  backgroundColor: color ?? theme.colors.greyLight,
}))

const Vertical = styled.View<{ color?: ColorsEnum; height?: number }>(
  ({ color, theme, height }) => ({
    width: 1,
    backgroundColor: color ?? theme.colors.greySemiDark,
    height: height ?? '100%',
  })
)

export const Separator = { Horizontal, Vertical }
