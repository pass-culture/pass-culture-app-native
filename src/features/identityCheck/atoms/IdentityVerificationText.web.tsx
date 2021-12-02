import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentityVerificationText = () => (
  <Container>
    <Title>{t`Vérifie ton identité sur ton smartphone`}</Title>
    <Spacer.Column numberOfSpaces={6} />
    <Body>
      {t`Gagne du temps en vérifiant ton identité directement sur ton smartphone ! Sinon tu peux passer par le site Démarches-Simplifiées mais le traitement sera plus long.`}
    </Body>
    <Spacer.Column numberOfSpaces={2} />
    <Body>
      {t`Prends une photo de ta carte d'identité ou de ton passeport en cours de validité pour accéder à ton pass Culture.`}
    </Body>
  </Container>
)

const Container = styled.View({ marginHorizontal: getSpacing(2) })
const Title = styled(Typo.Title4)({ textAlign: 'center', fontFamily: 'Montserrat-Bold' })
const Body = styled(Typo.Body).attrs({
  color: ColorsEnum.GREY_DARK,
})({
  textAlign: 'center',
})
