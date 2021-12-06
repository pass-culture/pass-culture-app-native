import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Clock } from 'ui/svg/icons/Clock'
import { getSpacingString, Spacer, Typo } from 'ui/theme'

interface Props {
  email: string
}

export const AlreadyChangedEmailDisclaimer = ({ email }: Props) => {
  const message =
    t`Une demande a été envoyée à l’adresse\u00a0:` +
    ' ' +
    email +
    t`. Tu as 24h pour valider ta nouvelle adresse. Pense à vérifier tes spams.`

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

const StyledClock = styled(Clock).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
}))``

const BodyText = styled(Typo.Caption)({
  flexShrink: 1,
})
