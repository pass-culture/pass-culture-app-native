import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'

const Horizontal = styled.View<{ color?: ColorsType }>(({ color, theme }) => ({
  width: '100%',
  height: 1,
  backgroundColor: color ?? theme.designSystem.color.background.subtle,
}))

const Vertical = styled.View<{ color?: ColorsType; height?: number }>(
  ({ color, theme, height }) => ({
    width: 1,
    backgroundColor: color ?? theme.designSystem.color.background.subtle,
    height: height ?? '100%',
  })
)
const HorizontalWithMargin = styled(Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))

export const Separator = { Horizontal, Vertical, HorizontalWithMargin }
