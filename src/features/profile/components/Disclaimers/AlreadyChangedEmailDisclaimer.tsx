import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Clock } from 'ui/svg/icons/Clock'
import { getSpacingString, Typo } from 'ui/theme'

export const AlreadyChangedEmailDisclaimer = () => {
  useEffect(() => {
    analytics.logConsultDisclaimerValidationMail()
  }, [])

  return (
    <Container gap={4}>
      <StyledClock />
      <BodyText>
        Une demande a été envoyée à ta nouvelle adresse. Tu as 24h pour la valider. Pense à vérifier
        tes spams.
      </BodyText>
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacingString(4),
  background: theme.designSystem.color.background.subtle,
  borderRadius: theme.designSystem.size.borderRadius.m,
}))

const StyledClock = styled(Clock).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``

const BodyText = styled(Typo.BodyAccentXs)({
  flexShrink: 1,
})
