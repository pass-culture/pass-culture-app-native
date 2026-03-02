import React from 'react'
import styled from 'styled-components/native'

import { GenericSuspendedAccount } from 'features/auth/pages/suspendedAccount/GenericSuspendedAccount/GenericSuspendedAccount'
import { analytics } from 'libs/analytics/provider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

export const FraudulentSuspendedAccount = () => (
  <GenericSuspendedAccount onBeforeNavigateContactFraudTeam={onBeforeNavigateContactFraudTeam}>
    <ViewGap gap={5}>
      <StyledBody>Ton compte est actuellement suspendu pour des raisons de sécurité.</StyledBody>
      <StyledBody>
        Pour en savoir plus, tu peux contacter l’équipe de lutte contre la fraude.
      </StyledBody>
    </ViewGap>
  </GenericSuspendedAccount>
)

const onBeforeNavigateContactFraudTeam = () => {
  analytics.logContactFraudTeam({ from: 'fraudulentsuspendedaccount' })
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
