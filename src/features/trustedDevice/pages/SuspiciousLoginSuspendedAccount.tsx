import React from 'react'
import styled from 'styled-components/native'

import { GenericSuspendedAccount } from 'features/auth/pages/suspendedAccount/GenericSuspendedAccount/GenericSuspendedAccount'
import { analytics } from 'libs/analytics/provider'
import { Typo, getSpacing } from 'ui/theme'

export const SuspiciousLoginSuspendedAccount = () => {
  const onBeforeNavigateContactFraudTeam = () => {
    analytics.logContactFraudTeam({ from: 'suspiciousloginsuspendedaccount' })
  }

  return (
    <GenericSuspendedAccount onBeforeNavigateContactFraudTeam={onBeforeNavigateContactFraudTeam}>
      <StyledBody>En raison d’une activité suspicieuse, ton compte a été suspendu.</StyledBody>
      <StyledBody marginTop={getSpacing(5)}>
        Si tu souhaites revoir cette décision, tu peux contacter le service fraude.
      </StyledBody>
    </GenericSuspendedAccount>
  )
}

const StyledBody = styled(Typo.Body)<{ marginTop?: number }>(({ marginTop }) => ({
  textAlign: 'center',
  marginTop,
}))
