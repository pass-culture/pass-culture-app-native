import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentityVerificationText = () => (
  <Container>
    <Title>{t`Vérification de l'identité`}</Title>
    <Spacer.Column numberOfSpaces={6} />
    <Body>
      {t`Pour pouvoir profiter de l'aide financière de 300 euros proposée par le Gouvernement, nous avons besoin de ta`}
      <Bold>{'\u00a0' + t`carte d'identité` + '\u00a0'}</Bold>
      {t`ou de ton`}
      <Bold>{'\u00a0' + t`passport` + '\u00a0'}</Bold>
      {t`pour valider ton profil !`}
    </Body>
  </Container>
)

const Container = styled.View({ marginHorizontal: getSpacing(2) })
const Title = styled(Typo.Title4)({ textAlign: 'center' })
const Body = styled(Typo.Body)({ textAlign: 'center' })
const Bold = styled(Typo.Body)({ fontFamily: 'Montserrat-Bold' })
