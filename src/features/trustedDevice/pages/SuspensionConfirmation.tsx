import React from 'react'
import styled from 'styled-components/native'

import { GenericSuspendedAccount } from 'features/auth/pages/suspendedAccount/GenericSuspendedAccount/GenericSuspendedAccount'
import { Spacer, Typo } from 'ui/theme'

export const SuspensionConfirmation = () => (
  <GenericSuspendedAccount>
    <StyledBody>En raison d’une activité suspicieuse, ton compte a été suspendu.</StyledBody>
    <Spacer.Column numberOfSpaces={5} />
    <StyledBody>
      Si tu souhaites revoir cette décision, tu peux contacter le service fraude.
    </StyledBody>
  </GenericSuspendedAccount>
)

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
