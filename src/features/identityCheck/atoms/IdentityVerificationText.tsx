import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentityVerificationText = () => (
  <Container>
    <Title>{t`Vérification de l'identité`}</Title>
    <Spacer.Column numberOfSpaces={6} />
    <Body>
      {t`Prends une photo de ta`}
      <Bold>{'\u00a0' + t`carte d'identité` + '\u00a0'}</Bold>
      {t`ou de ton`}
      <Bold>{'\u00a0' + t`passeport` + '\u00a0'}</Bold>
      {t`en cours de validité pour accéder à ton pass Culture.`}
    </Body>
  </Container>
)

const Container = styled.View({ marginHorizontal: getSpacing(2) })
const Title = styled(Typo.Title4)({ textAlign: 'center' })
const Body = styled(Typo.Body)({ textAlign: 'center' })
const Bold = styled(Typo.Body)({ fontFamily: 'Montserrat-Bold' })
