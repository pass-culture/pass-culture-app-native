import colorAlpha from 'color-alpha'
import styled from 'styled-components/native'

import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'

export const BlackBackground = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  paddingBottom: theme.designSystem.size.spacing.l,
  paddingTop: theme.designSystem.size.spacing.s,
  backgroundColor: colorAlpha(
    theme.designSystem.color.background.lockedInverted,
    TEXT_BACKGROUND_OPACITY
  ),
}))
