import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { GenericSuspendedAccount } from 'features/auth/pages/suspendedAccount/GenericSuspendedAccount/GenericSuspendedAccount'
import { analytics } from 'libs/analytics/provider'
import { Typo } from 'ui/theme'

export const SuspiciousLoginSuspendedAccount = () => {
  const { designSystem } = useTheme()
  const onBeforeNavigateContactFraudTeam = () => {
    analytics.logContactFraudTeam({ from: 'suspiciousloginsuspendedaccount' })
  }

  return (
    <GenericSuspendedAccount onBeforeNavigateContactFraudTeam={onBeforeNavigateContactFraudTeam}>
      <StyledBody>En raison d’une activité suspicieuse, ton compte a été suspendu.</StyledBody>
      <StyledBody marginTop={designSystem.size.spacing.xl}>
        Si tu souhaites revoir cette décision, tu peux contacter le service fraude.
      </StyledBody>
    </GenericSuspendedAccount>
  )
}

const StyledBody = styled(Typo.Body)<{ marginTop?: number }>(({ marginTop }) => ({
  textAlign: 'center',
  marginTop,
}))
