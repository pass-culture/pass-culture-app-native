import styled, { DefaultTheme } from 'styled-components/native'

import { QFBonificationStatus } from 'api/gen'
import { getSpacing } from 'ui/theme'

export const DashedStepContainer = styled.View<{
  bonificationStatus: QFBonificationStatus | null | undefined
}>(({ theme, bonificationStatus }) => ({
  borderColor: theme.designSystem.color.border.brandPrimary,
  borderWidth: getSpacing(0.25),
  borderRadius: theme.designSystem.size.borderRadius.m,
  borderStyle: 'dashed',
  padding: theme.designSystem.size.spacing.l,
  overflow: 'hidden',
  backgroundColor: getBackgroundColorByStatus(bonificationStatus, theme),
  marginVertical: theme.designSystem.size.spacing.m,
}))

const getBackgroundColorByStatus = (
  status: QFBonificationStatus | null | undefined,
  theme: DefaultTheme
) => {
  switch (status) {
    case QFBonificationStatus.granted:
      return theme.designSystem.color.background.default
    case QFBonificationStatus.started:
      return theme.designSystem.color.background.disabled
    default:
      return theme.designSystem.color.background.info
  }
}
