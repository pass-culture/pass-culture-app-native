import React from 'react'
import styled from 'styled-components/native'

import { GenericSuspendedAccount } from 'features/auth/pages/suspendedAccount/GenericSuspendedAccount/GenericSuspendedAccount'
import { Spacer, Typo } from 'ui/theme'

export const FraudulentSuspendedAccount = () => (
  <GenericSuspendedAccount>
    <StyledBody>Ton compte est actuellement suspendu pour des raisons de sécurité.</StyledBody>
    <Spacer.Column numberOfSpaces={5} />
    <StyledBody>
      Pour en savoir plus, tu peux contacter l’équipe de lutte contre la fraude.
    </StyledBody>
  </GenericSuspendedAccount>
)

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
