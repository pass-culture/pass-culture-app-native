import styled, { DefaultTheme } from 'styled-components/native'

import { DisabilityBonificationStatus, QFBonificationStatus } from 'api/gen'
import { getSpacing } from 'ui/theme'

export const DashedStepContainer = styled.View<{
  bonificationStatus: QFBonificationStatus | DisabilityBonificationStatus | null | undefined
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
  status: QFBonificationStatus | DisabilityBonificationStatus | null | undefined,
  theme: DefaultTheme
) => {
  switch (status) {
    case QFBonificationStatus.ko:
    case DisabilityBonificationStatus.ko:
    case QFBonificationStatus.eligible:
    case DisabilityBonificationStatus.eligible:
    case QFBonificationStatus.application_not_found:
    case DisabilityBonificationStatus.application_not_found:
    case QFBonificationStatus.custodian_not_found:
    case QFBonificationStatus.not_in_tax_household:
    case DisabilityBonificationStatus.person_not_found:
    case DisabilityBonificationStatus.not_recipient:
      return theme.designSystem.color.background.info

    case QFBonificationStatus.started:
    case DisabilityBonificationStatus.started:
    case QFBonificationStatus.too_many_retries:
    case DisabilityBonificationStatus.too_many_retries:
      return theme.designSystem.color.background.disabled

    case QFBonificationStatus.granted:
    case DisabilityBonificationStatus.granted:
    case QFBonificationStatus.not_eligible:
    case DisabilityBonificationStatus.not_eligible:
    case QFBonificationStatus.quotient_familial_too_high:
    default:
      return theme.designSystem.color.background.default
  }
}
