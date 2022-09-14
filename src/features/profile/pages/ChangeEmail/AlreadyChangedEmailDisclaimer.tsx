import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { getSpacingString, Spacer, Typo } from 'ui/theme'

export const AlreadyChangedEmailDisclaimer = () => {
  const message = t`Une demande a été envoyée à ta nouvelle adresse. Tu as 24h pour la valider. Pense à vérifier tes spams.`

  useEffect(() => {
    analytics.logConsultDisclaimerValidationMail()
  }, [])

  return (
    <Container>
      <StyledClock />
      <Spacer.Row numberOfSpaces={4}></Spacer.Row>
      <BodyText>{message}</BodyText>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacingString(4),
  background: theme.colors.greyLight,
  borderRadius: theme.borderRadius.radius,
}))

const StyledClock = styled(BicolorClock).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  color2: theme.colors.greyDark,
}))``

const BodyText = styled(Typo.Caption)({
  flexShrink: 1,
})
